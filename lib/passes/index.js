"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./user-values"));
const user_values_1 = require("./user-values");
const _passes = [
    user_values_1.UserValueVisitor
];
function passes(e) {
    return __awaiter(this, void 0, void 0, function* () {
        let copy = e.copy();
        let errors = {};
        let tmp;
        for (let i = 0, ii = _passes.length; i < ii; i++) {
            tmp = new _passes[i];
            try {
                copy = yield tmp.parse(copy);
            }
            catch (e) {
                errors[tmp.name] = e;
            }
        }
        return copy;
    });
}
exports.passes = passes;
