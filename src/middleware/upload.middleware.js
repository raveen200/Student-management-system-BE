const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (file.fieldname === 'profilePicture') {
      uploadPath += 'profiles/';
    } else if (file.fieldname === 'homework') {
      uploadPath += 'homework/';
    }
    else if (file.fieldname === 'coverPicture') {
      uploadPath += 'coverPicture/';
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = {
    profilePicture: ['jpg', 'jpeg', 'png'],
    coverPicture: ['jpg', 'jpeg', 'png'],
    homework: ['pdf', 'doc', 'docx']
  };

  const fieldname = file.fieldname;
  const extension = file.originalname.split('.').pop().toLowerCase();

  if (allowedExtensions[fieldname] && allowedExtensions[fieldname].includes(extension)) {
    cb(null, true);
  } else {
    const allowedFormats = allowedExtensions[fieldname].join(', ');
    const errorMessage = `Please upload a file with one of the following formats: ${allowedFormats}`;
    cb(new Error(errorMessage), false);
  }
};

exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})
