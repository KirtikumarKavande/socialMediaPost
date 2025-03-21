const express = require('express');
const router = express.Router();
const { getAllPosts, createPost } = require('../../../controllers/post.controller');
const { validateGetAllPostsRequest } = require('../../../middleware/validateRequest');
const upload = require('../../../utils/multer');

router.get('/', validateGetAllPostsRequest, getAllPosts);
router.post('/', upload.single('image'), createPost);

module.exports = router;