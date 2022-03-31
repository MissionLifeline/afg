(ns afg-backend.resolver.user.get-keys
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [afg-backend.config.state :refer [env]]
            [afg-backend.security.auth.token.core :refer [token-valid?]]
            [afg-backend.model.token :as token]
            [afg-backend.model.pubkey :as pubkey]))

(s/def ::errors (s/nilable t/string))
(s/def ::tokenValid t/boolean)
(s/def ::pubKeys (s/coll-of ::pubkey/pubkey))

(s/fdef get_keys
        :args (s/tuple map? (s/keys :req-un [::token/token ::token/userId]) map? map?)
        :ret (s/keys :req-un [::errors ::tokenValid ::pubKeys]))

(defn get_keys
  "PGP public keys of the editors that are allowed to read the data submitted with this token"
  [_node opt ctx _info]
  (let [{:keys [db_ctx]} ctx
        {:keys [token userId]} opt]
       (cond (not (token-valid? db_ctx token userId))
               {:errors "token or userId not valid"
                :tokenValid false
                :pubKeys []}
             (not (:test-pubkey-file env))
               {:errors "TEST_PUBKEY_FILE was not defined"
                :tokenValid true
                :pubKeys []}
             :else
               {:errors nil
                :tokenValid true
                :pubKeys [(slurp (:test-pubkey-file env))]})))

(s/def ::get_keys (t/resolver #'get_keys))
