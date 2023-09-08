import mongoose from 'mongoose';
import { DATABASE } from '../config/keys';

const connect = async (): Promise<void> => {
    await mongoose.connect(DATABASE, {});
    console.log('Database Connected Successfully...');
};

export default connect;
