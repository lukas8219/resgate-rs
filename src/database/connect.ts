import { mongoose } from '@typegoose/typegoose'
let conn: typeof mongoose;

export async function awaitConnection(){
    if(conn){
        return conn;
    }
    conn = await mongoose.connect(process.env.MONGODB_URL as string);
    return conn;
}