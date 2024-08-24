import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'



const uploadToCloudinery = async (localfilePath) => {
    cloudinary.config({
        cloud_name: process.env.cloudinery_cloud_name,
        api_key: process.env.cloudinery_api_key,
        api_secret: process.env.cloudinery_api_secret
    })
    console.log(process.env.cloudinery_api_key);

    try {
        if (!localfilePath) {
            return null
        }
        const uploadResult = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localfilePath)
        return uploadResult.url;
    } catch (error) {
        console.log(`error while uploading image`, error.message);
    }
}
export default uploadToCloudinery