const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      // required: true,
    },
    postTitle: {
      type: String,
      // required: true,
    },
    video: {
      type: String,
    },
    room: {
      type: String,
    },
    live: {
      type: Boolean,
      // default: true,
    },
    comments: [],
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true }
);

const Posts = mongoose.model("post", postSchema);

module.exports = Posts;
