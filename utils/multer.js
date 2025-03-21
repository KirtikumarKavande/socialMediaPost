const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './temp');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };
  
  const upload = multer({ 
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5 
    },
    fileFilter: fileFilter
  });
  

  module.exports = upload;