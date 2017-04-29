module Handler.Home where

import Import
import Yesod.Form.Bootstrap3 (BootstrapFormLayout (..), renderBootstrap3)
import Text.Julius (RawJS (..))

-- This is a handler function for the GET request method on the HomeR
-- resource pattern. All of your resource patterns are defined in
-- config/routes
--
-- The majority of the code you will write in Yesod lives in these handler
-- functions. You can spread them across multiple files if you are so
-- inclined, or create a single monolithic file.
getHomeR :: Handler Html
getHomeR = defaultLayout $ do
  let aDomId = "foo"
  _ <- setTitle "Welcome To Yesod!"
  visitorsRef <- fmap visitors getYesod
  visitors <- liftIO $ atomicModifyIORef visitorsRef $ \i -> (i + 1, i + 1)
  $(widgetFile "homepage")
