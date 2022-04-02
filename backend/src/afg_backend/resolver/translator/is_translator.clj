(ns afg-backend.resolver.translator.is-translator
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [spec-rbac.core :refer [authorized?]]
            [afg-backend.resolver.translator.write-translations :refer [translator-token]]
            [spec-rbac.model.roles.auth :as auth]))

(s/fdef is_translator
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret t/boolean)

(defn is_translator
  "This query allows the frontend to show the translation feature only when the user is authorized."
  [_node opt ctx _info]
  (boolean (authorized? [translator-token] (:auth opt) {:ctx ctx})))

(s/def ::is_translator (t/resolver #'is_translator))
