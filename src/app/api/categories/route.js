import { connectMongoDB } from "@/libs/mongodb";
import { Category } from "@/models/Category";

export async function POST(req) {
  try {
    connectMongoDB();
    const data = await req.json();
    const categoryDoc = await Category.create(data);
    return Response.json(categoryDoc);
  } catch (err) {
    return Response.json({ message: "An error." }, { status: 500 });
  }
}
export async function PUT(req) {
  try {
    connectMongoDB();
    const { _id, name } = await req.json();
    await Category.updateOne({ _id }, { name });
    return Response.json(true);
  } catch (err) {
    return Response.json({ message: "An error." }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    connectMongoDB();
    return Response.json(await Category.find());
  } catch (err) {
    return Response.json({ message: "An error." }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    connectMongoDB();
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    await Category.deleteOne({ _id });
    return Response.json(true);
  } catch (err) {
    return Response.json({ message: "An error." }, { status: 500 });
  }
}
