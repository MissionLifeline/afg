(ns afg-backend.webserver.handler
  (:require [afg-backend.config.state :refer [env]]
            [afg-backend.webserver.middleware :refer [wrap-defaults]]
            [afg-backend.webserver.middleware.graphql :refer [wrap-graphql wrap-graphiql wrap-rest]]
            [afg-backend.webserver.middleware.nextjs :refer [wrap-nextjs-frontend wrap-frontend-config]]
            [ring.middleware.multipart-params :refer [wrap-multipart-params]]
            [afg-backend.resolver.core :refer [graphql]]
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

  (-> (POST "/api/upload-form" req
            (response "TODO: Needs to be implemented"))
      wrap-multipart-params
      wrap-rest)

  (-> (POST "/api/upload-attachment" req
            (response "TODO: Needs to be implemented"))
      wrap-multipart-params
      wrap-rest)

  (route/not-found "Not Found"))

(def app
  (-> app-routes

      (wrap-nextjs-frontend)
      (wrap-frontend-config)

      (wrap-defaults)))
