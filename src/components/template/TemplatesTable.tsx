import { Edit, FileCopy, Archive, Delete } from '@material-ui/icons';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import MaterialTable, { Column } from 'material-table';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import React from 'react';
import { useHistory } from 'react-router';

import {
  Template,
  GetTemplatesQuery,
  TemplateCategoryId,
} from '../../generated/sdk';
import { useDataApi } from '../../hooks/useDataApi';
import { tableIcons } from '../../utils/materialIcons';
import { WithConfirmType } from '../../utils/withConfirm';

export type TemplateRowDataType = Pick<
  Template,
  'templateId' | 'name' | 'description' | 'isArchived'
>;

interface TemplatesTableProps {
  columns: Column<any>[];
  templateCategory: TemplateCategoryId;
  dataProvider: () => Promise<Exclude<GetTemplatesQuery['templates'], null>>;
  isRowDeleteable: (row: TemplateRowDataType) => boolean;
  confirm: WithConfirmType;
}
export function TemplatesTable(props: TemplatesTableProps) {
  const [templates, setTemplates] = useState<TemplateRowDataType[]>([]);
  const api = useDataApi();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    props.dataProvider().then(data => {
      setTemplates(data);
    });
  }, [props]);

  const getUnarchiveButton = () => {
    return {
      icon: () => <UnarchiveIcon />,
      tooltip: 'Unarchive',
      onClick: (
        event: any,
        data: TemplateRowDataType | TemplateRowDataType[]
      ) => {
        props.confirm(
          () => {
            api()
              .updateTemplate({
                templateId: (data as TemplateRowDataType).templateId,
                isArchived: false,
              })
              .then(response => {
                const data = [...templates];
                data.splice(
                  templates.findIndex(
                    elem =>
                      elem.templateId ===
                      response.updateTemplate.template?.templateId
                  ),
                  1,
                  response.updateTemplate.template!
                );
                setTemplates(data);
              });
          },
          {
            title: 'Are you sure?',
            description: `Are you sure you want to unarchive ${
              (data as TemplateRowDataType).name
            }`,
            confirmationText: 'Yes',
            cancellationText: 'Cancel',
          }
        )();
      },
    };
  };

  const getArchiveButton = () => {
    return {
      icon: () => <Archive />,
      tooltip: 'Archive',
      onClick: (
        event: any,
        data: TemplateRowDataType | TemplateRowDataType[]
      ) => {
        props.confirm(
          () => {
            api()
              .updateTemplate({
                templateId: (data as TemplateRowDataType).templateId,
                isArchived: true,
              })
              .then(response => {
                const data = [...templates];
                data.splice(
                  templates.findIndex(
                    elem =>
                      elem.templateId ===
                      response.updateTemplate.template?.templateId
                  ),
                  1,
                  response.updateTemplate.template!
                );
                setTemplates(data);
              });
          },
          {
            title: 'Are you sure?',
            description: `Are you sure you want to archive ${
              (data as TemplateRowDataType).name
            }`,
            confirmationText: 'Yes',
            cancellationText: 'Cancel',
          }
        )();
      },
    };
  };

  const getDeleteButton = () => {
    return {
      icon: () => <Delete />,
      tooltip: 'Delete',
      onClick: (
        event: any,
        data: TemplateRowDataType | TemplateRowDataType[]
      ) => {
        props.confirm(
          () => {
            api()
              .deleteTemplate({
                id: (data as TemplateRowDataType).templateId,
              })
              .then(response => {
                const data = [...templates];
                data.splice(
                  templates.findIndex(
                    elem =>
                      elem.templateId ===
                      response.deleteTemplate.template?.templateId
                  ),
                  1
                );
                setTemplates(data);
              });
          },
          {
            title: 'Are you sure?',
            description: `Are you sure you want to delete ${
              (data as TemplateRowDataType).name
            }`,
            confirmationText: 'Yes',
            cancellationText: 'Cancel',
          }
        )();
      },
    };
  };

  const getMaintenanceButton = (rowData: TemplateRowDataType) => {
    if (rowData.isArchived) {
      return getUnarchiveButton();
    } else {
      const isDeleteable = props.isRowDeleteable(rowData);
      if (isDeleteable) {
        return getDeleteButton();
      } else {
        return getArchiveButton();
      }
    }
  };

  return (
    <MaterialTable
      icons={tableIcons}
      title="Proposal templates"
      columns={props.columns}
      data={templates}
      editable={{
        onRowAdd: data =>
          new Promise(resolve => {
            api()
              .createTemplate({
                categoryId: props.templateCategory,
                name: data.name,
                description: data.description,
              })
              .then(result => {
                const { template, error } = result.createTemplate;

                if (!template) {
                  enqueueSnackbar(error || 'Error ocurred', {
                    variant: 'error',
                  });
                } else {
                  const newTemplates = [...templates];
                  newTemplates.push(template!);
                  setTemplates(newTemplates);
                }
                resolve();
              });
          }),
      }}
      actions={[
        {
          icon: () => <Edit />,
          tooltip: 'Edit',
          onClick: (
            event: any,
            data: TemplateRowDataType | TemplateRowDataType[]
          ) => {
            history.push(
              `/QuestionaryEditor/${(data as TemplateRowDataType).templateId}`
            );
          },
        },
        {
          icon: () => <FileCopy />,
          hidden: false,
          tooltip: 'Clone',
          onClick: (
            event: any,
            data: TemplateRowDataType | TemplateRowDataType[]
          ) => {
            props.confirm(
              () => {
                api()
                  .cloneTemplate({
                    templateId: (data as TemplateRowDataType).templateId,
                  })
                  .then(result => {
                    const clonedTemplate = result.cloneTemplate.template;
                    if (clonedTemplate) {
                      const newTemplates = [...templates];
                      newTemplates.push(clonedTemplate);
                      setTemplates(newTemplates);
                    }
                  });
              },
              {
                title: 'Are you sure?',
                description: `Are you sure you want to clone ${
                  (data as TemplateRowDataType).name
                }`,
                confirmationText: 'Yes',
                cancellationText: 'Cancel',
              }
            )();
          },
        },
        rowData => getMaintenanceButton(rowData),
      ]}
    />
  );
}
