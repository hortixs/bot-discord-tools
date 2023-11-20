const mongoose = require("mongoose");
const { Profile } = require("../model/index");

module.exports = (client) => {
  client.createProfile = async (user) => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, user);
    const createProfile = await new Profile(merged);
    createProfile
      .save()
      .then((u) => console.log(`(DATABASE) New user -> ${u.username}`));
  };

  function randomAnswer() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  client.getProfile = async (user) => {
    const dataProfile = await Profile.findOne({ userID: user.user.id });
    if (dataProfile) return dataProfile;
    if (!dataProfile)
      return client.createProfile({
        userID: user.user.id,
        username: user.user.username,
        verified: 0,
        fake: 0,
        left: 0,
        usedCode: 0,
        verifiedAccount: 0,
        linkAccount: "none",
        code: randomAnswer(),
      });
  };

  client.getAllProfiles = async () => {
    const dataProfile = await Profile.find({});
    if (dataProfile) return dataProfile;
    if (!dataProfile) return;
  };

  client.updateProfile = async (user, settings) => {
    let dataProfile = await client.getProfile(user);
    if (typeof dataProfile !== "object") dataProfile = {};
    for (const key in settings) {
      if (dataProfile[key] !== settings[key]) dataProfile[key] = settings[key];
    }
    return dataProfile.updateOne(settings);
  };

  client.deleteProfile = async (user) => {
    const dataUser = await client.getProfile(user);
    if (dataUser)
      return Profile.findOneAndDelete({ userID: dataUser.userID }).then((u) =>
        console.log(`(DATABASE) Delete user -> ${u.username}`)
      );

    if (!dataUser) return;
  };
};
