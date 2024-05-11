import { Prop, index, prop, getModelForClass } from "@typegoose/typegoose";

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

@index({ location: '2dsphere' }, {})
class Person {

    @prop({ required: true })
    public name!: string;

    @prop({ required: true })
    public type!: PersonTypeEnum;

    @prop({ required: false })
    public extraInfo!: string;

    @prop({ required: true })
    public situation!: PersonSituationEnum;

    @prop({ required: true })
    public location!: [number]

}

export const PersonModel = getModelForClass(Person);