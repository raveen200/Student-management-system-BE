const express = require('express');
const enrollmentController = require('../controllers/enrollment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully enrolled in course
 *       400:
 *         description: Already enrolled or course is full
 *       404:
 *         description: Course not found
 */
router.post('/',
  protect,
  authorize('student'),
  enrollmentController.enrollCourse
);

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Get user's enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's enrollments
 */
router.get('/',
  protect,
  enrollmentController.getEnrollments
);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   patch:
 *     summary: Update enrollment status
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, completed, dropped]
 *     responses:
 *       200:
 *         description: Enrollment status updated
 *       404:
 *         description: Enrollment not found
 */
router.patch('/:id',
  protect,
  authorize('student'),
  enrollmentController.updateEnrollmentStatus
);

module.exports = router;