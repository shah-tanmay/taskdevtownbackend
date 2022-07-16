const mongoose = require("mongoose");
const express = require("express");
const auth = require("../middleware/auth");
const Bill = require("../models/Bill");
const User = require("../models/User");

const router = express.Router();

router.post("/bill", auth, async (req, res) => {
  const bill = new Bill({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await bill.save();
    res.status(201).send(bill);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.get("/getBill", auth, async (req, res) => {
  try {
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? 1 : -1;
    }
    const skip = parseInt(req.query.skip);
    const id = req.user._id.toString();
    await req.user.populate("bills");
    const count = req.user.bills.length;
    await req.user.populate({
      path: "bills",
      options: {
        limit: 5,
        skip: skip,
        sort,
      },
    });
    res.status(200).json({ bills: req.user.bills, count: count, id: id });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

module.exports = router;
