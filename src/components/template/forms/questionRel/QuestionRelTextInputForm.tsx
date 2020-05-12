import { Collapse } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { Field } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

import { QuestionRel, TextInputConfig } from '../../../../generated/sdk';
import FormikUICustomCheckbox from '../../../common/FormikUICustomCheckbox';
import FormikUICustomDependencySelector from '../../../common/FormikUICustomDependencySelector';
import FormikUICustomEditor from '../../../common/FormikUICustomEditor';
import TitledContainer from '../../../common/TitledContainer';
import { TFormSignature } from '../TFormSignature';
import { QuestionRelFormShell } from './QuestionRelFormShell';
import { QuestionExcerpt } from './QuestionExcerpt';

export const QuestionRelTextInputForm: TFormSignature<QuestionRel> = props => {
  const [isRichQuestion, setIsRichQuestion] = useState<boolean>(
    (props.field.question.config as TextInputConfig).isHtmlQuestion
  );

  return (
    <QuestionRelFormShell
      closeMe={props.closeMe}
      dispatch={props.dispatch}
      questionRel={props.field}
      label="Text input"
      template={props.template}
      validationSchema={Yup.object().shape({
        question: Yup.object({
          config: Yup.object({
            min: Yup.number().nullable(),
            max: Yup.number().nullable(),
            required: Yup.boolean(),
            placeholder: Yup.string(),
            multiline: Yup.boolean(),
            isHtmlQuestion: Yup.boolean(),
          }),
        }),
      })}
    >
      {formikProps => (
        <>
          <QuestionExcerpt question={props.field.question} />

          <TitledContainer label="Constraints">
            <Field
              name="question.config.required"
              checked={formikProps.values.question.config.required}
              component={FormikUICustomCheckbox}
              label="Is required"
              margin="normal"
              fullWidth
              data-cy="required"
            />

            <Field
              name="question.config.min"
              label="Min"
              type="text"
              component={TextField}
              margin="normal"
              fullWidth
              data-cy="min"
            />

            <Field
              name="question.config.max"
              label="Max"
              type="text"
              component={TextField}
              margin="normal"
              fullWidth
              data-cy="max"
            />
          </TitledContainer>
          <TitledContainer label="Options">
            <Field
              label="Enable rich text question"
              name="question.config.isHtmlQuestion"
              component={FormikUICustomCheckbox}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setIsRichQuestion(event.target.checked);
              }}
              checked={isRichQuestion}
            />
            <Collapse in={isRichQuestion}>
              <Field
                visible={isRichQuestion}
                name="question.config.htmlQuestion"
                type="text"
                component={FormikUICustomEditor}
                margin="normal"
                fullWidth
                init={{
                  skin: false,
                  content_css: false,
                  plugins: ['link', 'preview', 'image', 'code'],
                  toolbar: 'bold italic',
                  branding: false,
                }}
                data-cy="htmlQuestion"
              />
            </Collapse>
            <Field
              name="question.config.placeholder"
              label="Placeholder text"
              type="text"
              component={TextField}
              margin="normal"
              fullWidth
              data-cy="placeholder"
            />

            <Field
              name="question.config.multiline"
              checked={
                (formikProps.values.question.config as TextInputConfig)
                  .multiline
              }
              component={FormikUICustomCheckbox}
              label="Multiple lines"
              margin="normal"
              fullWidth
              data-cy="multiline"
            />
          </TitledContainer>

          <TitledContainer label="Dependencies">
            <Field
              name="dependency"
              component={FormikUICustomDependencySelector}
              templateField={props.field}
              template={props.template}
              margin="normal"
              fullWidth
              data-cy="dependencies"
            />
          </TitledContainer>
        </>
      )}
    </QuestionRelFormShell>
  );
};
