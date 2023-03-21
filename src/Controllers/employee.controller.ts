import { validate } from "class-validator";
import { Request, Response } from "express";
import { Employee, EmployeeModel } from "../Models/employee.model";

export class EmployeeController{
    async get(_req:Request, res: Response):Promise<Response>{
        try {
            const employeeModel = new EmployeeModel();
            const employee = await employeeModel.get(Employee);

            if(!employee){
                console.log("no data found for employee");
                return res.status(404).send({"message":"No employee found", "status":404})
            }

            return res.status(200).json(employee);
        } catch (err) {
            console.log(err);
            return res.status(500).send({"message":"Something went wrong", "status":500});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {
            const { id } = req.params;

            if(!id){
                return res.status(400).send({ message:"id is required", "status":400});
            }

            if(typeof id !== "number"){
                return res.status(400).send({ message:"The id is not a number"});
            }

            const employeeModel = new EmployeeModel();
            const employee = employeeModel.getById(Employee,id);

            return res.status(200).json(employee);
        } catch (err) {
            console.log(err);
            return res.status(500).send({"message":"Something went wrong", "status":500});
        }
    }

    async post(req: Request, res: Response):Promise<Response>{
        try {
            const dataEmployee = new Map(Object.entries(req.body));
            const newEmployee = new Employee(dataEmployee);

            const errors = await validate(newEmployee);
            if(errors.length > 0){
                console.log("Invalid data passed for employee");
                const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
                return res.status(400).json({message,"status":400});
            }

            const employeeModel = new EmployeeModel();
            const employee = await employeeModel.create(Employee,newEmployee);
            return res.status(200).json(employee);
        } catch (err) {
            console.log(err);
            return res.status(500).send({"message":"Something went wrong", "status":500});
        }
    }
}