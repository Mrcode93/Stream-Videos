const { getPosts } = require("../controller/PostsController"); // Import the user controller

const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Posts = require("../models/postsModel");
const multer = require("multer");
const path = require("path");

//! Create a storage engine
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname, "/files");
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    const validImageTypes = ["png", "svg", "webp", "jpg", "jpeg", "mp4", "mov"];
    if (validImageTypes.includes(file.mimetype.split("/")[1])) {
        cb(null, true);
    } else {
        cb(new Error("Not a valid image file!"), false);
    }
};

// Update your multer configuration
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
}).single("myFile"); // Use the same field name as in the client

router.post("/create", (req, res) => {
    // Use the upload middleware
    upload(req, res, async(err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error uploading file" });
        }

        const { title, thumbnail, userId, live, room } = req.body;

        try {
            const post = await Posts.create({
                postTitle: title,
                thumbnail: thumbnail,
                userId: userId,
                video: req.file ? req.file.filename : null,
                live: true,
                room: room,
            });

            post.save();
            res.status(201).json({ message: "Post created successfully", post });
        } catch (error) {
            console.error(error);

            // Handle validation errors more gracefully
            if (error.name === "ValidationError") {
                const validationErrors = Object.keys(error.errors).map(
                    (key) => error.errors[key].message
                );
                return res.status(400).json({ errors: validationErrors });
            }

            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});
router.get("/live/:id", async(req, res) => {
    const id = req.params.id;

    const post = await Posts.find({ room: id });
    res.send(post);
});

router.get("/getPosts", getPosts);

module.exports = router;