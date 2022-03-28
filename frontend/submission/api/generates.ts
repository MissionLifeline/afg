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
  /** The 'Long' scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^64) and 2^64 - 1. */
  Long: any;
};

/** The type that query operations will be rooted at. */
export type QueryType = {
  __typename?: 'QueryType';
  /** PGP public keys of the editors that are allowed to read the data submitted with this token */
  get_keys: Array<Scalars['String']>;
};


/** The type that query operations will be rooted at. */
export type QueryTypeGet_KeysArgs = {
  token: Scalars['String'];
};

export type Get_KeysQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type Get_KeysQuery = { __typename?: 'QueryType', get_keys: Array<string> };


export const Get_KeysDocument = `
    query get_keys($token: String!) {
  get_keys(token: $token)
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