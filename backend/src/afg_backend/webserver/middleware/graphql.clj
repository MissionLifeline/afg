(ns afg-backend.webserver.middleware.graphql
  (:require [lib.graphql.middleware :refer [wrap-graphql-error]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.json :refer [wrap-json-response wrap-json-body]]))

(defn wrap-graphiql
  "Add graphqli using org.webjars/graphiql and resources/public/graphiql/index.html"
  [handler]
  (-> handler
      (wrap-resource "public")))

(defn wrap-graphql
  "Handle Content-Type and Errors of graphql-endpoint"
  [handler]
  (-> handler
      (wrap-graphql-error)
      (wrap-json-body {:keywords? true :bigdecimals? false})  ;; java.math.BigDecimal doesn't conform to t/float or float?
      (wrap-json-response)))

(defn wrap-rest
  "Use the same error handling as for graphql"
  [handler]
  (-> handler
      (wrap-graphql-error)))
