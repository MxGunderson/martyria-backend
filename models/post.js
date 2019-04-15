const mongoose = require("mongoose");
const Joi = require("joi");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 55
    },
    date: {
      type: Date,
      default: Date.now
    },
    story: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2000
    },
    author: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30
    }
  })
);

function validatePost(post) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(55)
      .required(),
    story: Joi.string()
      .min(10)
      .max(2000)
      .required(),
    author: Joi.string()
      .min(2)
      .max(30)
      .required()
  };

  return Joi.validate(post, schema);
}

exports.Post = Post;
exports.validate = validatePost;
