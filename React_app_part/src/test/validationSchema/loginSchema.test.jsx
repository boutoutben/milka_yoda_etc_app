import loginSchema from "../../validationSchema/LoginSchema";
import emailTest from "./component/emailTest";
import passwordTest from "./component/passwordTest";

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

  