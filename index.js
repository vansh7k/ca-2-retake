import express from "express";
import dotenv from "dotenv";
import Restaurants from "./models/restaurant.model.js";
import connectDB from "./db/connectDB.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

connectDB();

app.post("/create", async (req, res) => {
  try {
    const { name, location, cuisine, rating, menu } = req.body;

    const newrestaurant = new Restaurants({
      name,
      location,
      cuisine,
      rating,
      menu,
    });

    if (!name) {
      res.status(400).json({
        error: "Validation failed: name is required",
      });
    }
    if (!location) {
      res.status(400).json({
        error: "Validation failed: location is required",
      });
    }
    if (!cuisine) {
      res.status(400).json({
        error: "Validation failed: cuisine is required",
      });
    }
    if (!rating) {
      res.status(400).json({
        error: "Validation failed: rating is required",
      });
    }
    if (!menu) {
      res.status(400).json({
        error: "Validation failed: menu is required",
      });
    }

    await newrestaurant.save();

    res.status(201).json({
      success: true,
      message: "New Restaurant created successfully",
      restaurant: newrestaurant,
    });
  } catch (error) {
    console.log("Failed to create new restaurant", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
});

app.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurants.find();

    res.status(200).json({
      success: true,
      restaurantData: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const restaurant = await Restaurants.findById({ _id: id });

    if (!id) {
      res.status(400).json({
        error: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      restaurant: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, location, cuisine, rating, menu } = req.body;

    if (!id) {
      res.status(400).json({
        error: "Restaurant not found",
      });
    }

    const restaurant = await Restaurants.findByIdAndUpdate(
      { _id: id },
      { name, location, cuisine, rating, menu },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Restaurant updated :)",
      restaurant: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        error: "Restaurant not found",
      });
    }

    const restaurant = await Restaurants.findByIdAndDelete({ _id: id });

    res.status(200).json({
      message: "Restaurant deleted :)",
      restaurant: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
