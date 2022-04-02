(ns spec-rbac.model.roles.token
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::token t/string)
(s/def ::userId (s/nilable t/string))
(s/def ::ignoreUserId (s/nilable t/boolean))

(s/def ::record (s/keys :req-un [::token]
                        :opt-un [::userId ::ignoreUserId]))
