import { useMutation, UseMutationOptions,useQuery, UseQueryOptions } from 'react-query'

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
  /** Any supported kind of authorization */
  Auth: any;
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
  auth: Scalars['Auth'];
  translationsInput: Scalars['JsonInput'];
};

/** The type that query operations will be rooted at. */
export type QueryType = {
  __typename?: 'QueryType';
  /** PGP public keys of the editors that are allowed to read the data submitted with this token */
  get_keys: Get_Keys;
  get_translations: Scalars['Json'];
  /** This query allows the frontend to show the translation feature only when the user is authorized. */
  is_translator: Scalars['Boolean'];
};


/** The type that query operations will be rooted at. */
export type QueryTypeGet_KeysArgs = {
  token: Scalars['String'];
  userId?: InputMaybe<Scalars['String']>;
};


/** The type that query operations will be rooted at. */
export type QueryTypeIs_TranslatorArgs = {
  auth: Scalars['Auth'];
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

export type Is_TranslatorQueryVariables = Exact<{
  auth: Scalars['Auth'];
}>;


export type Is_TranslatorQuery = { __typename?: 'QueryType', is_translator: boolean };

export type Write_TranslationMutationVariables = Exact<{
  auth: Scalars['Auth'];
  translationInput: Scalars['JsonInput'];
}>;


export type Write_TranslationMutation = { __typename?: 'MutationType', write_translations: boolean };

export type Get_TranslationQueryVariables = Exact<{ [key: string]: never; }>;


export type Get_TranslationQuery = { __typename?: 'QueryType', get_translations: any };


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
export const Is_TranslatorDocument = `
    query is_translator($auth: Auth!) {
  is_translator(auth: $auth)
}
    `
export const useIs_TranslatorQuery = <
      TData = Is_TranslatorQuery,
      TError = unknown
    >(
      variables: Is_TranslatorQueryVariables,
      options?: UseQueryOptions<Is_TranslatorQuery, TError, TData>
    ) =>
    useQuery<Is_TranslatorQuery, TError, TData>(
      ['is_translator', variables],
      fetcher<Is_TranslatorQuery, Is_TranslatorQueryVariables>(Is_TranslatorDocument, variables),
      options
    )
export const Write_TranslationDocument = `
    mutation write_translation($auth: Auth!, $translationInput: JsonInput!) {
  write_translations(auth: $auth, translationsInput: $translationInput)
}
    `
export const useWrite_TranslationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Write_TranslationMutation, TError, Write_TranslationMutationVariables, TContext>) =>
    useMutation<Write_TranslationMutation, TError, Write_TranslationMutationVariables, TContext>(
      ['write_translation'],
      (variables?: Write_TranslationMutationVariables) => fetcher<Write_TranslationMutation, Write_TranslationMutationVariables>(Write_TranslationDocument, variables)(),
      options
    )
export const Get_TranslationDocument = `
    query get_translation {
  get_translations
}
    `
export const useGet_TranslationQuery = <
      TData = Get_TranslationQuery,
      TError = unknown
    >(
      variables?: Get_TranslationQueryVariables,
      options?: UseQueryOptions<Get_TranslationQuery, TError, TData>
    ) =>
    useQuery<Get_TranslationQuery, TError, TData>(
      variables === undefined ? ['get_translation'] : ['get_translation', variables],
      fetcher<Get_TranslationQuery, Get_TranslationQueryVariables>(Get_TranslationDocument, variables),
      options
    )