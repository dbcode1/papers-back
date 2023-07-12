// main entry
const express = require("express");
const connectDB = require("./db.js");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

connectDB();
require("dotenv").config();
app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

process.env.DEBUG = true;

//  apply middleware to all requests
//app.use(limiter);

app.use("/search-news", require("./routes/searchNews"));
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/card", require("./routes/card"));
app.use("/container", require("./routes/container"));

// if ((process.env.NODE_ENV = 'development')) {
//   app.use(cors({ origin: `http://localhost:3000` }));
// }

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
// Set static folder
app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
