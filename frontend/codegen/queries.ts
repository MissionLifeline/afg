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
