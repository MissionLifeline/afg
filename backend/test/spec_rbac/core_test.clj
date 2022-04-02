(ns spec-rbac.core-test
  (:require [clojure.test :refer [deftest testing is]]
            [spec-rbac.core :refer [authorized? required granted]]
            [clojure.spec.alpha :as s]))

(s/def ::allowed-users #{"max" "moritz"})

(deftest authorized?-simple

  ;; Roles can be defined as arbitrary spec (predicate function). So implementing a whitelist is trivial via a set.
  (testing "roles set (whitelist)"
    ;; Roles could be inlined
    (is (authorized? [#{"user1" "user2"}] {:roles ["user1"]}))

    ;; But you want define them with `s/def` — Now you can reuse them…
    (is      (authorized? [::allowed-users] {:roles ["max"]}))
    (is (not (authorized? [::allowed-users] {:roles ["alice"]}))))

  (testing "return values"
    ;; The first matching pair of required and granted roles is returned. If defined with `s/def`, the required role is returned by name.
    (is (= [::allowed-users "max"]
           (authorized? [::allowed-users] {:roles ["max"]})))
    (is (= nil
           (authorized? [::allowed-users] {:roles ["alice"]})))

    ;; There are helper functions to get the required or granted role
    (is (= ::allowed-users
           (required (authorized? [::allowed-users] {:roles ["max"]}))))
    (is (= "max"
           (granted  (authorized? [::allowed-users] {:roles ["max"]}))))
    (is (= nil
           (required (authorized? [::allowed-users] {:roles ["alice"]}))
           (granted  (authorized? [::allowed-users] {:roles ["alice"]}))))))


(comment "The next tests will show how authorized? can be used when evaluation depends on a context.")

(def mock-db
  (let [db [{:name "max"    :roles [:admin :user]}
            {:name "moritz" :roles [:user]}]]
       ;; A query on the mock-db that for a given username returns a record with roles
       {:get-users-query (fn [username] (->> db (filter #(= username (:name %))) first))}))

(s/def ::db-admin #{:admin})
(s/def ::db-user  #{:user})

(deftest authorized?-with-wrap-identity

  (testing "The trivial solution is explicitly calculating granted roles"
    (is      (authorized? [::db-admin] ((:get-users-query mock-db) "max")))
    (is (not (authorized? [::db-admin] ((:get-users-query mock-db) "moritz"))))
    (is      (authorized? [::db-user]  ((:get-users-query mock-db) "moritz")))
    (is (not (authorized? [::db-user]  ((:get-users-query mock-db) "alice")))))

  (testing "We can simplify it by using the :wrap-identity option"
    (let [options {:wrap-identity #((:get-users-query mock-db) %)}]
         (is      (authorized? [::db-admin] "max"    options))
         (is (not (authorized? [::db-admin] "moritz" options)))
         (is      (authorized? [::db-user]  "moritz" options))
         (is (not (authorized? [::db-user]  "alice"  options))))))


(comment "You may want define roles with the `wrap-identity` logic attached to them.")

(deftest authorized?-with-wrap-identity+meta

  (testing ":wrap-identity meta from role"
    (let [wrap-identity (fn [id] ((:get-users-query mock-db) id))
          db-admin ^{:wrap-identity wrap-identity} #(s/valid? ::db-admin %)
          db-user  ^{:wrap-identity wrap-identity} #(s/valid? ::db-user %)]
         (is      (authorized? [db-admin] "max"))
         (is (not (authorized? [db-admin] "moritz")))
         (is      (authorized? [db-user]  "moritz"))
         (is (not (authorized? [db-user]  "alice"))))))


(comment "Probably the wrap-identity should be created by a factory once the ctx is available.")

(defn db-ctx->wrap-identity [ctx]
  (fn [id] ((:get-users-query (:db ctx)) id)))

(def db-admin ^{:ctx->wrap-identity db-ctx->wrap-identity} #(s/valid? ::db-admin %))
(def db-user  ^{:ctx->wrap-identity db-ctx->wrap-identity} #(s/valid? ::db-user %))

(deftest authorized?-with-wrap-identity+ctx

  (testing ":ctx->wrap-identity meta from role"
    (let [options {:ctx {:db mock-db}}]
         (is      (authorized? [db-admin] "max"    options))
         (is (not (authorized? [db-admin] "moritz" options)))
         (is      (authorized? [db-user]  "moritz" options))
         (is (not (authorized? [db-user]  "alice"  options))))))
