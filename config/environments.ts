import urls from './urls.json' with { type: 'json' };
 
export const env = {
  baseURL: process.env.BASE_URL || urls.baseURL,
  paths: urls.paths,
};