export class Proposal {
  constructor(
    public id: number,
    public title: string,
    public abstract: string,
    public proposer: number,
    public status: number,
    public created: string,
    public updated: string
  ) {}
}

export class ProposalTemplate {
  constructor(
    public topics: Topic[]
    ) {}
  }

export class Topic {
  constructor(
    public topic_id:number,
    public topic_title: string,
    public fields:ProposalTemplateField[] | null
   ) {}
}
  
export class ProposalTemplateField {
  constructor(
    public proposal_question_id:string,
    public data_type:DataType,
    public question:string,
    public topic: number | null,
    public config: object | null,
    public dependencies: FieldDependency[] | null
  ) {}
}
  
export class FieldDependency {
  
  constructor(
    public proposal_question_id:string,
    public proposal_question_dependency:string,
    public conditions:string,
  ) {}
}

export interface ProposalAnswer {
  proposal_question_id: string;
  answer: string;
}

export enum DataType {
  SMALL_TEXT,
  LARGE_TEXT,
  SELECTION_FROM_OPTIONS,
  BOOLEAN,
  DATE,
  FILE_UPLOAD,
  EMBELLISHMENT
}