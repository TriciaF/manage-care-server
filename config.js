// exports.DATABASE_URL =  process.env.DATABASE_URL || 'mongodb://Forrester:SandTrap64*@patients.fpkud.mongodb.net/patients?retryWrites=true&w=majority';

exports.DATABASE_URL =  process.env.DATABASE_URL || "mongodb+srv://Forrester:SandTrap64*@patients.fpkud.mongodb.net/?retryWrites=true&w=majority";

//ports.TEST_DATABASE = 'mongodb://localhost/test-datatbase';

exports.PORT = process.env.PORT || 8080;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'https://manage-care.netlify.app';

// local development value
// exports.CLIENT_ORIGIN = 'http://localhost:3000';
exports.JWT_SECRET = 'I_MISS_SAM';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'