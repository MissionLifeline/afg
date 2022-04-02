import {gql} from "graphql-request";

export const get_keys = gql`
  query get_keys($token: String!, $userId: String) {
    get_keys(token: $token, userId: $userId) {
      errors
      tokenValid
      pubKeys
    }
  }
`

export const write_translation = gql`
  mutation write_translation($translationInput: JsonInput!) {
      write_translations(translationsInput: $translationInput)
  }
`
