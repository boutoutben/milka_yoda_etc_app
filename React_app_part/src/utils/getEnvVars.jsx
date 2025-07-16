const getEnvVars = () => ({
    GMAIL_SERVICE_ID: import.meta.env.GMAIL_SERVICE_ID,
    GMAIL_AUTO_REPLY_MODELE_ID: import.meta.env.GMAIL_AUTO_REPLY_MODELE_ID,
    GMAILJS_PUBLIC_KEY: import.meta.env.GMAILJS_PUBLIC_KEY 
  });

  export default getEnvVars;