// pages/api/forgotPassword.js
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import User from "@/models/User";
import { connectMongoDB } from "@/libs/mongodb";

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectMongoDB();
    const user = await User.findOne({ email });
    console.log(email);
    if (!user) {
      return Response.json({ success: false, message: "User not found." });
    }

    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

    await User.updateOne(
      { email },
      { $set: { resetToken: otp, resetTokenExpires: otpExpiration } }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Reset password email sent:", info.response);
    return Response.json({
      success: true,
      message: "Reset password OTP sent successfully.",
    });
  } catch (error) {
    console.error("Error sending reset password OTP email:", error.message);
    return Response.json({
      success: false,
      message: "Error sending reset password OTP email.",
    });
  }
}

function generateOTP() {
  return randomBytes(3).toString("hex").toUpperCase();
}
