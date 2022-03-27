(ns afg-backend.model.pubkey
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::pubkey (t/field t/string "armored pgp pubkey"))
