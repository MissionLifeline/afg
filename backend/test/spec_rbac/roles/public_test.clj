(ns spec-rbac.roles.public-test
  (:require [clojure.test :refer [deftest testing is]]
            [spec-rbac.core :refer [authorized?]]
            [spec-rbac.roles.public :refer [public]]))

(deftest public-test
  (testing "A role that always grants access"
    (is (authorized? [public] "alice"))))
