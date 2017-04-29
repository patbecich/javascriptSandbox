module Handler.BreakOut where

import Import
import Data.UUID (toString, toText)
import Data.UUID.V4
import Text.Julius (rawJS)

getBreakOutR :: Handler Html
getBreakOutR = defaultLayout $ do
  _ <- setTitle "BreakOut"
  gameUUID <- liftIO $ nextRandom
  let gameUUIDString = toText gameUUID
  $(widgetFile "breakOut/breakOut")
