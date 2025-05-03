"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = require("handlebars");
class EmailTemplateManager {
    static cache = new Map();
    static compileTemplate(category, templateName, variables, isHtml = true) {
        const cacheKey = `${category}/${templateName}`;
        if (!this.cache.has(cacheKey)) {
            const filePath = path_1.default.join(__dirname, 'templates', category, `${templateName}.hbs`);
            const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
            const compiled = (0, handlebars_1.compile)(fileContent);
            this.cache.set(cacheKey, compiled);
        }
        const template = this.cache.get(cacheKey);
        let result = template(variables);
        if (!isHtml) {
            // Convert <br> tags to plain text newlines
            result = result.replace(/<br\s*\/?>/g, '\n');
        }
        return result;
    }
}
exports.EmailTemplateManager = EmailTemplateManager;
