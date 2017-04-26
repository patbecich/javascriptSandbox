module Handler.BreakOutCollision where

import Import
import Data.UUID
import Data.Maybe
import Text.Read
import qualified Data.ByteString as SBS
import qualified Data.Text as T
import qualified Database.Redis as R


postBreakOutCollisionR :: UUID -> Handler Html
postBreakOutCollisionR gameUUID' = do
  _ <- liftIO $ putStrLn $ "collision in game "++(T.pack (show gameUUID'))
  app <- getYesod
  let redisPool = appRedisPool app
  _ <- liftIO $ R.runRedis redisPool $ do
    priorScoreString <- R.get (toASCIIBytes gameUUID')
    R.incr (toASCIIBytes gameUUID')
  return "received"
  
    --let
      --maybePriorScore :: Maybe Int
      --maybePriorScore = undefined --readMaybe >>= (SBS.unpack priorScoreString)
      --priorScore :: Int
      --priorScore = fromMaybe 0 maybePriorScore
    --R.set (toASCIIBytes gameUUID') (pack ( (priorScore+1)))
