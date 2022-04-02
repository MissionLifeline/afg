(ns spec-rbac.roles.token-test
  (:require [clojure.test :refer [use-fixtures deftest testing is]]
            [mount.core :as mount]
            [afg-backend.db.state :refer [db_ctx]]
            [spec-rbac.core :refer [authorized?]]
            [spec-rbac.roles.token :refer [token+userId]]))

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest token+userId-test
  (let [ctx {:ctx {:db_ctx db_ctx}}]

    (testing "not existing token"
      (is (not (authorized? [token+userId] {:token "notExistingToken" :userId "originalUserId"} ctx))))

    (testing "new token and again with same and other userId"
      (is      (authorized? [token+userId] {:token "exampleToken" :userId "originalUserId"} ctx))
      ((:sync db_ctx))
      (is      (authorized? [token+userId] {:token "exampleToken" :userId "originalUserId"} ctx))
      (is (not (authorized? [token+userId] {:token "exampleToken" :userId "someOtherUserId"} ctx))))

    (testing "the demoToken has the :ignoreUserId attribute"
      (is (authorized? [token+userId] {:token "demoToken" :userId "originalUserId"} ctx))
      ((:sync db_ctx))
      (is (authorized? [token+userId] {:token "demoToken" :userId "someOtherUserId"} ctx)))))
