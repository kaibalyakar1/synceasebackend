const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    meetingId: {
      type: String,
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

meetingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "owner",
  });
  next();
});

module.exports = mongoose.model("Meeting", meetingSchema);
