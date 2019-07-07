const path = require('path');
const dotEnv = require('dotenv');

dotEnv.config({
    path: path.join(process.cwd(), `.env.${process.env['NODE_ENV'] || 'development'}`)
});

module.exports = dotEnv;
