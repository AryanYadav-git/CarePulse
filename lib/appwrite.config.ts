import * as sdk from 'node-appwrite'

// export const {
//   NEXT_PUBLIC_PROJECT_ID, NEXT_PUBLIC_API_KEY, DATABASE_ID, DOCTOR_COLLECTION_ID, PATIENT_COLLECTION_ID, APPOINTMENT_COLLECTION_ID, NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
//   NEXT_PUBLIC_ENDPOINT
// } = process.env;

const client = new sdk.Client();

client.setEndpoint('https://cloud.appwrite.io/v1').setProject(process.env.NEXT_PUBLIC_PROJECT_ID!).setKey(process.env.NEXT_PUBLIC_API_KEY!);


export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);