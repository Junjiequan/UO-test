import ReviewMutations from "./ReviewMutations";
import { EventBus } from "../events/eventBus";
import { UserAuthorization } from "../utils/UserAuthorization";
import {
  reviewDataSource,
  dummyReview
} from "../datasources/mockups/ReviewDataSource";
import { ApplicationEvent } from "../events/applicationEvents";
import { proposalDataSource } from "../datasources/mockups/ProposalDataSource";

import {
  userDataSource,
  dummyUser,
  dummyUserNotOnProposal,
  dummyUserOfficer
} from "../datasources/mockups/UserDataSource";

const dummyEventBus = new EventBus<ApplicationEvent>();
const userAuthorization = new UserAuthorization(
  new userDataSource(),
  new proposalDataSource(),
  new reviewDataSource()
);
const reviewMutations = new ReviewMutations(
  new reviewDataSource(),
  userAuthorization,
  dummyEventBus
);

//Update

test("A reviewer can submit a review on a proposal he is on", () => {
  return expect(
    reviewMutations.submitReview(dummyUser, 10, "Good proposal", 9)
  ).resolves.toBe(dummyReview);
});

test("A user can't submit a review on a proposal", () => {
  return expect(
    reviewMutations.submitReview(dummyUserNotOnProposal, 1, "Good proposal", 9)
  ).resolves.toHaveProperty("reason", "NOT_REVIEWER_OF_PROPOSAL");
});

test("A userofficer can add a reviewer for a proposal", () => {
  return expect(
    reviewMutations.addUserForReview(dummyUserOfficer, 1, 1)
  ).resolves.toBe(true);
});

test("A user can't add a reviewer for a proposal", () => {
  return expect(
    reviewMutations.addUserForReview(dummyUser, 1, 1)
  ).resolves.toHaveProperty("reason", "NOT_USER_OFFICER");
});

test("A userofficer can remove a reviewer for a proposal", () => {
  return expect(
    reviewMutations.removeUserForReview(dummyUserOfficer, 1)
  ).resolves.toBe(true);
});

test("A user can't remove a reviewer for a proposal", () => {
  return expect(
    reviewMutations.removeUserForReview(dummyUser, 1)
  ).resolves.toHaveProperty("reason", "NOT_USER_OFFICER");
});
