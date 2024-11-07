const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    console.log(`courseId`, courseId);
    const courseIds = Array.isArray(courseId) ? courseId : [courseId];
    const enrollments = [];

    for (const id of courseIds) {
      const course = await Course.findById(id);

      if (!course) {
        return res.status(404).json({ message: `Course not found: ${id}` });
      }

      // Check if student is already enrolled
      const existingEnrollment = await Enrollment.findOne({
        student: req.user._id,
        course: id
      });

      if (existingEnrollment) {
        return res.status(400).json({ message: `Already enrolled in course: ${id}` });
      }

      // Check course capacity
      if (course.enrolledStudents.length >= course.capacity) {
        return res.status(400).json({ message: `Course is full: ${id}` });
      }

      // Create enrollment
      const enrollment = await Enrollment.create({
        student: req.user._id,
        course: id,
        status: 'active'
      });

      // Add student to course's enrolled students
      await Course.findByIdAndUpdate(id, {
        $addToSet: { enrolledStudents: req.user._id }
      });

      enrollments.push(enrollment);
    }

    res.status(201).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title description')
      .sort('-enrollmentDate');
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this enrollment' });
    }

    enrollment.status = status;
    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};