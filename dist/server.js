"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
app_1.default.listen(config_1.config.server.port, config_1.config.server.host, () => {
    console.log(`Server running on ${config_1.config.server.host}:${config_1.config.server.port}`);
});
//# sourceMappingURL=server.js.map