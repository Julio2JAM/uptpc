"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonController = void 0;
const toolkit_1 = require("../Base/toolkit");
const person_model_1 = require("../Models/person.model");
const statusHttp_1 = require("../Base/statusHttp");
const typeorm_1 = require("typeorm");
class PersonController {
    get(req, res) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    id: (_a = req.query) === null || _a === void 0 ? void 0 : _a.id,
                    cedule: ((_b = req.query) === null || _b === void 0 ? void 0 : _b.cedule) && (0, typeorm_1.Like)(`%${Number((_c = req.query) === null || _c === void 0 ? void 0 : _c.cedule)}%`),
                    name: ((_d = req.query) === null || _d === void 0 ? void 0 : _d.name) && (0, typeorm_1.Like)(`%${(_e = req.query) === null || _e === void 0 ? void 0 : _e.name}%`),
                    lastName: ((_f = req.query) === null || _f === void 0 ? void 0 : _f.lastName) && (0, typeorm_1.Like)(`%${(_g = req.query) === null || _g === void 0 ? void 0 : _g.lastName}%`),
                    phone: ((_h = req.query) === null || _h === void 0 ? void 0 : _h.phone) && (0, typeorm_1.Like)(`%${(_j = req.query) === null || _j === void 0 ? void 0 : _j.phone}%`),
                    email: ((_k = req.query) === null || _k === void 0 ? void 0 : _k.email) && (0, typeorm_1.Like)(`%${(_l = req.query) === null || _l === void 0 ? void 0 : _l.email}%`),
                    birthday: (_m = req.query) === null || _m === void 0 ? void 0 : _m.birthday,
                    id_status: (_o = req.query) === null || _o === void 0 ? void 0 : _o.id_status
                };
                const whereOptions = Object.fromEntries(Object.entries(data).filter(value => value[1]));
                const personModel = new person_model_1.PersonModel();
                const persons = yield personModel.get(person_model_1.Person, { where: whereOptions });
                if (persons.length == 0) {
                    console.log("no data found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No person found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(persons);
            }
            catch (error) {
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, lastname } = req.body;
                if (!name && !lastname) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Name or Lastname is required", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const newPerson = new person_model_1.Person(req.body);
                const errors = yield (0, toolkit_1.validation)(newPerson);
                if (errors) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: errors, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const personModel = new person_model_1.PersonModel();
                const person = yield personModel.create(person_model_1.Person, newPerson);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(person);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "id is required", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const personModel = new person_model_1.PersonModel();
                let personToUpdate = yield personModel.getById(person_model_1.Person, req.body.id);
                if (!personToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "Person not found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                let newData = new person_model_1.Person(req.body);
                newData = Object.entries(newData).filter(value => value[1]);
                personToUpdate = Object.assign(personToUpdate, newData);
                const person = yield personModel.create(person_model_1.Person, personToUpdate);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(person);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.PersonController = PersonController;
