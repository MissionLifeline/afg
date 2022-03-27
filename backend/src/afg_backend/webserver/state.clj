(ns afg-backend.webserver.state
  (:require [ring.adapter.jetty]
            [ring.middleware.reload]
            [afg-backend.webserver.handler]
            [mount.core :as mount :refer [defstate]]
            [afg-backend.config.state]))

(defstate ^{:on-reload :noop}  ;; When the app is recompiled, mount should not care, but we use ring.middleware.reload/wrap-reload
  webserver
  :start (do (println (str "Start server at http://localhost:" (:port afg-backend.config.state/env)))
             (ring.adapter.jetty/run-jetty (ring.middleware.reload/wrap-reload #'afg-backend.webserver.handler/app)
                                           {:port (:port afg-backend.config.state/env) :join? false}))
  :stop (.stop webserver))
