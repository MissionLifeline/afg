(ns afg-backend.resolver.user.get-keys
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [afg-backend.config.state :refer [env]]
            [afg-backend.model.token :as token]
            [afg-backend.model.pubkey :as pubkey]))

(s/fdef get_keys
        :args (s/tuple map? (s/keys :req-un [::token/token]) map? map?)
        :ret (s/* ::pubkey/pubkey))

(defn get_keys
  "PGP public keys of the editors that are allowed to read the data submitted with this token"
  [_node _opt _ctx _info]
  (if (:test-pubkey-file env)
      [(slurp (:test-pubkey-file env))]
      (do (println "ERROR: TEST_PUBKEY_FILE was not defined")  ;; and taking keys from db is not implemented now
          [])))

(s/def ::get_keys (t/resolver #'get_keys))
