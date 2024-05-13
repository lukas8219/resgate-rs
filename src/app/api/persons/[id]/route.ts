import logger from "@/app/utils/logger";
import { awaitConnection } from "@/database/connect";
import PersonModel from "@/database/models/Person";
import { mongoose } from "@typegoose/typegoose";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, extra: { params: { id: string } }){
    await awaitConnection();
    const ip = request.headers.get('x-forwarded-for');
    logger.info(`updating ${extra.params.id} to rescued from ip ${ip}`);
    const payload = await request.json();
    delete payload.createFromIp;
    const result = await PersonModel.findOneAndUpdate(new mongoose.Types.ObjectId(extra.params.id), {...payload, rescuedFromIp: ip }, { lean: true, returnDocument: 'after' });
    if(!result){
        return notFound();
    }
    return Response.json(result);
}