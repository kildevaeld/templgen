"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const template_parser_1 = require("../template_parser");
const types_1 = require("../types");
const Path = __importStar(require("path"));
const fs = __importStar(require("mz/fs"));
const utils_1 = require("../utils");
class MultiError extends Error {
    constructor(errors, message) {
        super();
        this.errors = errors;
        this.name = "MultiError";
        Object.setPrototypeOf(this, MultiError.prototype);
    }
    get message() {
        let str = [''];
        for (let error of this.errors) {
            str.push(' * ' + error.message);
        }
        return str.join('\n');
    }
    toString() { return this.message; }
}
exports.MultiError = MultiError;
class ImportPass {
    constructor() {
        this.name = "Import";
    }
    parse(e) {
        return __awaiter(this, void 0, void 0, function* () {
            let copy = e.copy();
            yield this.resolveImport(copy, null);
            return copy;
        });
    }
    resolveImport(e, p) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!e.file)
                throw new Error('no file');
            let imports = e.value.value.filter(m => m.nodeType == types_1.Token.Import);
            for (let ee of e.value.value) {
                if (~[types_1.Token.Template, types_1.Token.CustomType].indexOf(ee.nodeType)) {
                    ee.contextId = e.id;
                }
            }
            if (!imports.length)
                return e;
            const resolvePath = Path.dirname(e.file);
            let errors = [];
            for (let i of imports) {
                let path = Path.join(resolvePath, i.path);
                if (p && path === e.file) {
                    errors.push(new Error('circle import'));
                    continue;
                }
                try {
                    const data = yield fs.readFile(path, 'utf-8');
                    const ast = template_parser_1.parse(data);
                    ast.file = path;
                    ast.id = utils_1.uniqueID();
                    yield this.resolveImport(ast, e);
                    e.imports.push(ast);
                    i.importId = ast.id;
                }
                catch (e) {
                    errors.push(e);
                }
            }
            if (errors.length)
                throw new MultiError(errors, "import");
        });
    }
}
exports.ImportPass = ImportPass;
