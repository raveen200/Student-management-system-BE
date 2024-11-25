# Student Management System

A comprehensive MERN stack application designed to manage students, teachers, and courses effectively. The system enables user registration, course enrollment, and optional homework submission, streamlining academic processes.

---

## Features

### 1. **User Registration**
- Students, teachers, and courses can register with the following basic information:
  - Name
  - Email
  - Password
- Students and teachers can upload a profile picture during registration.

### 2. **Course Enrollment**
- Students can enroll in available courses.
- Each course is assigned to a specific teacher.

### 3. **Homework Submission**
- Students can upload homework for the courses they are enrolled in.
- Homework submissions are associated with the respective course and student.

---

## Tech Stack

### **Frontend**
- **React**: For building a responsive and interactive user interface.
- **MUI**: For modern, material-design-inspired components.
- **React Hook Form**: For efficient form handling and validations.
- **Redux**: For managing application state.

### **Backend**
- **Node.js**: For server-side logic.
- **Express.js**: For building the API.
- **Multer**: For handling file uploads (profile pictures and homework).

### **Database**
- **MongoDB**: For storing user, course, and homework data.

### **Authentication**
- **JWT (JSON Web Tokens)**: For secure authentication.
- **bcrypt**: For password hashing.

---
