const express = require("express");
const path = require("path");
const urlRoute = require("./Routes/urls");
const staticRoute = require("./Routes/staticRouter");
const { connectMongoose } = require("./connect");
const URL = require("./Model/urls");

app = express();

const PORT = 9000;

connectMongoose("mongodb://localhost:27017/short-url")
  .then(() => {
    console.log("Connected to Mongoose");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);

app.use("/", staticRoute);

app.get("/url/:shortID", async (req, res) => {
  const shortId = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  console.log("Object:", entry);
  if (entry) res.redirect(entry.redirectURL);
  else res.status(400).send("URL not found");
});

app.listen(PORT, () => {
  console.log(`Server started at Port: ${PORT}`);
});
