export default () => ({
  bcrypt: {
    salt: process.env.SALT_ROUNDS,
  },
  jwt: {
    access_secret: process.env.ACCESS_JWT_SECRET,
    access_expiresIn: process.env.ACCESS_EXPIRES_IN,
    refresh_secret: process.env.REFRESH_JWT_SECRET,
    refresh_expiresIn: process.env.REFRESH_EXPIRES_IN,
    reset_password_secret: process.env.RESET_PASSWORD_JWT_SECRET,
    reset_password_expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN,
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
