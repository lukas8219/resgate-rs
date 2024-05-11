import { mongoose } from '@typegoose/typegoose'

let isConnected = false;
let conn: typeof mongoose;

export async function awaitConnection(){
    if(isConnected){
        return conn;
    }
    conn = await mongoose.connect('mongodb://localhost:27017');
    isConnected = true;
    return conn;
}