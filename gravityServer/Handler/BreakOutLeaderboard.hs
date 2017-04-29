module Handler.BreakOutLeaderboard where

import Import
import qualified Data.Text as T
import qualified Text.Read as TR
import qualified Database.Redis as R
import Data.UUID
import Data.Either (either)
import qualified Data.ByteString.Char8 as BS
-- import Model

getBreakOutLeaderboardR :: Handler Html
getBreakOutLeaderboardR = error "Not yet implemented: getBreakOutLeaderboardR"

postBreakOutLeaderboardSubmitR :: UUID -> Handler Html
postBreakOutLeaderboardSubmitR gameUUID = do
  maybeName <- lookupPostParam "name"
  let name = fromMaybe "Nameless" maybeName
  _ <- liftIO $ putStrLn $ T.pack (show name) ++ " submits a score to leaderboard"
  app <- getYesod
  let redisPool = appRedisPool app
  eitherScore <- liftIO $ R.runRedis redisPool $ R.get (toASCIIBytes gameUUID)
  let eitherScoreInt :: Either R.Reply (Maybe Int)
      eitherScoreInt = fmap (\maybeByteString -> maybeByteString  >>= (TR.readMaybe . BS.unpack)) eitherScore
      maybeScore = either (\_ -> (Just 0)) id eitherScoreInt
      score = fromMaybe 0 maybeScore
      -- leaderboardEntry = undefined
      leaderboardEntry = Leaderboard name score gameUUID
  _ <- runDB $ insert leaderboardEntry
  return "received"

