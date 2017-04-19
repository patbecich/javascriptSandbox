{-# LANGUAGE OverloadedStrings #-}

module Lib ( scottyMain ) where

import           Data.Monoid                   (mconcat)
import           Data.Text.Lazy                (pack)
import           Network.Wai.Middleware.Static
import           Web.Scotty

scottyMain :: IO ()
scottyMain = scotty 3000 $ do
    middleware $ staticPolicy (noDots >-> addBase "static")
    get "/" $ file "static/deflection.html"
