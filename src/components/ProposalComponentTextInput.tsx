import React, { ChangeEvent } from "react";
import { makeStyles } from "@material-ui/core";
import { IBasicComponentProps } from "./IBasicComponentProps";
import { getIn } from "formik";
import TextInputWithCounter from "./TextInputWithCounter";

export function ProposalComponentTextInput(props: IBasicComponentProps) {
  const classes = makeStyles({
    textField: {
      margin: "15px 0 10px 0"
    }
  })();
  let { templateField, onComplete, touched, errors, handleChange } = props;
  let { proposal_question_id, config, question } = templateField;
  const fieldError = getIn(errors, proposal_question_id);
  const isError = getIn(touched, proposal_question_id) && !!fieldError;
  return (
    <div>
      {props.templateField.config.htmlQuestion && (
        <div
          dangerouslySetInnerHTML={{
            __html: props.templateField.config.htmlQuestion!
          }}
        ></div>
      )}
      <TextInputWithCounter
        variant="standard"
        id={proposal_question_id}
        name={proposal_question_id}
        fullWidth
        required={config.required ? true : false}
        label={config.htmlQuestion ? "" : question}
        value={templateField.value}
        onChange={(evt: ChangeEvent<HTMLInputElement>) => {
          templateField.value = evt.target.value;
          handleChange(evt); // letting Formik know that there was a change
        }}
        onBlur={() => onComplete()}
        placeholder={config.placeholder}
        error={isError}
        helperText={isError && errors[proposal_question_id]}
        multiline={config.multiline}
        rows={config.multiline ? 2 : 1}
        rowsMax={config.multiline ? 16 : undefined}
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
      />
    </div>
  );
}
