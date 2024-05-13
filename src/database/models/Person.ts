import { index, prop, getModelForClass, mongoose, modelOptions, Prop } from "@typegoose/typegoose";

export interface PersonLocation {
    latitude: number;
    longitude: number;
}

export enum PersonTypeEnum {
    Male = 'male',
    Female = 'female',
    Child = 'child',
    Animal = 'animal',
}

export enum PersonSituationEnum {
    WaitingRescue = 'waiting-rescue',
    WaitingRescueSevere = 'waiting-rescue-severe',
    Rescued = 'rescued'
}

function validateLocation(locations: GeoJsonLocation){
    if(locations.coordinates.length !== 2){
        return false;
    }
    const [lat,long]=locations.coordinates;
    if(!lat){
        return false;
    }
    if(!long){
        return false;
    }
    return true;
}

const locationValidator = {
    validator: validateLocation,
    message: 'LatLgn are wrong'
}

export class GeoJsonLocation {
    @prop({ required: true })
    type!: String;
    @prop({ required: true })
    coordinates!: [number,number]
}

@index({ location: '2dsphere' }, {})
@modelOptions({ schemaOptions: { collection: 'persons' }})
class Person {

    @prop()
    public _id!: mongoose.Types.ObjectId;

    @prop({ required: true })
    public name!: string;

    @prop({ required: true })
    public type!: PersonTypeEnum;

    @prop({ required: false })
    public extraInfo!: string;

    @prop({ required: true })
    public situation!: PersonSituationEnum;

    @prop({ required: true, validate: locationValidator })
    public location!: GeoJsonLocation

    @prop()
    createdFromIp?: string;

    @prop()
    rescuedFromIp?: string;
}

const PersonModel = mongoose.models.Person || getModelForClass(Person);

export default PersonModel;