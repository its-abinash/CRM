var fs = require('fs')

let ENV = JSON.parse(fs.readFileSync("./Configs/routes.config.json", 'utf-8'))

exports.landingPage = async function(req, res) {
    console.log('### Inside controller->landingPage ###')
    res.render('register', {
        regEndpoint : ENV.endpoints.server + ENV.routes.reg,
        loginEndpoint : ENV.endpoints.server + ENV.routes.login,
    })
}