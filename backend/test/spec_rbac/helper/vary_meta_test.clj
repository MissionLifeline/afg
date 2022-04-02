(ns spec-rbac.helper.vary-meta-test
  (:require [clojure.test :refer [deftest testing is]]
            [spec-rbac.helper.vary-meta :refer [try-vary-meta]]))

(deftest try-vary-meta-test
  (testing "vary-meta if possible"
    (let [result-with-meta (try-vary-meta {:a :b} assoc :my-meta-attr1 "hello" :my-meta-attr2 :world)
          result-with-merged-meta (try-vary-meta (with-meta {:a :b} {:my-meta-attr1 "hello"}) assoc :my-meta-attr2 :world)
          result-without-meta (try-vary-meta "not-an-object" assoc :my-meta-attr1 "hello" :my-meta-attr2 :world)
          result-nil (try-vary-meta nil assoc :my-meta-attr1 "hello" :my-meta-attr2 :world)]
         (is (= {:a :b}
                result-with-meta
                result-with-merged-meta))
         (is (= {:my-meta-attr1 "hello" :my-meta-attr2 :world}
                (meta result-with-meta)
                (meta result-with-merged-meta)))
         (is (= "not-an-object"
                result-without-meta))
         (is (= nil
                (meta result-without-meta)
                (meta result-nil)
                result-nil)))))
