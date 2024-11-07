const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Homework', homeworkSchema);