import logger from "@/app/utils/logger";
import { awaitConnection } from "@/database/connect"
import PersonModel, { PersonSituationEnum } from '@/database/models/Person';
import { mongoose } from "@typegoose/typegoose";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
    await awaitConnection();
    
    const urlParams = new URL(request.url).searchParams;

    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');
    const maxDistance = urlParams.get('maxDistance');

    if(!lat || !lng || !maxDistance){
        const results = await PersonModel.find({
            situation: {
                $ne: PersonSituationEnum.Rescued,
            },
        }).lean(true);
        return Response.json({ response: results });
    }

    const results = await PersonModel.find({
        situation: {
            $ne: PersonSituationEnum.Rescued
        },
        location: {
            $near: {
                $geometry: { type: 'Point', coordinates: [lng, lat] },
                $minDistance: 1,
                $maxDistance: Number(maxDistance) || 500,
            }
        }
    })
    .lean(true)
    .select(['_id', 'location', 'name', 'type', 'situation'])

    return Response.json({
        response: results.map((r) => {
            const [lat, lng]=r.location.coordinates;
            return {
                ...r,
                location: [lat, lng,],
            }
        }),
    })
}

export async function POST(request: NextRequest){
    await awaitConnection();
    const payload = await request.json();
    logger.info(`creating ${JSON.stringify(payload)} from ip ${request.ip}`);
    payload.location = {
        type: 'Point',
        coordinates: payload.location,
    }
    const model = await new PersonModel({...payload, _id: new mongoose.Types.ObjectId(), createFromIp: request.ip, }).save();
    return Response.json(model.toJSON());
}