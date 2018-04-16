'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://TriciaF:tjandsam01@ds231588.mlab.com:31588/patients';
exports.TEST_DATABASE = 'mongodb://localhost/test-datatbase';

exports.PORT = process.env.PORT || 8080;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'https://manage-care.netlify.com';
exports.JWT_SECRET = 'I_MISS_SAM';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';