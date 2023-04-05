import { validate } from "class-validator";

export async function validation(data: Object): Promise<null | object>{
    const errors = await validate(data);
    if(errors.length > 0){
        console.log(errors);
        const keys = errors.map(error => error.property);
        const values = errors.map(({constraints}) => Object.values(constraints!));
        const message = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
        return message;
    }
    return null;
}