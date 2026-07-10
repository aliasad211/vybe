import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async(to, otp)=>{
    try {
  const info = await transporter.sendMail({
    from:process.env.EMAIL,
    to: to, 
    subject: "Reset Your Password",
    text: "Hello world?", // plain text body
    html: `<p>Your OTP for Password reset is <b>${otp}</b>.
    It expires in 5 minutes.
    </p>`
  });
} catch (err) {
  console.error("Error while sending mail:", err);
}
}

export default sendMail;