import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    connectMongoDB();
    if (true) {
      const users = await User.find();
      return Response.json(users);
    } else {
      return Response.json([]);
    }
  } catch (error) {
    console.log(error);
  }
}
