(ns afg-backend.webserver.handler
  (:require [afg-backend.config.state :refer [env]]
            [afg-backend.webserver.middleware :refer [wrap-defaults]]
            [afg-backend.webserver.middleware.graphql :refer [wrap-graphql wrap-graphiql]]
            [afg-backend.webserver.middleware.nextjs :refer [wrap-nextjs-frontend wrap-frontend-config]]
            [afg-backend.resolver.core :refer [graphql]]
            [afg-backend.webserver.upload :refer [POST* upload-formData upload-attachment]]
            [ring.middleware.multipart-params :refer [wrap-multipart-params]]
            [compojure.core :refer [defroutes GET POST]]
            [compojure.route :as route]
            [ring.util.response :refer [response]]))

(defroutes app-routes
  (GET "/" [] ;; When using a fullstack-build, this route is overwritten by `wrap-nextjs-frontend`
              (let [frontend-url (:frontend-base-url env)]
                   (str "<p>The backend takes care of data storage and securing its access.<br/>"
                        "   It provides a <a href=\"/graphql\">Graphql-API Endpoint</a>.<br/>"
                        "   You may want explore the schema and send queries using <a href=\"/graphiql/index.html\">GraphiQL</a>."
                        "</p>"
                        "<p>This build doesn't include the frontend.<br/>"
                        "   You may want start it independently and open <a href=\"" frontend-url "\">" frontend-url "</a>.</br>"
                        "   Alternatively production builds including the frontend are available via nix."
                        "</p/>")))

  (-> (POST "/graphql" req
            (response (graphql (:body req))))
      wrap-graphql
      wrap-graphiql)

  (POST* "/api/upload-form"
    (fn [req]
        (let [{:keys [token userId formData]} (:params req)]
             (upload-formData token userId formData))))

  (POST* "/api/upload-attachment"
    (fn [req]
        (let [{:keys [token userId fileId fileType attachment]} (:params req)]
             (upload-attachment token userId fileId fileType attachment))))

  (route/not-found "Not Found"))

(def app
  (-> app-routes
      (wrap-multipart-params)  ;; when receiving streams, we can't call it multiple times on the same body

      (wrap-nextjs-frontend)
      (wrap-frontend-config)

      (wrap-defaults)))
