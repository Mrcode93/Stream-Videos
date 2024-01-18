import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";

const StreamPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [videoPath, setVideoPath] = useState(null);
  const videoRef = useRef(null);

  const copyUrl = () => {
    const urlToCopy = window.location.href;
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        console.log("URL copied to clipboard!");
        alert("URL copied");
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  const socket = new WebSocket("ws://localhost:8060");

  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    const extractedLiveId = pathParts[pathParts.length - 1];

    // Fetch video information from the server
    fetch(`http://localhost:8060/stream/${extractedLiveId}`)
      .then((response) => {
        setVideoPath(response.url.split("/").pop());
      })
      .catch((error) => {
        console.error("Error fetching video information:", error);
      });

    // WebSocket setup
    const socket = new WebSocket("ws://localhost:8060");

    socket.onopen = (event) => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Handle video control messages
        if (data.action === "play") {
          console.log(data.action);
          videoRef.current.muted = false;
          videoRef.current.play();
        } else if (data.action === "pause") {
          videoRef.current.muted = true;
          videoRef.current.pause();
        } else if (data.action === "seeking") {
          const seekTo = parseFloat(data.position);
          console.log("Seeking to:", seekTo);

          if (!isNaN(seekTo) && isFinite(seekTo)) {
            videoRef.current.currentTime = seekTo;
          } else {
            console.error("Invalid seekTo value:", seekTo);
          }
        } else if (data.action === "volume") {
          console.log("Setting volume to:", data.position); // Change to data.position
          // Set the video volume
          const volume = parseFloat(data.position);

          if (!isNaN(volume) && volume >= 0 && volume <= 1) {
            videoRef.current.volume = volume;
          } else {
            console.error("Invalid volume value:", data.position);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => {
      // Cleanup WebSocket connection when the component is unmounted
      socket.close();
    };
  }, [videoPath, socket]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="stream-page"
    >
      <div>
        <h2>Video Stream</h2>
        {videoPath === null ? (
          <p>Loading...</p>
        ) : (
          <video
            autoPlay
            controls
            width="100%"
            height="100%"
            ref={videoRef}
            onPause={() => {
              socket.send(JSON.stringify({ type: "control", action: "pause" }));
            }}
            onPlay={() => {
              socket.send(JSON.stringify({ type: "control", action: "play" }));
            }}
            onSeeking={(e) => {
              const { currentTime } = e.target; // Extract necessary information
              socket.send(
                JSON.stringify({
                  type: "control",
                  action: "seeking",
                  position: currentTime,
                })
              );
            }}
            onEnded={() => {
              socket.send(JSON.stringify({ type: "control", action: "pause" }));
            }}
            onStalledCapture={() => {
              socket.send(
                JSON.stringify({ type: "control", action: "volume" })
              );
            }}
          >
            <source
              src={`http://localhost:8060/stream/${videoPath}`}
              type="video/mp4"
            />
          </video>

          // <ReactPlayer

          //   url={`http://localhost:8060/stream/${videoPath}`}
          //   controls
          //   width="100%"
          //   height="100%"
          //   onPause={() => {
          //     socket.send(JSON.stringify({ type: "control", action: "pause" }));
          //   }}
          //   onPlay={() => {
          //     socket.send(JSON.stringify({ type: "control", action: "play" }));
          //   }}
          //   onSeeking={(e) => {
          //     socket.send(
          //       JSON.stringify({
          //         type: "control",
          //         action: "seeking",
          //         // position: e.,
          //       })
          //     );
          //   }}
          // />
        )}
      </div>
      <div className="controls">
        <button onClick={copyUrl}>Copy The URL</button>
      </div>
      <div className="messages-container">
        <form>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="button">Send</button>
        </form>
        <div id="messages">
          {messages.reverse().map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StreamPage;
