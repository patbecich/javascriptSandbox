{-# LANGUAGE FlexibleInstances #-}

module Model where

import ClassyPrelude.Yesod
import Database.Persist.Quasi
import qualified Data.UUID as U
import Database.Persist.Sql
import qualified Data.ByteString.Char8 as BS

--import Handler.PostNewBlogEntry (BlogPost)


-- http://bitemyapp.com/posts/2016-06-15-uuids-with-persistent-yesod.html
-- Note we're taking advantage of
-- PostgreSQL understanding UUID values,
-- thus "PersistDbSpecific"
instance PersistField U.UUID where
  toPersistValue u = PersistDbSpecific . BS.pack . U.toString $ u
  fromPersistValue (PersistDbSpecific t) =
    case U.fromString $ BS.unpack t of
      Just x -> Right x
      Nothing -> Left "Invalid UUID"
  fromPersistValue _ = Left "Not PersistDBSpecific"

instance PersistFieldSql U.UUID where
  sqlType _ = SqlOther "uuid"


-- You can define all of your database entities in the entities file.
-- You can find more information on persistent and how to declare entities
-- at:
-- http://www.yesodweb.com/book/persistent/
share [mkPersist sqlSettings, mkMigrate "migrateAll"]
    $(persistFileWith lowerCaseSettings "config/models")
