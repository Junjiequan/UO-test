import { Arg, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { ResolverContext } from "../../context";
import { ProposalResponseWrap } from "../types/CommonWrappers";
import { wrapResponse } from "../wrapResponse";

@Resolver()
export class ApproveProposalMutation {
  @Mutation(() => ProposalResponseWrap)
  approveProposal(
    @Arg("id", () => Int) id: number,
    @Ctx() context: ResolverContext
  ) {
    wrapResponse(
      context.mutations.proposal.accept(context.user, id),
      ProposalResponseWrap
    );
  }
}
