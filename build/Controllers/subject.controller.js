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
exports.SubjectController = void 0;
const subject_model_1 = require("../Models/subject.model");
const statusHttp_1 = require("../Base/statusHttp");
const typeorm_1 = require("typeorm");
class SubjectController {
    /**
     * Function to retrieve records from the database.
     * @param {Request} req request object
     * @param {Response} res res object
     * @returns {Promise<Response>}
     */
    get(req, res) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    id: (_a = req.query) === null || _a === void 0 ? void 0 : _a.id,
                    name: ((_b = req.query) === null || _b === void 0 ? void 0 : _b.name) && (0, typeorm_1.Like)(`%${(_c = req.query) === null || _c === void 0 ? void 0 : _c.name}%`),
                    description: ((_d = req.query) === null || _d === void 0 ? void 0 : _d.description) && (0, typeorm_1.Like)(`%${(_e = req.query) === null || _e === void 0 ? void 0 : _e.description}%`),
                    id_status: (_f = req.query) === null || _f === void 0 ? void 0 : _f.id_status,
                };
                const whereOptions = Object.fromEntries(Object.entries(data).filter(value => value[1]));
                const subjectModel = new subject_model_1.SubjectModel();
                const subject = yield subjectModel.get(subject_model_1.Subject, { where: whereOptions });
                if (subject.length == 0) {
                    console.log("no data found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: 'not subject found', "status": statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(subject);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Something was wrong', status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSubject = new subject_model_1.Subject(req.body);
                const subjectModel = new subject_model_1.SubjectModel();
                const subject = yield subjectModel.create(subject_model_1.Subject, newSubject);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(subject);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something was wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Id is requered", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const subjectModel = new subject_model_1.SubjectModel();
                let subjectToUpdate = yield subjectModel.getById(subject_model_1.Subject, req.body.id);
                delete req.body.id;
                if (!subjectToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "Subject not found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                subjectToUpdate = Object.assign(subjectToUpdate, req.body);
                const subject = yield subjectModel.create(subject_model_1.Subject, subjectToUpdate);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(subject);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something was wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.SubjectController = SubjectController;
