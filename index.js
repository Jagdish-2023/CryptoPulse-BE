const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

const reportRoute = require("./routes/reportRoute");
app.use("/api", reportRoute);

app.get("/", (req, res) => {
  res.send("Welcome to CryptoPulse API");
});

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
