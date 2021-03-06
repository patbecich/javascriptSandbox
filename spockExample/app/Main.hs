{-# LANGUAGE OverloadedStrings #-}
module Main where

import           Network.Wai.Middleware.Static
import           Web.Spock
import           Web.Spock.Action              (file)
import           Web.Spock.Config

import           Control.Monad.Trans
import           Data.IORef
import           Data.Monoid
import qualified Data.Text                     as T

data MySession = EmptySession
data MyAppState = DummyAppState (IORef Int)

main :: IO ()
main =
    do ref <- newIORef 0
       spockCfg <- defaultSpockCfg EmptySession PCNoDatabase (DummyAppState ref)
       runSpock 8080 (spock spockCfg app)


--appMiddleware :: SpockT IO ()
-- appMiddleware = middleware $ staticPolicy (noDots >-> addBase "static")

app :: SpockM () MySession MyAppState ()
app =
    do get root $
           text "Hello World!"
       get ("hello" <//> var) $ \name ->
           do (DummyAppState ref) <- getState
              visitorNumber <- liftIO $ atomicModifyIORef' ref $ \i -> (i+1, i+1)
              text ("Hello " <> name <> ", you are visitor number " <> T.pack (show visitorNumber))
       get "/breakOut" $ file "break out" "static/breakOut.html"
       middleware $ staticPolicy (noDots >-> addBase "static")

