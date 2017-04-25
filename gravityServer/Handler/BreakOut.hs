module Handler.BreakOut where

import Import

getBreakOutR :: Handler Html
getBreakOutR = defaultLayout $ do
  _ <- setTitle "BreakOut"
  $(widgetFile "breakOut/breakOut")
