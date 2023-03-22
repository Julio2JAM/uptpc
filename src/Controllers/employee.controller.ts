import { validate } from "class-validator";
import { Request, Response } from "express";
import { Employee, EmployeeModel } from "../Models/employee.model";
import { HTTP_STATUS } from "../Base/statusHttp";

export class EmployeeController{
    async get(_req:Request, res: Response):Promise<Response>{
        try {
            const employeeModel = new EmployeeModel();
            const employee = await employeeModel.get(Employee);

            if(!employee){
                console.log("no data found for employee");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No employee found", status:HTTP_STATUS.NOT_FOUND})
            }

            return res.status(HTTP_STATUS.OK).json(employee);
        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {
            const { id } = req.params;

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"id is required", status:HTTP_STATUS.BAD_RESQUEST});
            }
            if(typeof id !== "number"){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"The id is not a number", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const employeeModel = new EmployeeModel();
            const employee = employeeModel.getById(Employee,id);

            if(!employee){
                console.log("no data found for employee");
                return res.status(HTTP_STATUS.NOT_FOUND).send({"message":"No employee found", status:HTTP_STATUS.NOT_FOUND})
            }

            return res.status(HTTP_STATUS.OK).json(employee);
        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({"message":"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
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
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({message, status:HTTP_STATUS.BAD_RESQUEST});
            }

            const employeeModel = new EmployeeModel();
            const employee = await employeeModel.create(Employee,newEmployee);
            return res.status(HTTP_STATUS.CREATED).json(employee);
        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({"message":"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}