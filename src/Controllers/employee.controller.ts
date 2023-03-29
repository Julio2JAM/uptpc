import { Employee, EmployeeModel } from "../Models/employee.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { validation } from "../Base/helper";

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
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {

            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const employeeModel = new EmployeeModel();
            const employee = employeeModel.getById(Employee,id);

            if(!employee){
                console.log("no data found for employee");
                return res.status(HTTP_STATUS.NOT_FOUND).send({"message":"No employee found", status:HTTP_STATUS.NOT_FOUND})
            }

            return res.status(HTTP_STATUS.OK).json(employee);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({"message":"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response):Promise<Response>{
        try {
            const dataEmployee = new Map(Object.entries(req.body));
            const newEmployee = new Employee(dataEmployee);

            const errors = await validation(newEmployee);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const employeeModel = new EmployeeModel();
            const employee = await employeeModel.create(Employee,newEmployee);
            return res.status(HTTP_STATUS.CREATED).json(employee);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({"message":"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}