(ns afg-backend.resolver.admin.add-token
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [spec-rbac.core :refer [authorized?]]
            [spec-rbac.roles.token :refer [ctx+auth->roles]]
            [spec-rbac.model.roles.auth :as auth]
            [spec-rbac.model.roles.token :as token]
            [afg-backend.security.uuid.core :refer [uuid]]
            [afg-backend.security.token.generate :refer [generate-token]]))

(def admin-token ^{:ctx->wrap-identity ctx+auth->roles} #{:spec-rbac.model.roles.token/admin})

(s/fdef add_token
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/nilable ::token/token))

(defn add_token
  [_node opt ctx _info]
  (when (authorized? [admin-token] (:auth opt) {:ctx ctx})
    (let [{:keys [db_ctx]} ctx
          {:keys [tx]} db_ctx
          token (generate-token)
          editor :exampleEditor  ;; TODO editor who created this token
          record {:xt/id (uuid)
                  :xt/spec :spec-rbac.model.roles.token/record
                  :token token
                  :assignedEditor editor}]
         (tx [[:xtdb.api/put record]])
         token)))

(s/def ::add_token (t/resolver #'add_token))
