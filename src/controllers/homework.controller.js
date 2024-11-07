const Homework = require('../models/homework.model');
const Enrollment = require('../models/enrollment.model');

exports.submitHomework = async (req, res) => {
  try {
    const { courseId, title } = req.body;

    // Check if student is enrolled in the course
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      status: 'active'
    });

    if (!enrollment) {
      return res.status(403).json({ 
        message: 'You must be enrolled in the course to submit homework' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const homework = await Homework.create({
      student: req.user._id,
      course: courseId,
      title,
      fileUrl: req.file.path
    });

    res.status(201).json(homework);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getHomeworksByCourse = async (req, res) => {
  try {
    const homeworks = await Homework.find({ course: req.params.courseId })
      .populate('student', 'name email')
      .sort('-submissionDate');
    
    res.json(homeworks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};