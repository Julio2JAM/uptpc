import { validate } from "class-validator";

export async function validation(data: Object): Promise<null | object>{
    const errors = await validate(data);

    if(errors.length > 0){
        console.log(errors);
        return  Object.fromEntries(errors.map(value => [value.property, Object.values(value.constraints!)]));
    }

    return null;
}

/**
 * Explanation, [Foreach funciona solo con arrays, 
 * por lo tanto, al ser un objeto, se obtienen las keys del objeto, 
 * con object.keys(), que retorna un arrays con las keys, 
 * y a esa array se le itera, para eliminar los valores falsy del objeto]
 * @param object object to remove falsy values
 * @returns object with values removed
 */
export function removeFalsyFromObject(object: any){

    Object.keys(object).forEach(key => {

        if(object[key] && typeof object[key] === 'object'){
            removeFalsyFromObject(object[key]);
        }

        if(!object[key] && object[key] !== 0){
            delete object[key];
        }

    });

    return object;
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