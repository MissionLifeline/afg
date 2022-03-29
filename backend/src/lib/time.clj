(ns lib.time  ;; for now no additional dependency is required
  (:import java.text.SimpleDateFormat
           java.util.Calendar))

(defn current-iso-8601
  "Returns current ISO 8601 compliant date."
  []
  (.format (SimpleDateFormat. "yyyy-MM-dd'T'HH:mm:ssZ")
           (.getTime (Calendar/getInstance))))

(defn current-data-for-filename
  "Returns current date in a format that is allowed by windows filenames."
  []
  (.format (SimpleDateFormat. "yyyy-MM-dd_HH_mm_ss")
           (.getTime (Calendar/getInstance))))

(comment (current-data-for-filename))
