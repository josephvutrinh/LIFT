require('dotenv').config({ path: './.env' }); 

export default ({ config }) => {
  return {
    ...config,
    web: {
      bundler: "metro"
    },
    extra: {
      API_BASE_URL: process.env.API_BASE_URL, 
    }
  };
};