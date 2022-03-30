(ns afg-backend.model.json
  (:require [specialist-server.type :as t]))

(t/defscalar
  json
  {:name "Json" :description "Anything not yet specified"}
  identity)

(t/defscalar
  jsonInput
  {:kind t/input-object-kind :name "JsonInput" :description "Anything not yet specified"}
  identity)
