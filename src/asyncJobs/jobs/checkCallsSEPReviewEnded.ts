import { callDataSource } from '../../datasources';
import { eventBus } from '../../events';
import { Event } from '../../events/event.enum';
import { logger } from '../../utils/Logger';
import { UserOfficeAsyncJob } from '../startAsyncJobs';

const checkCallsReviewEnded = async () => {
  try {
    const notEndedCalls = await callDataSource.getCalls({
      isSEPReviewEnded: false,
    });

    const currentDate = new Date();

    const callsThatShouldEndReview = notEndedCalls.filter(
      notEndedCall =>
        notEndedCall.endSEPReview.getTime() <= currentDate.getTime()
    );

    callsThatShouldEndReview.forEach(async callThatShouldEndReview => {
      const updatedCall = await callDataSource.update({
        ...callThatShouldEndReview,
        callSEPReviewEnded: true,
      });

      // NOTE: Fire the "CALL_SEP_REVIEW_ENDED" event.
      eventBus.publish({
        type: Event.CALL_SEP_REVIEW_ENDED,
        call: updatedCall,
        isRejection: false,
        key: 'call',
        loggedInUserId: 0,
      });
    });
  } catch (error) {
    logger.logError('Checking and ending calls review failed: ', error);
  }
};

// NOTE: Run every day at 00:07
const options = { timeToRun: '7 0 * * *' };

const checkCallsReviewEndedJob: UserOfficeAsyncJob = {
  functionToRun: checkCallsReviewEnded,
  options,
};

export default checkCallsReviewEndedJob;
