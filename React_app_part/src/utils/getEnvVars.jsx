const getEnvVars = () => ({
    VITE_GMAIL_SERVICE_ID: import.meta.env.VITE_GMAIL_SERVICE_ID,
    VITE_GMAIL_AUTO_REPLY_MODELE_ID: import.meta.env.VITE_GMAIL_AUTO_REPLY_MODELE_ID,
    VITE_GMAILJS_PUBLIC_KEY: import.meta.env.VITE_GMAILJS_PUBLIC_KEY 
  });

  export default getEnvVars;