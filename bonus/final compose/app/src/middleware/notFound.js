//import
const statusRequest = require('../config/status');

function notFound(req, res)
{
    return (res.status(statusRequest.notFound).send('<H2 style="text-align: center;">ERROR: page not found !</H2>'));
}

module.exports = {
    notFound
}