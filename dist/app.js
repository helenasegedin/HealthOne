"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articles_router_1 = __importDefault(require("./routes/articles.router"));
const articles_router_2 = __importDefault(require("./routes/articles.router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
/**
 *
 */
app.get('/api', (req, res) => {
    // output APIdoc page
    res.end("Hello");
});
// GET - info päring (kõik artiklid)
app.use("/api/articles", articles_router_1.default);
app.use("/api/authors", articles_router_2.default);
exports.default = app;
//# sourceMappingURL=app.js.map