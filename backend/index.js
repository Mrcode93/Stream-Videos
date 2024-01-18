const userRouter = require("./routes/usr-router");
const postRouter = require("./routes/post-router");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const Grid = require("gridfs-stream");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8060;
const URL = process.env.MONGO_URI;
const { v4: uuidv4 } = require("uuid");
const { send } = require("process");
const Posts = require("./models/postsModel");
const fs = require("fs");
const range = require("range");
const ffmpeg = require("fluent-ffmpeg");
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database successfully...");
    const conn = mongoose.connection;
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads"); // Specify the GridFS collection name
  });
const DIR = "./files/";

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
// !=============================[ GridFS]===================================

// Example server-side code (express.js)
app.get("/stream/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const videoPath = path.join(__dirname, "routes/files", filename);
    const videoStream = fs.createReadStream(videoPath);
    res.setHeader("Content-Type", "video/mp4");
    videoStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error streaming file");
  }
});

app.get("/video/:filename", (req, res) => {
  const { filename } = req.params;

  const videoPath = path.join(__dirname, "routes/files", filename);
  console.log(videoPath);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    console.log(range);
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    console.log("Hello", range);
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// ! ====================================[Upload Videos]===========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { buffer, originalname } = req.file;
    const writestream = gfs.createWriteStream({ filename: originalname });
    writestream.end(buffer);
    res.status(200).send("File uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// !=============================[ WebSocket ]===================================

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "control") {
        handleControl(data.action);
        console.log(`Received control: ${data.action}`);
        // Broadcast the message to all clients
        broadcastControlMessage(wss, ws, data);
      } else if (data.type === "control" && data.action === "seeking") {
        handleControl(data.action);
        console.log(`Received control: ${data.action}`);
        // Broadcast the message to all clients
        broadcastControlMessage(wss, ws, data);
        console.log(`Received control: ${data.action}`);
      } else if (data.type === "control" && data.action === "volume") {
        handleControl(data.action);
        // Broadcast the message to all clients
        broadcastControlMessage(wss, ws, data);
        console.log(`Received control: ${data.action}`);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  function handleControl(action) {
    console.log(`Received control: ${action}`);
  }
  // sent the socket actions to all clients
  function broadcastControlMessage(wss, sender, data) {
    console.log(`Broadcasting control: ${data.action}`);
    wss.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
});

app.use(express.json());
app.use("/auth", userRouter);
app.use("/post", postRouter);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
