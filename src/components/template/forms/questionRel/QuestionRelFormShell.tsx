import { Button, makeStyles, Typography } from '@material-ui/core';
import { Form, Formik, FormikProps } from 'formik';
import React from 'react';
import { ProposalTemplate, QuestionRel } from '../../../../generated/sdk';
import { Event, EventType } from '../../../../models/QuestionaryEditorModel';
import getTemplateFieldIcon from '../../getTemplateFieldIcon';

export const QuestionRelFormShell = (props: {
  validationSchema: any;
  field: QuestionRel;
  dispatch: React.Dispatch<Event>;
  closeMe: Function;
  label: string;
  template: ProposalTemplate;
  children: (formikProps: FormikProps<QuestionRel>) => React.ReactNode;
}) => {
  const classes = makeStyles(theme => ({
    container: {
      width: '100%',
    },
    heading: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey[600],
      '& SVG': {
        marginRight: theme.spacing(1),
      },
    },
    actions: {
      marginTop: theme.spacing(4),
      display: 'flex',
      justifyContent: 'space-between',
    },
  }))();

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.heading}>
        {getTemplateFieldIcon(props.field.question.dataType)}
        {props.label}
      </Typography>
      <Formik
        initialValues={props.field}
        onSubmit={async vals => {
          props.dispatch({
            type: EventType.UPDATE_QUESTION_REL_REQUESTED,
            payload: {
              field: { ...props.field, ...vals },
            },
          });
          props.closeMe();
        }}
        validationSchema={props.validationSchema}
      >
        {formikProps => (
          <Form style={{ flexGrow: 1 }}>{props.children(formikProps)}</Form>
        )}
      </Formik>
      <div className={classes.actions}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          data-cy="delete"
          onClick={() => {
            props.dispatch({
              type: EventType.DELETE_QUESTION_REL_REQUESTED,
              payload: {
                fieldId: props.field.question.proposalQuestionId,
                templateId: props.template.templateId,
              },
            });
            props.closeMe();
          }}
        >
          Delete
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          data-cy="submit"
        >
          Save
        </Button>
      </div>
    </div>
  );
};
