(ns afg-backend.webserver.upload
  (:import [java.io File])
  (:require [afg-backend.config.state :refer [env]]
            [afg-backend.db.state :refer [db_ctx]]
            [afg-backend.security.auth.token.core :refer [token-valid?]]
            [afg-backend.webserver.middleware.graphql :refer [wrap-rest]]
            [ring.util.response :refer [response]]
            [compojure.core :refer [POST]]
            [clojure.java.io :as io]
            [clojure.walk :refer [keywordize-keys]]
            [clojure.string :refer [join includes?]]
            [lib.time :refer [current-date-for-filename]]))

(defn POST* [path body-fn]
  (-> (POST path req
            (body-fn (update req :params keywordize-keys)))
      wrap-rest))


(defn- valid-path? [path regex]
  (and (not (includes? path ".."))
       (re-matches regex path)))

(defn- valid-filename? [filename regex]
  (and (not (includes? filename File/separator))
       (re-matches regex filename)))

(defn- store-upload
  "copy after path validation"
  ([source root path filename] (store-upload source root path filename {}))
  ([source root path filename {:keys [pathRegex filenameRegex]
                               :or {pathRegex #"[a-zA-Z0-9_-]*"
                                    filenameRegex #"[.a-zA-Z0-9_-]+"}}]
    (let [dest (join File/separator [root path filename])
         fullPath (io/file (str root File/separator path))]
         (when (and (valid-path? path pathRegex)
                    (valid-filename? filename filenameRegex)
                    (or (.isDirectory fullPath) (.mkdirs fullPath)))
               (io/copy (io/file source) (io/file dest))
               true))))


(defn upload-formData
  [token userId formData]
  (let [source (:tempfile formData)
        upload-limit-mb (:upload-limit-mb env)
        path token
        date (current-date-for-filename)
        filename (str "formData" "_" date ".json.pgp")]

       (cond
         (not (and token userId formData source))
           {:status 400
            :body "Request misses a required param"}
         (not (token-valid? db_ctx token userId))
           {:status 403
            :body "A valid combination of token and userId is required"}
         (> (.length (io/file source))
            (* 1024 1024 upload-limit-mb))
           {:status 413
            :body (str "Upload exceeds maximum size of " upload-limit-mb "MB")}
         ;; TODO: check the number of files already uploaded by this token
         :else
           (if (store-upload source (:upload-dir env) path filename)
               (response "formData has been stored")
               {:status 500
                :body "store-upload failed. Please ensure path and filename are valid"}))))

(def mime->extension {"application/pdf" ".pdf"
                      "image/jpeg" ".jpeg"})

(defn upload-attachment
  [token userId fileId fileType attachment]
  (let [source (:tempfile attachment)
        upload-limit-mb (:upload-limit-mb env)
        path token
        date (current-date-for-filename)
        extension (mime->extension fileType)
        filename (str "attachment" "_" fileId "_" date extension ".pgp")]

       (cond
         (not (and token userId fileId attachment source))
           {:status 400
            :body "Request misses a required param"}
         (not (token-valid? db_ctx token userId))
           {:status 403
            :body "A valid combination of token and userId is required"}
         (> (.length (io/file source))
            (* 1024 1024 upload-limit-mb))
           {:status 413
            :body (str "Upload exceeds maximum size of " upload-limit-mb "MB")}
         ;; TODO: check the number of files already uploaded by this token
         :else
           (if (store-upload source (:upload-dir env) path filename)
               (response (str "attachment " fileId " has been stored"))
               {:status 500
                :body "store-upload failed. Please ensure path and filename are valid"}))))
