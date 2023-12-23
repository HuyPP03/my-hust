import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;
        try {
          await connectMongoDB();
          const user = await User.findOne({ email });
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null;
          return user;
        } catch (error) {}
      },
    }),
    // EmailProvider({
    //   server: {
    //     host: "smtp.gmail.com", // Địa chỉ máy chủ SMTP của Gmail
    //     port: 587, // Cổng Gmail thường sử dụng cho TLS
    //     auth: {
    //       user: process.env.GMAIL_USER, // Tên người dùng Gmail của bạn
    //       pass: process.env.GMAIL_PASSWORD, // Mật khẩu Gmail của bạn
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  // callbacks: {
  //   async forgotPassword(email) {
  //     console.log(email);
  //     const user = await User.findOne({ email });

  //     if (user) {
  //       const token = randomBytes(32).toString("hex");

  //       await User.updateOne(
  //         { email },
  //         {
  //           $set: {
  //             resetToken: token,
  //             resetTokenExpires: Date.now() + 3600000, // 1 hour
  //           },
  //         }
  //       );

  //       const transporter = nodemailer.createTransport({
  //         // Set up your email transport configuration
  //       });

  //       await transporter.sendMail({
  //         to: email,
  //         subject: "Password Reset",
  //         html: `<p>You requested a password reset. Click <a href="${process.env.NEXTAUTH_URL}/resetpassword?token=${token}">here</a> to reset your password.</p>`,
  //       });
  //     }

  //     return null;
  //   },
  //   async resetPassword(credentials) {
  //     const { token, password, confirmPassword } = credentials;
  //     if (password !== confirmPassword) return null;

  //     const user = await User.findOne({
  //       resetToken: token,
  //       resetTokenExpires: { $gt: Date.now() },
  //     });

  //     if (user) {
  //       const hashedPassword = await bcrypt.hash(password, 10);
  //       await User.updateOne(
  //         { _id: user._id },
  //         {
  //           $set: {
  //             password: hashedPassword,
  //             resetToken: undefined,
  //             resetTokenExpires: undefined,
  //           },
  //         }
  //       );

  //       return true;
  //     }

  //     return null;
  //   },
  // },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
