import { awaitConnection } from "@/database/connect"
import PersonModel from '@/database/models/Person';
import { URLSearchParams } from "url";

export async function GET(request: Request) {
    await awaitConnection();
    
    const urlParams = new URL(request.url).searchParams;

    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');
    const maxDistance = urlParams.get('maxDistance');

    if(!lat || !lng || !maxDistance){
        const results = await PersonModel.find().lean(true);
        return Response.json({ response: results });
    }

    const results = await PersonModel.find({
        location: {
            $near: {
                $geometry: { type: 'Point', coordinates: [lng, lat] },
                $minDistance: 1,
                $maxDistance: Number(maxDistance) || 500,
            }
        }
    }).lean(true);

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

export async function POST(request: Request){
    await awaitConnection();
    const payload = await request.json();
    payload.location = {
        type: 'Point',
        coordinates: payload.location,
    }
    const model = await new PersonModel(payload).save();
    return Response.json(model.toJSON());
}