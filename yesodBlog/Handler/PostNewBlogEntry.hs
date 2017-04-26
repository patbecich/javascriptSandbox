module Handler.PostNewBlogEntry where

import Import
import Yesod.Form.Bootstrap3
import Text.Markdown (Markdown)
import Yesod.Text.Markdown

-- Model.hs will create this for us, automatically
-- data BlogPost = BlogPost
--   { blogpost_title :: Text
--   , blogpost_article :: Markdown
--   }

blogPostForm :: AForm Handler BlogPost
blogPostForm = BlogPost
  <$> areq textField (bfs ("Title" :: Text)) Nothing
  <*> areq markdownField (bfs ("Article" :: Text)) Nothing

getPostNewBlogEntryR :: Handler Html
getPostNewBlogEntryR = do
  (widget, enctype) <- generateFormPost $ renderBootstrap3 BootstrapBasicForm blogPostForm
  defaultLayout $ do
    $(widgetFile "posts/new")

postPostNewBlogEntryR :: Handler Html
postPostNewBlogEntryR = do
  ((res, widget), enctype) <- runFormPost $ renderBootstrap3 BootstrapBasicForm blogPostForm
  case res of
    FormSuccess blogPost -> do
      blogPostId <- runDB $ insert blogPost
      redirect $ PostDetailsR blogPostId
    _ -> defaultLayout $(widgetFile "posts/new")
  



