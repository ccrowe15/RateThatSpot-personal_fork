const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
const atlas_uri = process.env.ATLAS_URI;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection 
//const db = require("./db/conn");
const db = require("./db/keys").mongoURI;
//mongoose
const passport = require("passport");
const users = require("./routes/users");
//body-parser
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(express.static(__dirname));


// Passport middleware
app.use(passport.initialize());
// Passport config
require("./db/passport")(passport);

// Routes
app.use("/users", users);
app.use(require("./routes/building"))
app.use(require("./routes/facility"))
app.use(require("./routes/posts"));
app.use(require("./routes/users"));
app.use(require("./routes/notification"))
app.use(require("./routes/moderator"));
app.use(require("./routes/comment"))
app.use(require("./routes/facilityRequest"));
app.use(require("./routes/interactions"));


mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(port, () => console.log(`Server Running on Port: http://localhost:${port}`)))
    .catch((error) => console.log(`${error} did not connect`));

