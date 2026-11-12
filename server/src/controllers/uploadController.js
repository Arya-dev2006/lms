import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env.js';

export async function uploadAsset(request, response, next) {
  try {
    if (!request.file) return response.status(400).json({ success: false, message: 'A file is required' });
    const { cloudName, apiKey, apiSecret } = config.cloudinary;
    if (!cloudName || !apiKey || !apiSecret) {
      return response.status(503).json({ success: false, message: 'Cloudinary upload is not configured on the server' });
    }
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
    const resourceType = request.file.mimetype.startsWith('video/') ? 'video' : 'auto';
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder: 'learnsphere' },
        (error, uploaded) => (error ? reject(error) : resolve(uploaded)),
      );
      stream.end(request.file.buffer);
    });
    return response.status(201).json({ success: true, asset: { url: result.secure_url, publicId: result.public_id, resourceType: result.resource_type } });
  } catch (error) { return next(error); }
}
