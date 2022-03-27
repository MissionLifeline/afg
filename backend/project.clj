(defproject afg-backend "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "https://github.com/MissionLifeline/afg"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [;; core
                 [org.clojure/clojure "1.10.3"]
                 [yogthos/config "1.2.0"]
                 [mount "0.1.16"]
                 [spootnik/signal "0.2.4"]
                 ;; http + graphql
                 [org.clojars.johannesloetzsch/specialist-server "0.7.0" :exclusions [com.ibm.icu/icu4j]]
                 [compojure "1.6.2"]
                 [ring/ring-core "1.9.5"]
                 [ring/ring-jetty-adapter "1.9.5"]
                 [ring/ring-devel "1.9.5"]
                 [ring-cors "0.1.13"]
                 [ring/ring-json "0.5.1" :exclusions [cheshire]]
                   [cheshire "5.10.2"]
                 [ring-json-response "0.2.0"]
                 [co.deps/ring-etag-middleware "0.2.1"]
                ]
  ;:repl-options {:init-ns afg-backend.core}
  :main afg-backend.core
  :profiles {:uberjar {:aot :all}})
