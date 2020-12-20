exports.DATABASE_URL = 'mongodb+srv://Forrester:Tjandsam01!@patients.fpkud.mongodb.net/patients?retryWrites=true&w=majority';

exports.TEST_DATABASE = 'mongodb://localhost/test-datatbase';

exports.PORT = process.env.PORT || 8080;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'https://manage-care.netlify.com';

// local development value
// exports.CLIENT_ORIGIN = 'http://localhost:3000';
exports.JWT_SECRET = 'I_MISS_SAM';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'