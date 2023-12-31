// pages/api/resetPassword.js
import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();
    await connectMongoDB();
    console.log(email);
    const user = await User.findOne({
      email,
      resetToken: otp,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return Response.json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    return Response.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    return Response.json({
      success: false,
      message: "Error resetting password.",
    });
  }
}
