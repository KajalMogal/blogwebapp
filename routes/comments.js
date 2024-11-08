const express = require('express');
const router = express.Router({ mergeParams: true });
const comments = require('../controllers/comments.js');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware.js');
const Post = require('../models/post.js');
const Comment = require('../models/comment.js');

const { commentSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError.js');
const catchAsync = require('../utils/catchAsync.js');

router.post('/', isLoggedIn, validateComment, catchAsync (comments.NewComment));

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;