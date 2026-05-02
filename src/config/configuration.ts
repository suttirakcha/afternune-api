export default () => ({
  bcrypt: {
    salt: process.env.SALT_ROUNDS,
  },
  jwt: {
    secret: process.env.ACCESS_JWT_SECRET,
    expiresIn: process.env.ACCESS_EXPIRES_IN,
  },
  database: {
    connectionString: process.env.MONGODB_URI,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    upload_preset: process.env.UPLOAD_PRESET,
  },
});
