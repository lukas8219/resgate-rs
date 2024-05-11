import { awaitConnection } from "../../../../database/connect"
import { PersonModel } from "../../../../database/models/Person";

export async function GET(request: Request) {
    await awaitConnection();
    const results = await PersonModel.find();
    return Response.json({
        response: results,
    })
}

export async function POST(request: Request){
    const model = await new PersonModel({
        ...await request.json()
    });

    return Response.json(model.toJSON());
}