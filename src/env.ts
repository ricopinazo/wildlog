function required(name: string) {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

required("BETTER_AUTH_SECRET"); // openssl rand -base64 32

export const DATABASE_URL = required("DATABASE_URL");

export const SERVER_DOMAIN = required("SERVER_DOMAIN");
