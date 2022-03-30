(ns afg-backend.model.translations
  (:require [clojure.spec.alpha :as s]
            [afg-backend.model.json :refer [json jsonInput]]))

(s/def ::translations json)
(s/def ::translationsInput jsonInput)

(s/def ::record (s/keys :req-un [::translations]))
