const express = require("express");

const app = express();

const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Middleware = require("./middleware/index.js");
const middleware = require("./middleware/index.js");
const UserModel = require("./models/userModel.js");
const MeetingModel = require("./models/meetingModel.js");
const ShortUniqueId = require("short-unique-id");
const port = 9000;
require("dotenv").config();
//db
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then((result) => {
    console.log("connected to database");
  })
  .catch((err) => console.log(err));
app.use(cors());
app.use(middleware.decodeToken);
app.use(bodyParser.json());
//routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to syncease",
    status: "success",
  });
});

app.post("/login", async (req, res) => {
  const { uid, name, email, picture } = req.user;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      await UserModel.findOneAndUpdate(
        { email },
        {
          uid,
          displayName: name,
          email,
          photoURL: picture,
        }
      );
    } else {
      await UserModel.create({
        uid,
        displayName: name,
        email,
        photoURL: picture,
      });
    }
    res.json({
      message: "login successful",
      status: "success",
    });
  } catch (e) {
    res.json({
      message: "Internal server error" + e.message,
      status: "error",
    });
  }
});
app.post("/create-meeting", middleware.userExists, async (req, res) => {
  try {
    const { title, date, time } = req.body;
    const { randomUUID } = new ShortUniqueId({ length: 20 });
    await MeetingModel.create({
      owner: req.user.id,
      title,
      date,
      time,
      meetingId: randomUUID(),
    });
    res.json({
      message: "Meeting created successfully",
      status: "success",
    });
  } catch (e) {
    res.json({
      message: "Internal server error" + e.message,
      status: "error",
    });
  }
});

app.get("/my-meetings", middleware.userExists, async (req, res) => {
  try {
    const meetings = await MeetingModel.find({ owner: req.user.id }).sort({
      date: -1,
    });
    res.json({
      message: "Meetings fetched successfully",
      status: "success",
      data: meetings,
    });
  } catch (e) {
    res.json({
      message: "Internal server error" + e.message,
      status: "error",
    });
  }
});

app.post("/edit-meeting/:id", middleware.userExists, async (req, res) => {
  try {
    const { id } = req.params;

    const { title, date, time, status } = req.body;

    await MeetingModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        date,
        time,
        status,
      }
    );
    res.json({
      message: "Meeting updated successfully",
      status: "success",
    });
  } catch (e) {}
});

app.get("/get-single-meeting/:meetingId", async (req, res) => {
  try {
    const singleMeeting = await MeetingModel.findOne({
      meetingId: req.params.meetingId,
    });
    res.json({
      message: singleMeeting,
      status: "success",
    });
  } catch (e) {
    res.json({
      message: "Internal server error" + e.message,
      status: "error",
    });
  }
});

//server
app.listen(port, () => console.log(`server running on port ${port}`));
