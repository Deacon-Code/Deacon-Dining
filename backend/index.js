const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const RegisterModel = require("./models/Register");
const MenuItemModel = require("./models/Menu-Item");
const { deleteAllDataPoints } = require("./models/Delete"); // Import the delete function
const { main } = require("./models/Scrape");
const PORT = process.env.PORT || 5050;
const axios = require("axios");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
  })
);
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));

mongoose.connect(
  "mongodb+srv://jb:anniebannanniefeefifophannie@menu-data-cluster.cjjaxoh.mongodb.net/?retryWrites=true&w=majority&appName=menu-data-cluster"
);

app.get("/", (req, res) => {
  res.json("Hello World");
});

// TODO: Move to separate file
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
 * TODO: Make protected endpoint
 * Scraping data endpoint:
 * - Get data from javascript script and add it to mongodb database
 */
app.get(
  "/fill-data/81mnOARTS7GfgTCdfG061tyekAjZhuTNAC3qAEObKK8s3Bn4FEhtw10ardgAX6FjVT57IZULTVAoVnNs2v9XkJ2rgMs7gKR3y7IFuqWBTZpCuflZBF3yMMh6Yl3cr98cGDJCxc3jNeiPPwQuIprnQqVWnLbdxiOl",
  async (req, res) => {
    try {
      let items = await main();

      const itemCount = items.length;
      console.log("Number of items:", itemCount);

      for (const item of items) {
        try {
          await axios.post("http://localhost:5050/menu", item);
          console.log("Item added:", item);
        } catch (error) {
          console.error("Error adding item:", error.response);
        }
        await sleep(5);
      }
      res.status(200).send("Data processed successfully");
    } catch (error) {
      console.error("Error processing data:", error);
      res.status(500).send("Internal server error");
    }
  }
);

/*
 * Menu data post API
 * - Creates entry in database with menu item
 */
app.post("/menu", (req, res) => {
  const { location, item, date, station, time, dateAdded } = req.body;
  MenuItemModel.create({
    location: location,
    item: item,
    date: date,
    station: station,
    time: time,
    dateAdded: dateAdded,
  })
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json({ error: err.message }));
});

/*
 * Main searching API
 * - call comes in and results go back
 */
app.get("/menu/search", async (req, res) => {
  try {
    const { keyword } = req.query;

    // Get the current date
    const currentDate = new Date();

    const filteredItems = await MenuItemModel.find({
      date: { $gte: currentDate },
    });

    const regex = new RegExp(keyword, "i");
    const matchedItems = filteredItems.filter((item) => regex.test(item.item));

    res.json(matchedItems);
  } catch (error) {
    console.error("Error searching menu items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*
 * TODO: Make this a protected endpoint
 * Delete API
 * - deletes all entries in the mongodb database
 */
app.delete("/del-all-data", async (req, res) => {
  try {
    const deleteResult = await deleteAllDataPoints();
    res
      .status(200)
      .json({ message: `${deleteResult} data points deleted successfully.` });
  } catch (error) {
    console.error("Error deleting data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting data points." });
  }
});

// Assign application to a port
app.listen(PORT, () => {
  console.log("Server is Running");
});
