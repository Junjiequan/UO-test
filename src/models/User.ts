import "reflect-metadata";
import { rejection } from "../rejection";
import { Field, Int, ObjectType } from "type-graphql";

export class User {
  constructor(
    public id: number,
    public user_title: string | null,
    public firstname: string,
    public middlename: string | null,
    public lastname: string,
    public username: string,
    public preferredname: string | null,
    public orcid: string,
    public refreshToken: string,
    public gender: string,
    public nationality: number,
    public birthdate: string,
    public organisation: number,
    public department: string,
    public position: string,
    public email: string,
    public emailVerified: boolean,
    public telephone: string,
    public telephone_alt: string | null,
    public placeholder: boolean,
    public created: string,
    public updated: string
  ) { }

  roles(args: any, context: any) {
    return context.queries.user.dataSource.getUserRoles(this.id);
  }

  reviews(args: any, context: any) {
    return context.queries.review.dataSource.getUserReviews(this.id);
  }

  proposals(args: any, context: any) {
    return context.queries.proposal.dataSource.getUserProposals(this.id);
  }
}

@ObjectType()
export class BasicUserDetails {
  @Field(type => Int)
  public id: number;
  @Field()
  public firstname: string;
  @Field()
  public lastname: string;
  @Field()
  public organisation: string;
  @Field()
  public position: string;

  constructor(id: number, firstname: string, lastname: string, organisation: string, position: string) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.organisation = organisation;
    this.position = position;
  }
}

export interface UsersArgs {
  first?: number;
  offset?: number;
  filter?: string;
  usersOnly?: boolean;
  subtractUsers?: [number];
}

export interface CreateUserArgs {
  user_title: string;
  firstname: string;
  middlename: string;
  lastname: string;
  username: string;
  password: string;
  preferredname: string;
  orcid: string;
  orcidHash: string;
  refreshToken: string;
  gender: string;
  nationality: number;
  birthdate: string;
  organisation: number;
  department: string;
  position: string;
  email: string;
  telephone: string;
  telephone_alt: string;
  otherOrganisation?: string;
}

export interface UpdateUserArgs {
  id: number;
  user_title?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  username?: string;
  preferredname?: string;
  gender?: string;
  nationality?: number;
  birthdate?: string;
  organisation?: number;
  department?: string;
  position?: string;
  email?: string;
  telephone?: string;
  telephone_alt?: string;
  placeholder?: boolean;
  roles?: number[];
  orcid?: string;
  refreshToken?: string;
}

export function checkUserArgs(args: UpdateUserArgs) {
  const { firstname, lastname } = args;
  if (firstname && firstname.length < 2) {
    return rejection("TOO_SHORT_NAME");
  }

  if (lastname && lastname.length < 2) {
    return rejection("TOO_SHORT_NAME");
  }

  return true;
}
