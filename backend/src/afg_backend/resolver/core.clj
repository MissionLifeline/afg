(ns afg-backend.resolver.core
  (:require [specialist-server.core :refer [executor]]
            [mount.core :as mount :refer [defstate]]
            [afg-backend.config.state :refer [env]]
            [afg-backend.resolver.user.get-keys :refer [get_keys]]
            #_[afg-backend.db.state :refer [->db_ctx db_ctx]]))

(def graphql* (executor {:query {:get_keys #'get_keys}
                         :mutation {}}))

(defn ->graphql
  "Create a wrapped graphql-executor, that merges context into the request.

   For default usage in the app, the db_ctx should be a singleton handled by mount.
   When {:singleton? true} is used, closing the db (deleting the lock) is provided by mount.

   Since all testcases within a file run in parallel, several db instances are wanted to avoid race conditions.
   It's easy to get an executor with a new db-instance by (->graphql) for testcases with mutations.
   The easiest way of having several instances without worrying about locks is using the config option {:db-inmemory true}."

  [& {:keys [singleton?] :or {singleton? false}}]
  (let [db_ctx nil #_(if singleton? db_ctx (->db_ctx))]
       (fn [query]
           (graphql* (-> query
                         (assoc-in [:context :db_ctx]
                                   db_ctx)
                         (assoc-in [:context :validate-output?]
                                   (or (get-in query [:context :validate-output?])
                                       (:validate-output env))))))))

(defstate graphql
  :start (afg-backend.resolver.core/->graphql :singleton? true))