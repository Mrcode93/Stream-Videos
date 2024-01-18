import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
const LivePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assume you have a backend endpoint for handling post data
      const formData = new FormData();
      formData.append("title", title);
      formData.append("thumbnail", "thumbnail.png");
      formData.append("myFile", videoFile);
      formData.append("userId", "65a1e4ad44248b2036513325");
      formData.append("live", true);
      formData.append("room", Math.random().toString(36).substring(2, 15));

      const response = await axios.post(
        "http://localhost:8060/post/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log("Post uploaded successfully!");
        // Optionally, you can redirect the user or perform other actions
      } else {
        console.error("Failed to upload post:", response.data);
        setError("Failed to upload post. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        "An error occurred. Please check your internet connection and try again."
      );
    }
  };

  return (
    <motion.div
      // i wana from 200 to 0
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1 }}
      exit={{ y: -200, opacity: 0 }}
      className="live-page"
    >
      <h2> Live Page </h2>{" "}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title"> Post Title: </label>{" "}
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="description"> Post Description: </label>{" "}
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>{" "}
        <label htmlFor="video"> Video File: </label>{" "}
        <input
          type="file"
          id="video"
          onChange={(e) => setVideoFile(e.target.files[0])}
          accept="video/*"
          required
        />
        <button type="submit"> Upload Post </button>{" "}
      </form>{" "}
      {error && <p className="error-message"> {error} </p>}{" "}
    </motion.div>
  );
};

export default LivePage;
