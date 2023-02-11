# benzelbook
Benzelbook is a Facebook-inspired app, built using the MERN stack.

Live preview at https://benzel-book.web.app/

## Built with
* Express/Node.js
* React
* MongoDB/Mongoose
* Cloudinary
* Vanilla CSS
* JWT auth
* Railway server hosting
* Firebase client hosting

## Features
* Create unique accounts
* Guest log-in
  - Guests *can* write posts and comments
  - Guests *cannot* like posts/comments, delete their own posts/comments, or send friend requests
  - Guests also don't have their own profile pages
* Upload/update profile photos
* News feed that displays global posts in order of most-recently posted date
* Search for users by name
* Send/approve/delete friend requests
* Make text-only posts
  - Can write posts on other users' walls that don't appear in global news feed
* Respond to posts with comments
* Like (and un-like) posts and comments
* Delete self-authored posts and comments
  - Recursively deletes all associated child comments/likes
* Profile pages that display user info
* Edit 'About Me' section of profile
