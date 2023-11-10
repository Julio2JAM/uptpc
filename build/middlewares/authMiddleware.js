"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.verifyToken = exports.generateToken = void 0;
const statusHttp_1 = require("../Base/statusHttp");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = "LaPromesa-JustinQuiles";
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '8h' });
}
exports.generateToken = generateToken;
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        const response = {
            token: null,
            expiredAt: null
        };
        if (error && typeof error === "object" && "expiredAt" in error) {
            response.expiredAt = error.expiredAt;
        }
        return response;
    }
}
exports.verifyToken = verifyToken;
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(statusHttp_1.HTTP_STATUS.UNAUTHORIZED).json({ message: 'Authorization header missing' });
        return;
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
        res.status(statusHttp_1.HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid authorization header' });
        return;
    }
    const payload = verifyToken(token);
    if (!payload) {
        res.status(statusHttp_1.HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid token' });
        return;
    }
    req.user = payload;
    next();
}
exports.authMiddleware = authMiddleware;
