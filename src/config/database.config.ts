import { MongooseModuleOptions } from "@nestjs/mongoose";

function buildUriFromParts(): string {
  const host =
    process.env.MONGODB_HOST || process.env.MONGODB_SERVICE_HOST || "mongodb";
  const port = process.env.MONGODB_PORT || "27017";
  const dbName = process.env.MONGODB_DB_NAME || "kraud_dev";
  const user = process.env.MONGODB_USER;
  const pass = process.env.MONGODB_PASSWORD;

  if (user && pass) {
    const u = encodeURIComponent(user);
    const p = encodeURIComponent(pass);
    return `mongodb://${u}:${p}@${host}:${port}/${dbName}?authSource=admin`;
  }

  return `mongodb://${host}:${port}/${dbName}`;
}

export const getDatabaseConfig = (): MongooseModuleOptions => {
  const raw = process.env.MONGODB_URI || "";

  // If a full URI is provided (including mongodb+srv), use it directly
  const mongoUri =
    raw && raw.trim().length > 0 ? raw.trim() : buildUriFromParts();

  const retryAttempts = Number(process.env.DB_RETRY_ATTEMPTS || "5");
  const retryDelay = Number(process.env.DB_RETRY_DELAY || "1000");

  return {
    uri: mongoUri,
    retryAttempts,
    retryDelay,
    // keep default connection options; explicit options are not required for mongoose v7+
  } as MongooseModuleOptions;
};
