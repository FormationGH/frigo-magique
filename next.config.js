const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    env: {
      MONGODB_DATABASE: process.env.MONGODB_DATABASE,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
  };
};
