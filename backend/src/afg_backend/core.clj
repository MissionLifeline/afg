(ns afg-backend.core
  (:gen-class)  ;; this Class contains our -main function
  (:require [mount.core :as mount]
            [afg-backend.config.state]
            [afg-backend.webserver.state]
            [signal.handler :refer [with-handler]]))

(defn -main [& _args]
  (mount/start)

  (let [finaly (fn [] (mount/stop)  ;; Clean shutdown (e.g. if database should be exported)
                      (System/exit 0))]
       (with-handler :term (finaly))  ;; kill
       (with-handler :int (finaly)))  ;; Ctrl+C

  (mount.core/running-states))  ;; Return value for debugging when called on repl
