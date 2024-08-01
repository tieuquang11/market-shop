import Env from '#start/env'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: Env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: Env.get('CLOUDINARY_API_KEY'),
  api_secret: Env.get('CLOUDINARY_API_SECRET'),
  secure: true,
})

export default cloudinary
