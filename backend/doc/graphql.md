# Grahql

## Curl

To test queries from shell, try:

```sh
curl localhost:4000/graphql -H 'content-type: application/json' --data-raw $'{"query":"{get_keys(token: \\"exampleToken\\")}"}'
```

## Graphqli

You many want use the [introspection via graphqli](http://localhost:4000/graphiql/index.html)
