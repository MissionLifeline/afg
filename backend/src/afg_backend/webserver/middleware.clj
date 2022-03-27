(ns afg-backend.webserver.middleware
  (:require [afg-backend.config.state :refer [env]]
            [ring.middleware.json :refer [wrap-json-response]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [co.deps.ring-etag-middleware :as etag]
            [ring.middleware.not-modified :refer [wrap-not-modified]]
            [ring.middleware.cors :refer [wrap-cors]]))

(defn wrap-debug
  [handler]
  (fn [req]
      (let [res (handler req)]
           (when (:verbose env)
                 (println (:status res)
                          (:uri req)))
           res)))

(defn wrap-cors-from-env
  "cors configuration depends on `env`"
  [handler]
  (fn [req]
      (let [dynamic-wrapped (wrap-cors handler :access-control-allow-origin [#"http://localhost:3000"
                                                                            (when (:frontend-base-url env) (re-pattern (:frontend-base-url env)))]
                                               :access-control-allow-methods [:get :put :post :delete])
            res (dynamic-wrapped req)]
           res)))

(defn wrap-defaults [handler]
  (-> handler
      (wrap-content-type)
      (wrap-json-response)

      (etag/wrap-file-etag)
      (wrap-not-modified)

      (wrap-cors-from-env)

      (wrap-debug)))
