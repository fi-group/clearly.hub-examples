import config from './config.json';

interface Config {
  api: {
    endpoint: string;
  }
  cognito: {
    userPoolId: string;
    userPoolClientId: string;
    loginWith: {
      oauth: {
        domain: string;
        scopes: string[];
        redirectSignIn: string[];
        redirectSignOut: string[];
        responseType: 'code' | 'token';
      }
    }
  }
}

export default config as Config;
