(ns afg-backend.resolver.translator.write-translations
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [spec-rbac.core :refer [authorized?]]
            [spec-rbac.roles.public :refer [public]]
            [spec-rbac.roles.token :refer [token+userId]]
            [spec-rbac.model.roles.auth :as auth]
            [afg-backend.model.translations :as translations]))

(s/fdef write_translations
        :args (s/tuple map? (s/keys :req-un [::translations/translationsInput] :opt-un [::auth/auth]) map? map?)
        :ret t/boolean)

(defn write_translations
  [_node opt ctx _info]
  (boolean
    (when (authorized? [token+userId public] (:auth opt) {:ctx ctx})  ;; till the frontend sends the auth, anyone is allowed to translate
      (let [{:keys [db_ctx]} ctx
            {:keys [tx]} db_ctx
            {:keys [translationsInput]} opt
            record {:xt/id :latestTranslation  ;; assuming it's a singleton
                    :xt/spec ::translations/record
                    :translations translationsInput}]
           (tx [[:xtdb.api/put record]])))))

(s/def ::write_translations (t/resolver #'write_translations))
