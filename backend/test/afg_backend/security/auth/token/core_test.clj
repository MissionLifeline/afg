(ns afg-backend.security.auth.token.core-test
  (:require [clojure.test :refer [use-fixtures deftest testing is]]
            [mount.core :as mount]
            [afg-backend.db.state :refer [db_ctx]]
            [afg-backend.security.auth.token.core :refer [token-valid?]]))

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest token-valid?-test

  (testing "not existing token"
    (is (= nil (token-valid? db_ctx "notExistingToken" "originalUserId"))))

  (testing "new token and again with same and other userId"
    (is (:xtdb.api/tx-id (token-valid? db_ctx "exampleToken" "originalUserId")))
    ((:sync db_ctx))
    (is (token-valid? db_ctx "exampleToken" "originalUserId"))
    (is (not (token-valid? db_ctx "exampleToken" "someOtherUserId"))))

  (testing "the demoToken has the :ignoreUserId attribute"
    (is (:xtdb.api/tx-id (token-valid? db_ctx "demoToken" "originalUserId")))
    ((:sync db_ctx))
    (is (token-valid? db_ctx "demoToken" "someOtherUserId"))))
