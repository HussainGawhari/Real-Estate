import express from 'express';
import  mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO).then( () => {
    console.log('connect success');
    }).catch( () => {
        console.log(err);
    });

const app = express();
app.listen(3000,() => {
console.log('listening on port 3000');
});