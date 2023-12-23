import { connectMongoDB } from "@/libs/mongodb";
import { Comment } from "@/models/Comment";

export async function POST(req) {
  try {
    connectMongoDB();
    const data = await req.json();
    const commentDoc = await Comment.create(data);
    return Response.json(commentDoc);
  } catch (error) {
    console.log(error);
  }
}
export async function GET(req) {
  try {
    connectMongoDB();
    return Response.json(await Comment.find());
  } catch (err) {
    return Response.json({ message: "An error." }, { status: 500 });
  }
}
