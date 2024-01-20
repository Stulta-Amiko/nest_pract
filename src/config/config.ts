import { ConfigProps } from 'src/interfaces/config.interface';

export const config = (): ConfigProps => ({
  api: {
    apiUrl: process.env.API_URL,
    apiKey: process.env.API_KEY,
  },
});
