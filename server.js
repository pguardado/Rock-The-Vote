const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const { expressjwt } = require("express-jwt");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

async function connecttoDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to db");
  } catch (error) {
    console.log(error);
  }
}
connecttoDb();

app.use("/api/auth", require("./routes/authRouter"));

const jwtMiddleware = expressjwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
}).unless({
  path: ["/api/auth", "/api/main/issues/public"],
});

app.use((req, res, next) => {
  console.log("Request path:", req.path);
  next();
});

app.use(jwtMiddleware);

app.use("/api/main/issues", require("./routes/issueRouter"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "UnauthorizedError") {
    res.status(401).send({ errMsg: "Unauthorized access" });
  } else {
    res.status(500).send({ errMsg: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
