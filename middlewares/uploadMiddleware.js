import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/image/'); // Ảnh sẽ được lưu vào thư mục uploads/ ở gốc dự án
  },
  filename: (req, file, cb) => {
    // Đặt tên file: Thời_gian_hiện_tại + đuôi_mở_rộng 
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Bộ lọc chỉ chấp nhận file ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } 
});

export default upload;