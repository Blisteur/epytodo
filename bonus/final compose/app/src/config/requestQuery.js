//import
const connection = require('./db');

async function requestQuery(query)
{
    try {
        const request = await connection.promise().query(query);
        return {'status': 'success', 'res': request};
    } catch (error) {
        return {'status': 'error', 'res': error};
    }
};

module.exports = { requestQuery }