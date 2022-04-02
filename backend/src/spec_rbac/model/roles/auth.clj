(ns spec-rbac.model.roles.auth
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

;; TODO
(t/defscalar
  authInput
  {:kind t/input-object-kind :name "Auth" :description "Any supported kind of authorization"}
  identity)

(s/def ::auth authInput)
