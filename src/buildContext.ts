import { BasicResolverContext } from './context';
// Site specific imports (only ESS atm)
import {
  userDataSource,
  reviewDataSource,
  eventLogsDataSource,
  proposalDataSource,
  templateDataSource,
  callDataSource,
  fileDataSource,
  adminDataSource,
  sepDataSource,
} from './datasources';
import AdminMutations from './mutations/AdminMutations';
import CallMutations from './mutations/CallMutations';
import FileMutations from './mutations/FileMutations';
import ProposalMutations from './mutations/ProposalMutations';
import ReviewMutations from './mutations/ReviewMutations';
import SEPMutations from './mutations/SEPMutations';
import TemplateMutations from './mutations/TemplateMutations';
import UserMutations from './mutations/UserMutations';
import AdminQueries from './queries/AdminQueries';
import CallQueries from './queries/CallQueries';
import EventLogQueries from './queries/EventLogQueries';
import FileQueries from './queries/FileQueries';
import ProposalQueries from './queries/ProposalQueries';
import ReviewQueries from './queries/ReviewQueries';
import SEPQueries from './queries/SEPQueries';
import TemplateQueries from './queries/TemplateQueries';
import UserQueries from './queries/UserQueries';
import { logger } from './utils/Logger';
import { userAuthorization } from './utils/UserAuthorization';

// From this point nothing is site-specific
const userQueries = new UserQueries(userDataSource, userAuthorization);
const userMutations = new UserMutations(userDataSource, userAuthorization);

const proposalQueries = new ProposalQueries(
  proposalDataSource,
  userAuthorization,
  logger
);
const proposalMutations = new ProposalMutations(
  proposalDataSource,
  templateDataSource,
  userAuthorization,
  logger
);

const reviewQueries = new ReviewQueries(reviewDataSource, userAuthorization);
const reviewMutations = new ReviewMutations(
  reviewDataSource,
  userAuthorization
);

const callQueries = new CallQueries(callDataSource, userAuthorization);
const callMutations = new CallMutations(callDataSource, userAuthorization);

const fileQueries = new FileQueries(fileDataSource, userAuthorization);
const fileMutations = new FileMutations(fileDataSource, userAuthorization);

const adminQueries = new AdminQueries(adminDataSource, userAuthorization);
const adminMutations = new AdminMutations(adminDataSource, userAuthorization);

const templateQueries = new TemplateQueries(
  templateDataSource,
  userAuthorization,
  logger
);
const templateMutations = new TemplateMutations(
  templateDataSource,
  userAuthorization,
  logger
);

const eventLogQueries = new EventLogQueries(
  eventLogsDataSource,
  userAuthorization
);

const sepQueries = new SEPQueries(sepDataSource);
const sepMutations = new SEPMutations(sepDataSource);

const context: BasicResolverContext = {
  userAuthorization,
  queries: {
    user: userQueries,
    proposal: proposalQueries,
    review: reviewQueries,
    call: callQueries,
    file: fileQueries,
    admin: adminQueries,
    template: templateQueries,
    eventLogs: eventLogQueries,
    sep: sepQueries,
  },
  mutations: {
    user: userMutations,
    proposal: proposalMutations,
    review: reviewMutations,
    call: callMutations,
    file: fileMutations,
    admin: adminMutations,
    sep: sepMutations,
    template: templateMutations,
  },
};

export default context;
