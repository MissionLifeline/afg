(ns spec-rbac.core
  "role-based access control based on clojure.spec"
  (:require [clojure.spec.alpha :as s]))

(defn authorized?
  "Like `cemerick.friend/authorized?`, but based on `s/valid` instead of `isa?`
   Also we return a tuple of the matching required and granted role."
  ([required-roles:specs id] (authorized? required-roles:specs id {}))
  ([required-roles:specs id options]
  (first (for [required required-roles:specs
               granted (-> id
                           (#(let [wrap (or (when-let [f (:ctx->wrap-identity (meta required))]
                                                      (f (:ctx options)))
                                            (:wrap-identity (meta required))
                                            (:wrap-identity options)
                                            identity)]
                                  (wrap %)))
                           :roles)
               :when (s/valid? required granted)]
              [required granted]))))

;; Helpers to process the return values of `authorized?`
(def required first)
(def granted second)
