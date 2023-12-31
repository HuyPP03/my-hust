import { connectMongoDB } from "@/libs/mongodb";
import { Voucher } from "@/models/Voucher";

export async function POST(req) {
  try {
    connectMongoDB();
    const data = await req.json();
    const voucherDoc = await Voucher.create(data);
    return Response.json(voucherDoc);
  } catch (error) {
    console.log(error);
  }
}
export async function GET(req) {
  try {
    connectMongoDB();
    return Response.json(await Voucher.find());
  } catch (err) {
    return Response.json({ message: "An error." }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    connectMongoDB();
    const { _id, ...data } = await req.json();
    const voucherDoc = await Voucher.findByIdAndUpdate(_id, data);
    return Response.json(voucherDoc);
  } catch (error) {
    console.log(error);
  }
}
export async function DELETE(req) {
  try {
    connectMongoDB();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    await Voucher.deleteOne({ _id });
    return Response.json(true);
  } catch (error) {
    console.log(error);
    return Response.json({ message: "An error occurred." }, { status: 500 });
  }
}
