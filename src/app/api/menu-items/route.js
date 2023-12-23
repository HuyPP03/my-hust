import { connectMongoDB } from "@/libs/mongodb";
import { MenuItem } from "@/models/MenuItem";

export async function POST(req) {
  try {
    connectMongoDB();
    const data = await req.json();
    const menuItemDoc = await MenuItem.create(data);
    return Response.json(menuItemDoc);
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(req) {
  try {
    connectMongoDB();
    const { _id, ...data } = await req.json();
    const menuItemDoc = await MenuItem.findByIdAndUpdate(_id, data);
    return Response.json(menuItemDoc);
  } catch (error) {
    console.log(error);
  }
}

export async function GET(req) {
  try {
    connectMongoDB();
    return Response.json(await MenuItem.find());
  } catch (err) {
    return Response.json({ message: "An error." }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    connectMongoDB();
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    await MenuItem.deleteOne({ _id });
    return Response.json(true);
  } catch (err) {
    return Response.json({ message: "An error." }, { status: 500 });
  }
}
