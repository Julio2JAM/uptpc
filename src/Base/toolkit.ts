import { validate } from "class-validator";

export async function validation(data: Object): Promise<null | object>{
    const errors = await validate(data);

    if(errors.length > 0){
        console.log(errors);
        return  Object.fromEntries(errors.map(value => [value.property, Object.values(value.constraints!)]));
    }

    return null;
}

import bcrypt from 'bcryptjs';

export async function  hashPassword (password: string){
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function matchPassword (password: string, hashedPassword: string){
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}