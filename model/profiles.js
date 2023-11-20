const mongoose = require("mongoose");

const noReqString = {
  type: String,
  required: false,
};

const reqString = {
  type: String,
  required: true,
};

const profileSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: reqString,
  username: noReqString,
  verified: {
    type: Number,
    default: 0,
  },
  fake: {
    type: Number,
    default: 0,
  },
  left: {
    type: Number,
    default: 0,
  },
  usedCode: {
    type: Number,
    default: 0,
  },
  verifiedAccount: {
    type: Number,
    default: 0,
  },
  linkAccount: noReqString,
  code: noReqString,
});

module.exports = mongoose.model("Profile", profileSchema);
