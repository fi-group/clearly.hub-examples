import config from './config.json'

interface Config {
  api: {
    endpoints: {
      openApi: string;
      graphql: string;
    }
  };
  components: {
    url: string;
    // public key to verify component results with; defaults to the Clearly.Hub key
    publicKeyUrl?: string;
  },
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

const typedConfig = config as Config;

// The authentication and components examples need the Client Id of your own app client.
// The example config contains a placeholder ("SEE: README.MD") instead.
export const isClientIdConfigured = (): boolean => {
  const clientId = typedConfig.cognito?.userPoolClientId;
  return !!clientId && !/readme/i.test(clientId);
};

export default typedConfig;
