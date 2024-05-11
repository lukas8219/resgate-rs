import { mongoose } from '@typegoose/typegoose'
let conn: typeof mongoose;

export async function awaitConnection(){
    if(conn){
        return conn;
    }
    conn = await mongoose.connect('mongodb://localhost:27017');
    return conn;
}