'use strict';

const mongoose = require('mongoose');


//schema definition for the medicine database
const medicineSchema = mongoose.Schema({
	name: String,
	dosage: String,
	schedule: String,
	pharmacy: {
		name: String,
		address: String,
		phoneNumber: String
	},
	physician: {
		name: String,
		address: String,
		phoneNumber: String
	},
});

medicineSchema.set('toJSON', { virtuals: true });

//schema definition for the pateint database
const patientSchema = mongoose.Schema({
	name: String,
	medication: [medicineSchema]
});


//serialize method for patient schema
patientSchema.methods.serialize = function() {
	return {
		id: this._id,
		name: this.name,
		medication: this.medication
	};
};


//declare and export models
const Medicines = mongoose.model('Medicines', medicineSchema);
const Patients = mongoose.model('Patients', patientSchema, 'patientDb');


module.exports = { Medicines, Patients };