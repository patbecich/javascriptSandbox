{-# LANGUAGE OverloadedStrings #-}

module Lib ( scottyMain ) where

import           Control.Monad.IO.Class
import           Control.Monad.Trans.Class
import           Data.Monoid                   (mconcat)
import           Data.Text.Lazy                (pack)
import           Network.Wai.Middleware.Static
import           Web.Scotty


scottyMain :: IO ()
scottyMain = scotty 8000 $ do
  middleware $ staticPolicy (noDots >-> addBase "static")
  get "/" $ file "static/deflection.html"
  get "/breakOut" $ file "static/breakOut.html"
  get "/scotty/:word" $ do
    beam <- param "word"
    html (mconcat
      [ "<h1>Scotty, "
      , beam
      , " me up!</h1>"])
  post "/breakOutScore" $ do
    score <- param "score" :: ActionM Int
    _ <- liftIO $ putStrLn $ "score received: " ++ show score
    text "score received"
  get "/foo" $ do
    html $ "hello from Scotty"
