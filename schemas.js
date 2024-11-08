const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;
module.exports.postSchema = Joi.object({
    post: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

 module.exports.commentSchema = Joi.object({
     comment: Joi.object({
         body: Joi.string().required()
     }).required()
 })

