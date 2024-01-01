import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const data = await req.json();
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
      to: process.env.EMAIL_USER,
      subject: `Contact by ${data.email}`,
      html: `
        <p>Name: ${data.firstName + " " + data.lastName}</p>
        <p>Email: ${data.email}</p>
        <p>Address: ${data.address}</p>
        <p>Phone number: ${data.phoneNumber}</p>
        <p>Message: ${data.message}</p>
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
