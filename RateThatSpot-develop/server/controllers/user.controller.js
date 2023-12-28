//publically accessible page
exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
//user page (has to be logged in)s
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
//for moderator role in the future
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};