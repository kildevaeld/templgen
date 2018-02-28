"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __forEach = (a, fn) => { if (Array.isArray(a)) {
    a.forEach(fn);
}
else {
    for (let k in a) {
        fn(k, a[k]);
    }
} };
function template(ctx) {
    let __out = "";
    __forEach(ctx.list, (i, v) => {
        __out += `
  index #`;
        __out += i;
        __out += `
  value `;
        __out += v;
        __out += `
`;
    });
    __out += `

`;
    __forEach(ctx.map, (k, v) => {
        __out += `
  key `;
        __out += k;
        __out += `
  value `;
        __out += v;
        __out += `
`;
    });
}
exports.template = template;
;
