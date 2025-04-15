import bycrypt from 'bcrypt';


export const hashPassword = (password) => {
    const salt = bycrypt.genSaltSync(10);
    return bycrypt.hashSync(password, salt)
};