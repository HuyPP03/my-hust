import nodemailer from "nodemailer";
import qrcode from "qrcode";
import axios from "axios";

export async function POST(req) {
  try {
    const { id, email } = await req.json();
    console.log(id);
    const qrCodeImage = await qrcode.toDataURL(JSON.stringify(id));
    console.log(qrCodeImage);
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
      subject: "Your QRcode: ",
      html: `
        <p>Your HTML content with QR code here:</p>
        <div style="display: inline-block; background: url(${qrCodeImage}) no-repeat; width: 200px; height: 200px;"></div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
    return Response.json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return Response.json({
      success: false,
      message: "Error sending email.",
    });
  }
}
