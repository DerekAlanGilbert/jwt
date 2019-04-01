const express = require("express");
const bodyParser = require("body-parser");
const expressjwt = require("express-jwt");
const jwt = require("jsonwebtoken");

const cors = require("cors");

const app = express();

const PORT = process.env.API_PORT || 8888;
const users = [
  { id: 1, username: "admin", password: "admin" },
  { id: 2, username: "guest", password: "guest" }
];
app.use(cors());
app.use(bodyParser.json());

const jwtCheck = expressjwt({
  secret: "mysupersecretkey"
});

app.get("/resource", (req, res) => {
  const localTime = new Date().toLocaleTimeString();
  res.status(200).send("public, no auth requried");
});

app.get("/resource/secret", jwtCheck, (req, res) => {
  res.status(200).send("Secret, you should be logged in to see this.");
});

app.get("/status", (req, res) => {
  const localTime = new Date().toLocaleTimeString();
  res.status(200).send({
    server: "Express JWT Auth. V0",
    localTme: localTime,
    author: "Derek Gilbert"
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    res.status(400).send("you need a username and password");
    return;
  }

  const user = users.find(u => {
    return u.username === username && u.password === password;
  });

  if (!user) {
    res.status(401).send("user not found");
    return;
  }

  const token = jwt.sign(
    {
      sub: user.id,
      username
    },
    "mysupersecretkey",
    { expiresIn: "3 hours" }
  );

  res.status(200).send({ access_token: token });
});

app.get("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
