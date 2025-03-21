import { createRequire } from 'module';
import admin from "firebase-admin";
import dotenv from 'dotenv';

dotenv.config();

const require = createRequire(import.meta.url);
const serviceAccount = require('../../credenciaisFirebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;
