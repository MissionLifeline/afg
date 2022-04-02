(ns spec-rbac.roles.public
  (:require [clojure.spec.alpha :as s]))

;; A role that always grants access — for explicitly documenting resources as being public and for debugging
(def public ^{:wrap-identity (fn [_] {:roles [:some]})}
            #(s/valid? any? %))
