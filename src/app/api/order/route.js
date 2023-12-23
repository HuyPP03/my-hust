import { connectMongoDB } from "@/libs/mongodb";
import { Order } from "@/models/Order";

export async function POST(req) {
  try {
    connectMongoDB();
    const data = await req.json();
    const orderDoc = await Order.create(data);
    return Response.json(orderDoc);
  } catch (error) {
    console.log(error);
  }
}
export async function GET(req) {
  try {
    connectMongoDB();
    return Response.json(await Order.find());
  } catch (err) {
    return Response.json({ message: "An error." }, { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    connectMongoDB();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    await Order.deleteOne({ _id });
    return Response.json(true);
  } catch (error) {
    console.log(error);
    return Response.json({ message: "An error occurred." }, { status: 500 });
  }
}
