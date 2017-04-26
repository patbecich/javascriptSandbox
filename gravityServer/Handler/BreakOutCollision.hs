module Handler.BreakOutCollision where

import Import
import Data.UUID
import qualified Data.Text as T

postBreakOutCollisionR :: UUID -> Handler Html
postBreakOutCollisionR gameUUID' = do
  _ <- liftIO $ putStrLn $ "collision in game "++(T.pack (show gameUUID'))
  return "received"
  
