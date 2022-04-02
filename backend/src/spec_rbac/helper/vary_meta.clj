(ns spec-rbac.helper.vary-meta)

(defn try-vary-meta
  "vary-meta if possible (when obj supports meta)"
  [obj f & args]
  (when-not (nil? obj)
            (try (apply vary-meta (concat [obj f] args))
                 (catch ClassCastException e obj))))
