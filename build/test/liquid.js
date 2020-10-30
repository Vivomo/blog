const Liquid = require('liquid')
const engine = new Liquid.Engine()

engine
    .parse(`
    {% assign l = name | split:',' %}
    {% for i in l %}
        {{i}}
    {% endfor %}
    `)
    .then(template => template.render({ name: '1,2,3' }))
    .then(result => console.log(result))