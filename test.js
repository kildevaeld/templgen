const template = require('./template').template;

console.log(template({
    title: 'Hello, World',
    list: [{
        name: 'test'
    }, {
        name: 'mig'
    }]
}))