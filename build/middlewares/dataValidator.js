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
exports.dataValidator = void 0;
const class_validator_1 = require("class-validator");
const statusHttp_1 = require("../Base/statusHttp");
function dataValidator(entity, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //! QUERY NO PARAM!!!!!!!!
        const dataToValidate = Object.assign(new entity, req.method === 'GET' ? req.query : req.body);
        req.method === 'GET' ? req.query = dataToValidate : req.body = dataToValidate;
        const errors = yield (0, class_validator_1.validate)(dataToValidate, {
            skipMissingProperties: req.method === 'GET',
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        if (errors.length > 0) {
            console.log(errors);
            const message = Object.fromEntries(errors.map(value => [value.property, Object.values(value.constraints)]));
            res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ error: message, status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
        }
        else {
            next();
        }
    });
}
exports.dataValidator = dataValidator;
