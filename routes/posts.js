const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, validatePost } = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });
//const ExpressError = require('../utils/ExpressError');
const Post = require('../models/post');


router.get('/', catchAsync (posts.index));

router.get('/new', isLoggedIn,(posts.new));

router.post('/', isLoggedIn, upload.array('image'), validatePost,catchAsync(posts.newForm))


router.get('/:id', catchAsync(posts.show));

router.get('/:id/:edit', isLoggedIn, catchAsync(posts.editForm));

router.put('/:id', isLoggedIn, upload.array('image'), validatePost, catchAsync(posts.update));

router.delete('/:id', isLoggedIn,(posts.deletePost));

module.exports = router;




