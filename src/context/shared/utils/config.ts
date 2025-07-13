import 'dotenv/config';

const env = (key: string) => {
  return process.env[key];
};

export const config = {
  port: env('PORT') ?? 3000,
};
