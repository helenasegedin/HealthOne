"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const config_1 = require("config");
const path_1 = require("path");
exports.config = config_1.util.loadFileConfigs((0, path_1.join)(__dirname, '..', 'config'));
//# sourceMappingURL=config.js.map