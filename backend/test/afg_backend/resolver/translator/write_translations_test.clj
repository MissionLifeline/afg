(ns afg-backend.resolver.translator.write-translations-test
  (:require [clojure.test :refer [use-fixtures deftest testing is]]
            [mount.core :as mount]
            [afg-backend.db.state :refer [db_ctx]]
            [afg-backend.resolver.core :refer [graphql]]))

(defn write_translations [token]
  (let [result (graphql {:query "mutation WriteTranslations($auth: Auth, $translations: JsonInput) {
                                  write_translations(auth: $auth, translationsInput: $translations) }"
                         :variables {:auth {:token token}
                                     :translations {:hello "hallo" :foo {:bar "blub"}}}})]
       ((:sync db_ctx))
       result))

(defn get_translations []
  (graphql {:query "{get_translations {str json{hello foo{bar}}}}"}))


(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest write_translations-test

  (testing "try to write translations without permissions"

    (is (= {:data {:write_translations false}}
           (write_translations "demoToken")))

    (is (= {:data {:get_translations {:json nil
                                      :str "null"}}}
           (get_translations))))

  (testing "write translations and read them back"

    (is (= {:data {:write_translations true}}
           (write_translations "demoTranslatorToken")))

    (is (= {:data {:get_translations {:json {:hello "hallo" :foo {:bar "blub"}}
                                      :str "{\"hello\":\"hallo\",\"foo\":{\"bar\":\"blub\"}}"}}}
           (get_translations)))))
