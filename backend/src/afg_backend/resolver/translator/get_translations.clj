(ns afg-backend.resolver.translator.get-translations
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            ;[afg-backend.config.state :refer [env]]
            [afg-backend.model.translations :as translations]
            [cheshire.core :refer [generate-string]]))

(defn ->translations [db_ctx]
  (let [{:keys [q_id_unary]} db_ctx]
       (q_id_unary '{:find [(pull ?e [*])]
                     :where [[?e :xt/spec :afg-backend.model.translations/record]]})))

(s/fdef get_translations
        :args (s/tuple map? map? map? map?)
        :ret ::translations/translations)

(defn get_translations
  [_node _opt ctx _info]
  (let [{:keys [db_ctx]} ctx
        {:keys [translations]} (->translations db_ctx)]
       {:json translations
        :str (generate-string translations)}))

(s/def ::get_translations (t/resolver #'get_translations))
