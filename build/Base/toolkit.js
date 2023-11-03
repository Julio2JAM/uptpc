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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchPassword = exports.hashPassword = exports.removeFalsyFromObject = exports.validation = void 0;
const class_validator_1 = require("class-validator");
function validation(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = yield (0, class_validator_1.validate)(data);
        if (errors.length > 0) {
            console.log(errors);
            return Object.fromEntries(errors.map(value => [value.property, Object.values(value.constraints)]));
        }
        return null;
    });
}
exports.validation = validation;
/**
 * Explanation, [Foreach funciona solo con arrays,
 * por lo tanto, al ser un objeto, se obtienen las keys del objeto,
 * con object.keys(), que retorna un arrays con las keys,
 * y a esa array se le itera, para eliminar los valores falsy del objeto]
 * @param object object to remove falsy values
 * @returns object with values removed
 */
function removeFalsyFromObject(object) {
    Object.keys(object).forEach(key => {
        if (object[key] && typeof object[key] === 'object') {
            removeFalsyFromObject(object[key]);
        }
        if (!object[key] && object[key] !== 0) {
            delete object[key];
        }
    });
    return object;
}
exports.removeFalsyFromObject = removeFalsyFromObject;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hash = yield bcryptjs_1.default.hash(password, salt);
        return hash;
    });
}
exports.hashPassword = hashPassword;
function matchPassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcryptjs_1.default.compare(password, hashedPassword);
        return isMatch;
    });
}
exports.matchPassword = matchPassword;
