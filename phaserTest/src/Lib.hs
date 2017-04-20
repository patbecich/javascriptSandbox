{-# LANGUAGE OverloadedStrings #-}

module Lib ( scottyMain ) where

import           Control.Monad.IO.Class
import           Control.Monad.Trans.Class
import           Data.Monoid                   (mconcat)
import           Data.Text.Lazy                (pack)
import           Network.Wai.Middleware.Static
import           Web.Scotty


scottyMain :: IO ()
scottyMain = scotty 80 $ do
  middleware $ staticPolicy (noDots >-> addBase "static")
  get "/" $ file "static/deflection.html"
  get "/breakOut" $ file "static/breakOut.html"
  get "/helloPhaser" $ file "static/helloPhaser.html"
  get "/phaserMario" $ file "static/phaserMario.html"
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
  get "/phaser/gettingStarted/" $ file "static/phaser/gettingStarted/index.html"
  get "/phaser/gettingStarted/part2" $ file "static/phaser/gettingStarted/part2.html"
  get "/phaser/gettingStarted/part3" $ file "static/phaser/gettingStarted/part3.html"
  get "/phaser/gettingStarted/part4" $ file "static/phaser/gettingStarted/part4.html"
  get "/phaser/gettingStarted/part5" $ file "static/phaser/gettingStarted/part5.html"
  get "/phaser/gettingStarted/part6" $ file "static/phaser/gettingStarted/part6.html"
  get "/phaser/gettingStarted/part7" $ file "static/phaser/gettingStarted/part7.html"
  get "/phaser/gettingStarted/part8" $ file "static/phaser/gettingStarted/part8.html"
  get "/phaser/firstGame/" $ file "static/phaser/firstGame/tutorial.html"
  get "/phaser/firstGame/part1" $ file "static/phaser/firstGame/part1.html"
  get "/phaser/firstGame/part2" $ file "static/phaser/firstGame/part2.html"
  get "/phaser/firstGame/part3" $ file "static/phaser/firstGame/part3.html"
  get "/phaser/firstGame/part4" $ file "static/phaser/firstGame/part4.html"
  get "/phaser/firstGame/part5" $ file "static/phaser/firstGame/part5.html"
  get "/phaser/firstGame/part6" $ file "static/phaser/firstGame/part6.html"
  get "/phaser/firstGame/part7" $ file "static/phaser/firstGame/part7.html"
  get "/phaser/firstGame/part8" $ file "static/phaser/firstGame/part8.html"
  get "/phaser/firstGame/part9" $ file "static/phaser/firstGame/part9.html"

