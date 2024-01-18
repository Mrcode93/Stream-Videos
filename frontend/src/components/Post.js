import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TumbNail from "./images/HD-wallpaper-pubg-montage-thumbnail-no-copyright-pubg-thumbnail-pack-sorif-bgmi-thumbnail.jpg";
const Post = () => {
  const [posts, setPosts] = useState([]);

  const url = "http://localhost:8060/post/getPosts";

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const res = await axios.get(url);
    setPosts(res.data);
  };

  return (
    <motion.div
      // i wana from 200 to 0
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1 }}
      exit={{ y: -200, opacity: 0 }}
      // layout
      className="posts-page"
    >
      <h1> Streams </h1>{" "}
      <div className="upload">
        <Link to="/live-page">
          <button> Make New Stream </button>{" "}
        </Link>{" "}
      </div>{" "}
      {posts.map((post) => (
        <Link to={`/live/${post.video}`} key={post.id}>
          {" "}
          {/* Add a unique key for each Link component */}{" "}
          <div className="post">
            <div className="post-header">
              <AccountCircleIcon className="post-avatar" />
              <div className="post-title"> {post.postTitle} </div>{" "}
            </div>{" "}
            <div className="post-description">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.Expedita,
              illo.{" "}
            </div>{" "}
            {/* <video src={post.video} controls></video>
             */}{" "}
            <img src={TumbNail} alt="thumbnail" style={{ width: "100%" }} />{" "}
          </div>{" "}
        </Link>
      ))}{" "}
    </motion.div>
  );
};

export default Post;
