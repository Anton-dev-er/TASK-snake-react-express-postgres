const express = require("express");
const router = require("./routes/index");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 5001;
const app = express();

// app.use(express.static("build"));
// app.get("*", (req, res) => {
//   req.sendFile(path.resolve(__dirname, "..", "Client/build", "index.html"));
// });

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => console.log(`localhost:${PORT}`));
