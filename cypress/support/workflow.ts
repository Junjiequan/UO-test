import {
  AddProposalWorkflowStatusMutation,
  AddProposalWorkflowStatusMutationVariables,
  AddStatusChangingEventsToConnectionMutation,
  AddStatusChangingEventsToConnectionMutationVariables,
  CreateProposalStatusMutation,
  CreateProposalStatusMutationVariables,
  CreateProposalWorkflowMutation,
  CreateProposalWorkflowMutationVariables,
} from '../../src/generated/sdk';
import { getE2EApi } from './utils';

const createProposalWorkflow = (
  createProposalWorkflowInput: CreateProposalWorkflowMutationVariables
): Cypress.Chainable<CreateProposalWorkflowMutation> => {
  const api = getE2EApi();
  const request = api.createProposalWorkflow(createProposalWorkflowInput);

  return cy.wrap(request, { timeout: 1500000 });
};

const createProposalStatus = (
  createProposalStatusInput: CreateProposalStatusMutationVariables
): Cypress.Chainable<CreateProposalStatusMutation> => {
  const api = getE2EApi();
  const request = api.createProposalStatus(createProposalStatusInput);

  return cy.wrap(request);
};

const addProposalWorkflowStatus = (
  addProposalWorkflowStatusInput: AddProposalWorkflowStatusMutationVariables
): Cypress.Chainable<AddProposalWorkflowStatusMutation> => {
  const api = getE2EApi();
  const request = api.addProposalWorkflowStatus(addProposalWorkflowStatusInput);

  return cy.wrap(request);
};

const addStatusChangingEventsToConnection = (
  addStatusChangingEventsToConnectionInput: AddStatusChangingEventsToConnectionMutationVariables
): Cypress.Chainable<AddStatusChangingEventsToConnectionMutation> => {
  const api = getE2EApi();
  const request = api.addStatusChangingEventsToConnection(
    addStatusChangingEventsToConnectionInput
  );

  return cy.wrap(request);
};

Cypress.Commands.add('createProposalWorkflow', createProposalWorkflow);
Cypress.Commands.add('createProposalStatus', createProposalStatus);
Cypress.Commands.add('addProposalWorkflowStatus', addProposalWorkflowStatus);
Cypress.Commands.add(
  'addStatusChangingEventsToConnection',
  addStatusChangingEventsToConnection
);
