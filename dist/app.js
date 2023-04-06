"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// GET - info päring
// POST - saadab infot
// PUT - update
// DELETE - kustutamine
/**
 *
 */
app.get('/api', (req, res) => {
    // output APIdoc page
    res.end("Hello");
});
exports.default = app;
//# sourceMappingURL=app.js.map