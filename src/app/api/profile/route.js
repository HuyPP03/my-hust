import { connectMongoDB } from "@/libs/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";

export async function PUT(req) {
  connectMongoDB();
  const data = await req.json();
  const { _id, ...user } = data;
  let filter = {};
  if (_id) {
    filter = { _id };
  } else {
    const session = await getServerSession(authOptions);
    const email = session.user.email;
    filter = { email };
  }
  await User.updateOne(filter, user);
  return Response.json(true);
}
export async function GET(req) {
  connectMongoDB();

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  if (_id) {
    return Response.json(await User.findOne({ _id }));
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) Response.json({});
    return Response.json(await User.findOne({ email }));
  }
}
