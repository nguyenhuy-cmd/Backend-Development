import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Email của bạn (đã cấu hình ở .env)
        pass: process.env.EMAIL_PASS  // Mật khẩu ứng dụng 16 số (đã cấu hình ở .env)
      }
    });

    await transporter.sendMail({
      from: `Trung Tâm Hỗ Trợ <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text
    });
    
    console.log("Đã gửi email thành công tới:", to);
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    throw new Error('Không thể gửi email xác thực');
  }
};