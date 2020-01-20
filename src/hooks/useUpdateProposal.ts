import { useCallback, useState } from "react";
import { getDataTypeSpec } from "../models/ProposalModelFunctions";
import { useDataApi2 } from "./useDataApi2";
import { ProposalAnswer } from "../models/ProposalModel";
import { ProposalStatus } from "../generated/sdk";

export function useUpdateProposal() {
  const sendRequest = useDataApi2();
  const [loading, setLoading] = useState(false);

  const updateProposal = useCallback(
    async (parameters: {
      id: number;
      title?: string;
      abstract?: string;
      answers?: ProposalAnswer[];
      topicsCompleted?: number[];
      status?: ProposalStatus;
      users?: number[];
      proposerId?: number;
      partialSave?: boolean;
    }) => {
      setLoading(true);
      parameters.answers = prepareAnswers(parameters.answers);
      const result = await sendRequest().updateProposal(parameters);
      setLoading(false);
      return result;
    },
    [sendRequest]
  );

  return { loading, updateProposal };
}

const prepareAnswers = (answers?: ProposalAnswer[]): ProposalAnswer[] => {
  if (answers) {
    answers = answers.filter(
      answer => getDataTypeSpec(answer.data_type).readonly === false // filter out read only fields
    );
    answers = answers.map(answer => {
      return { ...answer, value: JSON.stringify({ value: answer.value }) }; // store value in JSON to preserve datatype e.g. { "value":74 } or { "value":"yes" } . Because of GraphQL limitations
    });
    return answers;
  } else {
    return [];
  }
};
