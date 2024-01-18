const express = require("express");
const Posts = require("../models/postsModel");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Posts.find({})
      .populate("userId")
      .sort({ createdAt: 1 });
    res.send(posts);
  } catch (error) {
    console.error(error);
  }
};
