(ns spec-rbac.core-test
  (:require [clojure.test :refer [deftest testing is]]
            [spec-rbac.core :refer [authorized? required granted]]
            [clojure.spec.alpha :as s]))

(s/def ::example-roles-set #{"max" "moritz"})


(deftest authorized?-test

  ;; Roles can be defined as arbitrary spec (predicate function). So implementing a whitelist is trivial via a set.
  (testing "roles set (whitelist)"
    ;; Roles could be inlined
    (is (authorized? [#{"user1" "user2"}] {:roles ["user1"]}))

    ;; But you want define them with `s/def` — Now you can reuse them…
    (is (authorized? [::example-roles-set] {:roles ["max"]}))
    (is (not (authorized? [::example-roles-set] {:roles ["alice"]}))))

  (testing ""
    ;; The first matching pair of required and granted roles is returned. If defined with `s/def`, the required role is returned by name.
    (is (= [::example-roles-set "max"]
           (authorized? [::example-roles-set] {:roles ["max"]})))
    (is (= nil
           (authorized? [::example-roles-set] {:roles ["alice"]})))

    ;; There are helper functions to get the required or granted role
    (is (= ::example-roles-set
           (required (authorized? [::example-roles-set] {:roles ["max"]}))))
    (is (= "max"
           (granted (authorized? [::example-roles-set] {:roles ["max"]}))))
    (is (= nil
           (required (authorized? [::example-roles-set] {:roles ["alice"]}))
           (granted (authorized? [::example-roles-set] {:roles ["alice"]}))))))
