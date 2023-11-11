//This File is used to create post,updatePost and etc..

import conf from "../conf/conf";
import {Client,ID, Databases, Storage, Query} from "appwrite";

export class Service{
 client = new Client();
 databases; //client databases and bucket are variables
 bucket; //bucket means storage

 //no need to define type of variables and methods in class => Study why is it so?
 constructor(){
    this.client
    .setEndpoint(conf.appWriteUrl)
    .setProject(conf.appWriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
    
 }
 // All these things are available in appwrite documentation
 async createPost(title,slug,content,featuredImage,status,userId){
        try {
            //To know what are the parameters to be passed in createDocument refer appwrite documentation
           return await this.databases.createDocument(
            conf.appWriteDatabaseId,
            conf.appWriteCollectionId,
            slug,
            {
                title,
                content,
                featuredImage,
                status,
                userId,
            },
           
           )
            }
            
         catch (error) {
            throw error;
        }
 }

 async updatePost(slug,{title,content,featuredImage,status}){
    try {
        return await this.databases.updateDocument(
            conf.appWriteDatabaseId,
            conf.appWriteCollectionId,
            slug,
            {
                title,
                content,
                featuredImage,
                status,
            },
        )
        
    } catch (error) {
        throw error;
    }
 }

 async deletePost(slug){
        try {
             await this.databases.deleteDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                slug,
            )
            return true
        } catch (error) {
            return false;    
        }
 }
//getPost get single post
 async getPost(slug){
     try {
        return await this.databases.getDocument(conf.appWriteDatabaseId,
            conf.appWriteCollectionId,
            slug)
     } catch (error) {
        console.log("Error", error);
        return false;
     }
 }
 //get posts used to get all the uploaded posts which are active
 //Query is used to select those things that are equal for example we are getting posts such that there status to be active
 //we can use query only if we have created index in appwrite
    async getPosts(queries = [Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(conf.appWriteBucketId,
                conf.appWriteCollectionId,
                queries,
                )
        } catch (error) {
            console.log("Error", error);
            return false;
        }
    }
//uploadFile used to upload the image and we get file as the parameter and this parameter is passed to createPost=>featuredImage 
    async uploadFile(file){
        try{
            //below return will return the ID wich will be passed as the parameter in the createPost as featuredImage
            return await this.bucket.createFile(
                conf.appWriteBucketId,
                ID.unique(),
                file
            )
        }
        catch(error){
            console(error);
            return false;
        }
    }
    //deleteFile used to delete the image

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(conf.appWriteBucketId,fileId);
            return true;
            
        } catch (error) {
            console.log(error);
            return false;
            
        }

    }
//Note: if the return is promise use the async and await


//getFilePreview Id is used to see the image as the small image in the home
getFilePreview(fileId){
    return this.bucket.getFilePreview(
        conf.appWriteBucketId,
        fileId
    )
}


}
const service = new Service();
export default service;