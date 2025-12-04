const { overrideDevServer } = require('customize-cra');

const devServerConfig = () => (config) => {
  // Fix for CRA v5 & Webpack Dev Server 4 issue
  config.allowedHosts = ['localhost', '127.0.0.1', '0.0.0.0'];  // allow specific hosts
  return config;
};

module.exports = {
  devServer: overrideDevServer(devServerConfig())
};