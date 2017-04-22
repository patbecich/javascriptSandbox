module Handler.PostNewBlogEntry where

import Import

data BlogPost = BlogPost
  { title :: Text
  }

blogPostForm :: AForm Handler BlogPost
blogPostForm = areq textField "Title" Nothing


getPostNewBlogEntryR :: Handler Html
getPostNewBlogEntryR = do
  defaultLayout $ do
    $(widgetFile "posts/new")
