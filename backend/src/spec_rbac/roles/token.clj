(ns spec-rbac.roles.token
  "TODO: in future this should support other backends than xtdb"
  (:require [spec-rbac.model.roles.token :as token]))

(defn- ->token [db_ctx token]
  (let [{:keys [q_id_unary]} db_ctx]
       (q_id_unary '{:find [(pull ?e [*])]
                     :in [token]
                     :where [[?e :xt/spec ::token/record]
                             [?e :token token]]}
                   token)))

(defn- token-assoc-userId! [db_ctx tokenData userId]
  (when (and userId (not (:userId tokenData)))
        (let [{:keys [tx]} db_ctx]
             (tx [[:xtdb.api/put (assoc tokenData :userId userId)]]))))

(defn ctx+auth->roles [ctx]
  (fn [auth]
      (let [token (->token (:db_ctx ctx) (:token auth))
            valid token]  ;; TODO token invalidation
           {:roles (when valid
                     (concat
                       (:spec-rbac.model.roles.token/roles token)
                       [::token-valid
                        (when (::token/public token)
                              ::token-public)
                        (when (or (= (:userId auth) (:userId token))
                                  (:ignoreUserId token)
                                  (token-assoc-userId! (:db_ctx ctx) token (:userId auth)))
                              ::token+userId)]))})))

(def token-valid ^{:ctx->wrap-identity ctx+auth->roles} #{::token-valid})
(def token-public ^{:ctx->wrap-identity ctx+auth->roles} #{::token-public})
(def token+userId ^{:ctx->wrap-identity ctx+auth->roles} #{::token+userId})
