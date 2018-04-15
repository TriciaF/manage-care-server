'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://TriciaF:tjandsam01@ds231588.mlab.com:31588/patients';

exports.PORT = process.env.PORT || 8080;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
exports.JWT_SECRET = 'I_MISS_SAM';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';