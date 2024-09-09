/** @type {import('next').NextConfig} */
const config = {
  env:{
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    KAKAO_RESTAPI_KEY: process.env.KAKAO_RESTAPI_KEY
  }
};

export default config;
