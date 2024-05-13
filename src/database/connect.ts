import { mongoose } from '@typegoose/typegoose'
import logger from '@/app/utils/logger';
let conn: typeof mongoose;

mongoose.set('debug', process.env.NODE_ENV !== 'production');

mongoose.connection.on('error', () => setTimeout(awaitConnection, 5000));
mongoose.connection.once('connected', () => logger.info(`connected sucessfully to ${new URL(process.env.MONGODB_URL as string).hostname}`));
awaitConnection();

export async function awaitConnection(){
    try {
        if(conn){
            return await conn;
        }
        logger.debug(`connect# connecting with mongouri ${process.env.MONGODB_URL}`);
        conn = await mongoose.connect(process.env.MONGODB_URL as string);
        return conn;
    } catch(err){
        logger.error(err);
        logger.info('trying to connect in 5 seconds');
    }
}