exports.getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.BASE_URL_DEV;
  } else if (process.env.NODE_ENV === 'production') {
    return process.env.BASE_URL_PROD;
  }
};
