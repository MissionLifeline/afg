(ns afg-backend.webserver.middleware.nextjs
  (:require [afg-backend.config.state :refer [env]]
            [clojure.string :as string :refer [ends-with?]]
            [lib.resources.list-resources :refer [list-resources]]
            [ring.util.json-response :refer [json-response]]
            [ring.util.response :refer [resource-response content-type]]))

(defn wrap-nextjs-frontend
  "Serve the frontend:
   1. Everything from the backend that is not the mocked /
   2. Any directory should serve the index.html when existing
   3. Serve an .html file instead of a requested file without extension
   4. When a not existing file is accessed in a directory with only 1 .html (probably a route with a variable), serve that instead
   5. If all attempts failed, pass the 404"
  [handler]
  (fn [req]
      (let [res (handler req)
            path (string/replace (:uri req) #"/[^/]*$" "/")
            file (string/replace (:uri req) #".*/" "")
            html (->> (list-resources (str "public" path))
                      (remove #(re-matches #".+[/].*" %))  ;; Only files that are not in a subdirectory
                      (filter #(re-matches #".*\.html" %)))
            query-string (str "?" (:query-string req))]
           (cond (not (or (= 404 (:status res))
                          (= "/" (:uri req))))
                   res
                 (and (ends-with? (:uri req) "/")
                      (some #{"index.html"} html))
                   {:status 302
                    :headers {"Location" (str (:uri req) "index.html" query-string)}
                    :body ""}
                 (some #{(str file ".html")} html)
                   {:status 302
                    :headers {"Location" (str (:uri req) ".html" query-string)}
                    :body ""}
                 (= 1 (count html))
                   (-> (resource-response (str "public" path (first html)))
                       (content-type "text/html"))
                 :else
                   res))))

(defn wrap-frontend-config
  "Provide config for static build of frontend"
  [handler]
  (fn [req]
      (if (= "/config.json" (:uri req))
          ;; If the config would become larger, we should calc an ETag header
          ;; For using `etag/wrap-file-etag`, body would need to be of instance? File
          (json-response {:base_url (:frontend-base-url env)
                          :backend_base_url (:frontend-backend-base-url env)})
          (handler req))))
