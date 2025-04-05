interface Config {
  auth: {
    defaultCredentials: {
      username: string;
      password: string;
    };
    minPasswordLength: number;
  };
  features: {
    registration: boolean;
  };
}

const config: Config = {
  auth: {
    defaultCredentials: {
      username: import.meta.env.VITE_AUTH_USERNAME || 'admin',
      password: import.meta.env.VITE_AUTH_PASSWORD || 'admin'
    },
    minPasswordLength: parseInt(import.meta.env.VITE_MIN_PASSWORD_LENGTH || '6', 10)
  },
  features: {
    registration: import.meta.env.VITE_FEATURE_REGISTRATION === 'true'
  }
};

export default config; 
