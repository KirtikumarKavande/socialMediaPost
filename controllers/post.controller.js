const Post = require('../models/Post.model');
const Tag = require('../models/Tag.model');
const cloudinaryService = require('../services/cloudinaryService');
const ApiResponse = require('../utils/apiResponse');
const mongoose = require('mongoose');


const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort === 'asc' ? 'createdAt' : '-createdAt';
    const keyword = req.query.keyword;
    const tagName = req.query.tag;
    
    let query = Post.find();
    
    if (keyword) {
      query = query.find({ $text: { $search: keyword } });
    }
    
    if (tagName) {
      const tag = await Tag.findOne({ name: tagName });
      if (tag) {
        query = query.find({ tags: tag._id });
      } else {
        return ApiResponse.success(res, { posts: [], totalPosts: 0, page, pages: 0 });
      }
    }
    
    query = query.sort(sort);
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments(query);
    
    query = query.skip(startIndex).limit(limit).populate('tags', 'name');
    
    const posts = await query;
    
    const pagination = {
      posts,
      totalPosts: total,
      page,
      pages: Math.ceil(total / limit)
    };
    
    return ApiResponse.success(res, pagination);
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

const createPost = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, desc, tags } = req.body;
    
    if (!req.file) {
      return ApiResponse.error(res, 'Please upload an image', 400);
    }
    const image = await cloudinaryService.uploadImage(req.file);
    
    let tagIds = [];
    
    if (tags && tags.length > 0) {
      const tagArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
      
      for (const tagName of tagArray) {
        let tag = await Tag.findOne({ name: tagName }).session(session);
        
        if (!tag) {
          tag = await Tag.create([{ name: tagName }], { session });
          tag = tag[0]; 
        }
        tagIds.push(tag._id);
      }
    }
    
    const post = await Post.create([{
      title,
      desc,
      image: image.url,
      imageId: image.id,
      tags: tagIds
    }], { session });
    
    await session.commitTransaction();
    session.endSession();
    
    const createdPost = await Post.findById(post[0]._id).populate('tags', 'name');
    
    return ApiResponse.success(res, createdPost, 201);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (req.file && req.imageId) {
      await cloudinaryService.deleteImage(req.imageId);
    }
    
    return ApiResponse.error(res, error.message, 500);
  }
};

module.exports = {
  getAllPosts,
  createPost
};