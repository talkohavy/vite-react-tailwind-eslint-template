function makeAxiosConfigSerializable(config) {
  const newConfig = { ...config };
  newConfig.env = null; // <--- non-serializable!
  newConfig.headers = { ...newConfig.headers }; // <--- non-serializable!
  newConfig.transformRequest = null; // <--- non-serializable!
  newConfig.transformResponse = null; // <--- non-serializable!
  newConfig.validateStatus = null; // <--- non-serializable!

  return newConfig;
}

export { makeAxiosConfigSerializable };
