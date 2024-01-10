const express = require("express");
const urlRoute = require("./Routes/urls");
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

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortID", async (req, res) => {
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
  console.log("Object:", entry)
  if (entry) res.redirect(entry.redirectURL);
  else res.status(400).send("URL not found");
});

app.listen(PORT, () => {
  console.log(`Server started at Port: ${PORT}`);
});
