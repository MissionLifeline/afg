(ns afg-backend.security.auth.token.core-test
  (:require [clojure.test :refer [use-fixtures deftest testing is]]
            [mount.core :as mount]
            [afg-backend.db.state :refer [db_ctx]]
            [afg-backend.security.auth.token.core :refer [token-valid?]]))

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest introspection
  (testing "not existing token"
    (is (= nil (token-valid? db_ctx "notExistingToken" "1337coffee"))))

  (testing "new token and again with same userId"
    (is (:xtdb.api/tx-id (token-valid? db_ctx "exampleToken" "1337coffee")))
    ((:sync db_ctx))
    (is (= true (token-valid? db_ctx "exampleToken" "1337coffee"))))

  (testing "token + wrong userId"
    (is (= false (token-valid? db_ctx "exampleToken" "0815coffee")))))
