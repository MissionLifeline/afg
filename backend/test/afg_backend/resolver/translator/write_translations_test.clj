(ns afg-backend.resolver.translator.write-translations-test
  (:require [clojure.test :refer [use-fixtures deftest testing is]]
            [mount.core :as mount]
            [afg-backend.db.state :refer [db_ctx]]
            [afg-backend.resolver.core :refer [graphql]]))

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest write_translations
  (testing "write translations and read them back"

    (is (= {:data {:write_translations true}}
           (graphql {:query "mutation WriteTranslations($auth: Auth, $translations: JsonInput) {
                               write_translations(auth: $auth, translationsInput: $translations) }"
                     :variables {:auth {:token "demoToken"}
                                 :translations {:hello "hallo" :foo {:bar "blub"}}}})))
    ((:sync db_ctx))

    (is (= {:data {:get_translations {:json {:hello "hallo" :foo {:bar "blub"}}
                                      :str "{\"hello\":\"hallo\",\"foo\":{\"bar\":\"blub\"}}"}}}
           (graphql {:query "{get_translations {str json{hello foo{bar}}}}"})))))
