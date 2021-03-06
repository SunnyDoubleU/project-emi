const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String
  },
  category: {
    type: String
  },
  description: {
    type: String
  },
  quotes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "quote"
    }
  ],
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "customer"
  },
  date: {
    type: String
  },
  location: {
    type: String
  }
});

const Project = mongoose.model("project", projectSchema);

module.exports = Project;
