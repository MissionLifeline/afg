(ns afg-backend.security.auth.token.core
  (:require [afg-backend.model.token :as token]))

(defn- ->token [db_ctx token]
  (let [{:keys [q_id_unary]} db_ctx]
       (q_id_unary '{:find [(pull ?e [*])]
                     :in [token]
                     :where [[?e :xt/spec ::token/record]
                             [?e :token token]]}
                   token)))

(defn- token-assoc-userId! [db_ctx tokenData userId]
  (assert (not (:userId tokenData)))
  (let [{:keys [tx]} db_ctx]
       (tx [[:xtdb.api/put (assoc tokenData :userId userId)]])))

(defn token-valid? [db_ctx token userId]
  (let [tokenData (->token db_ctx token)]
       (when tokenData
             (if (:userId tokenData)
                 (or (= userId (:userId tokenData))
                     (:ignoreUserId tokenData))
                 (token-assoc-userId! db_ctx tokenData userId)))))
