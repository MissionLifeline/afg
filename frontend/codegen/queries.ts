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

export const is_translator = gql`
  query is_translator($auth: Auth!) {
    is_translator(auth: $auth)
  }
`

export const write_translation = gql`
  mutation write_translation($auth: Auth!, $translationInput: JsonInput!) {
    write_translations(auth: $auth, translationsInput: $translationInput)
  }
`

export const get_translation = gql`
query get_translation {
    get_translations
}
`