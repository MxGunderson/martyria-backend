const { Testimony, validate } = require("../models/testimony");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// get all testimonies
router.get("/", async (req, res) => {
  const testimonies = await Testimony.find().sort("title");
  res.send(testimonies);
});

// add a new testimony
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let testimony = new Testimony({
    title: req.body.title,
    story: req.body.story,
    author: req.body.author
  });
  testimony = await testimony.save();

  res.send(testimony);
});

// update a testimony
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const testimony = await Testimony.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      story: req.body.story,
      author: req.body.author
    },
    { new: true }
  );

  if (!testimony)
    return res
      .status(404)
      .send("The testimony with the given ID was not found");

  res.send(testimony);
});

// delete a testimony
router.delete("/:id", async (req, res) => {
  const testimony = await Testimony.findByIdAndRemove(req.params.id);

  if (!testimony)
    return res
      .status(404)
      .send("The testimony with the given ID was not found");

  res.send(testimony);
});

// get a single testimony
router.get("/:id", async (req, res) => {
  const testimony = await Testimony.findById(req.params.id);

  if (!testimony)
    return res
      .status(404)
      .send("The testimony with the given ID was not found");

  res.send(testimony);
});

module.exports = router;
