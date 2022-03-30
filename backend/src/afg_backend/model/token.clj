(ns afg-backend.model.token
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::token (t/field t/string "An access token, to be used by a single applicant."))
(s/def ::assignedEditor (s/or :string string? :keyword keyword?))

(s/def ::record (s/keys :req-un [::token ::assignedEditor]))
