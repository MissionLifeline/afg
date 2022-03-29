(ns afg-backend.security.auth.token.core)

(defn token-valid?
  "TODO:
    * check: token existing in db
    * check: expectedUserId(token) == userId (or :notYetSet)
  "
  [_token _userId]
  true)
