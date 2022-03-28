import {gql} from "graphql-request";

export const get_keys = gql`
  query get_keys($token: String!) {
      get_keys(token: $token)
  }
`
