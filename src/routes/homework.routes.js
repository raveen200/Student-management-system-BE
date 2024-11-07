const express = require('express');
const homeworkController = require('../controllers/homework.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/homework:
 *   post:
 *     summary: Submit homework
 *     tags: [Homework]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *               title:
 *                 type: string
 *               homework:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Homework submitted successfully
 *       400:
 *         description: Invalid request or missing file
 *       403:
 *         description: Not enrolled in course
 */
router.post('/',
  protect,
  authorize('student'),
  upload.single('homework'),
  homeworkController.submitHomework
);

/**
 * @swagger
 * /api/homework/course/{courseId}:
 *   get:
 *     summary: Get all homework submissions for a course
 *     tags: [Homework]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of homework submissions
 */
router.get('/course/:courseId',
  protect,
  homeworkController.getHomeworksByCourse
);

module.exports = router;