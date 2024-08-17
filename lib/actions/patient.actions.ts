"use server";

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
const BUCKET_ID = process.env.NEXT_PUBLIC_BUCKET_ID;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const PATIENT_COLLECTION_ID = process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID;
import { ID, Query } from "node-appwrite"
import { databases, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils";

import {InputFile} from 'node-appwrite/file'


export const createUser = async (user: CreateUserParams) => {

    try {
        const newuser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
          );
          return parseStringify(newuser);
        
        
    } catch (error: any) {
        
        if(error && error?.code == 409){
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])

            return documents?.users[0]
        }
        console.log(error)
    }
}

export const getUser = async (userId: string) => {
    try {
      const user = await users.get(userId);
			
			return parseStringify(user);
    } catch (error) {
      console.log(error)
    }
}


export const registerPatient = async ({identificationDocument, ...patient} : RegisterUserParams) => {
    try {
      let file;
      if(identificationDocument){
        const inputFile = InputFile.fromBuffer(
          identificationDocument?.get('blobFile') as Blob,
          identificationDocument.get('fileName') as string
        );
      file = await storage.createFile(process.env.NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile)
      }

      const newPatient = await databases.createDocument(process.env.NEXT_PUBLIC_DATABASE_ID!,process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID!,ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient
      })
      
      return parseStringify(newPatient);
    } catch (error) {
      console.log(error)
    }
}

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    );
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(error)
  }
}