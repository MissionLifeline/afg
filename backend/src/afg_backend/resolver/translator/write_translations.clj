(ns afg-backend.resolver.translator.write-translations
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            ;[afg-backend.config.state :refer [env]]
            [afg-backend.model.translations :as translations]))

(s/fdef write_translations
        :args (s/tuple map? (s/keys :req-un [::translations/translationsInput]) map? map?)
        :ret t/boolean)

;; TODO auth
(defn write_translations
  [_node opt ctx _info]
  (let [{:keys [db_ctx]} ctx
        {:keys [tx]} db_ctx
        {:keys [translationsInput]} opt
        record {:xt/id :latestTranslation  ;; assuming it's a singleton
                :xt/spec ::translations/record
                :translations translationsInput}
        tx-result (tx [[:xtdb.api/put record]])]
       (boolean tx-result)))

(s/def ::write_translations (t/resolver #'write_translations))
