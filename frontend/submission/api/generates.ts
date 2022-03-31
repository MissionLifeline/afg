import { useQuery, UseQueryOptions } from 'react-query'

import { fetcher } from './fetcher'

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Anything not yet specified */
  Json: any;
  /** Anything not yet specified */
  JsonInput: any;
  /** The 'Long' scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^64) and 2^64 - 1. */
  Long: any;
};

/** If this server supports mutation, the type that mutation operations will be rooted at. */
export type MutationType = {
  __typename?: 'MutationType';
  write_translations: Scalars['Boolean'];
};


/** If this server supports mutation, the type that mutation operations will be rooted at. */
export type MutationTypeWrite_TranslationsArgs = {
  translationsInput: Scalars['JsonInput'];
};

/** The type that query operations will be rooted at. */
export type QueryType = {
  __typename?: 'QueryType';
  /** PGP public keys of the editors that are allowed to read the data submitted with this token */
  get_keys: Get_Keys;
  get_translations: Scalars['Json'];
};


/** The type that query operations will be rooted at. */
export type QueryTypeGet_KeysArgs = {
  token: Scalars['String'];
  userId?: InputMaybe<Scalars['String']>;
};

/** PGP public keys of the editors that are allowed to read the data submitted with this token */
export type Get_Keys = {
  __typename?: 'get_keys';
  errors?: Maybe<Scalars['String']>;
  pubKeys: Array<Scalars['String']>;
  /** Self descriptive. */
  tokenValid: Scalars['Boolean'];
};

export type Get_KeysQueryVariables = Exact<{
  token: Scalars['String'];
  userId?: InputMaybe<Scalars['String']>;
}>;


export type Get_KeysQuery = { __typename?: 'QueryType', get_keys: { __typename?: 'get_keys', errors?: string | null, tokenValid: boolean, pubKeys: Array<string> } };


export const Get_KeysDocument = `
    query get_keys($token: String!, $userId: String) {
  get_keys(token: $token, userId: $userId) {
    errors
    tokenValid
    pubKeys
  }
}
    `
export const useGet_KeysQuery = <
      TData = Get_KeysQuery,
      TError = unknown
    >(
      variables: Get_KeysQueryVariables,
      options?: UseQueryOptions<Get_KeysQuery, TError, TData>
    ) =>
    useQuery<Get_KeysQuery, TError, TData>(
      ['get_keys', variables],
      fetcher<Get_KeysQuery, Get_KeysQueryVariables>(Get_KeysDocument, variables),
      options
    )