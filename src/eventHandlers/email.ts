import { ApplicationEvent } from "../events/applicationEvents";
import { UserDataSource } from "../datasources/UserDataSource";
const SparkPost = require("sparkpost");
const options = {
  endpoint: "https://api.eu.sparkpost.com:443"
};
const client = new SparkPost(process.env.SPARKPOST_TOKEN, options);

export default function createHandler(userDataSource: UserDataSource) {
  // Handler to send email to proposers in accepted proposal

  return async function emailHandler(event: ApplicationEvent) {
    function sendEmail(_address: string, _topic: string, _message: string) {}

    switch (event.type) {
      case "PROPOSAL_ACCEPTED": {
        const proposal = event.proposal;
        const participants = await userDataSource.getProposalUsers(proposal.id);

        for (const { firstname, lastname } of participants) {
          const email = "dummy@dummy.com";
          const topic = "Congrats!";
          const message = `Dear ${firstname} ${lastname}, your proposal has been accepted.`;
          sendEmail(email, topic, message);
        }

        return;
      }

      case "PROPOSAL_REJECTED": {
        const proposal = event.proposal;
        const participants = await userDataSource.getProposalUsers(proposal.id);

        for (const { firstname, lastname } of participants) {
          const email = "dummy@dummy.com";
          const topic = "Tough luck!";
          const message = `Sorry ${firstname} ${lastname}, your proposal was rejected because: ${event.reason}`;
          sendEmail(email, topic, message);
        }

        return;
      }

      case "PASSWORD_RESET_EMAIL": {
        client.transmissions
          .send({
            content: {
              template_id: "user-office-account-reset-password"
            },
            substitution_data: {
              title: "ESS User reset account password",
              buttonText: "Click to reset",
              link: event.link
            },
            recipients: [{ address: event.user.email }]
          })
          .then((res: string) => {
            console.log(res);
          })
          .catch((err: string) => {
            console.log(err);
          });
        return;
      }

      case "ACCOUNT_CREATED": {
        if (process.env.NODE_ENV === "development") {
          await userDataSource.setUserEmailVerified(event.user.id);
          console.log("verify user without email in development");
        } else {
          client.transmissions
            .send({
              content: {
                template_id: "user-office-account-verification"
              },
              substitution_data: {
                title: "ESS User portal verify account",
                buttonText: "Click to verify",
                link: event.link
              },
              recipients: [{ address: "asda" }]
            })
            .then((res: string) => {
              console.log(res);
            })
            .catch((err: string) => {
              console.log(err);
            });
        }
        return;
      }
    }
  };
}
