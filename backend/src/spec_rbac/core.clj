(ns spec-rbac.core
  "role-based access control based on clojure.spec"
  (:require [clojure.spec.alpha :as s]))

(defn authorized?
  "Like `cemerick.friend/authorized?`, but based on `s/valid` instead of `isa?`
   Also we return a tuple of the matching required and granted role."
  [required-roles:specs identity:map]
  (let [granted-roles (-> identity:map #_current-authentication :roles)]
       (first (for [granted granted-roles
                    required required-roles:specs
                    :when (s/valid? required granted)]
                   [required granted]))))

;; Helpers to process the return values of authorized?
(def required first)
(def granted second)
