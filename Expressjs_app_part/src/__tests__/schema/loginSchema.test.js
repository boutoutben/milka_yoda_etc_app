const loginSchema = require("../../schema/LoginSchema");
const emailTest = require("../../testComponent/emailTest");
const passwordTest = require("../../testComponent/passwordTest");

describe('loginSchema', () => {
    emailTest({
      email: "test@example.com",
      password: "Strong123!"
    }, loginSchema);
    passwordTest({
      email: "test@example.com",
      password: "Strong123!"
    }, loginSchema);
  });

  