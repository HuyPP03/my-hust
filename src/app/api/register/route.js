import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    await User.create({
      name,
      email,
      password: hashedPassword,
      image: "/user_icon.png",
      admin: false,
    });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (err) {
    return NextResponse({ message: "An error." }, { status: 500 });
  }
}
