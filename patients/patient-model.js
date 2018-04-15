'use strict';

const { Patients } = require('./patient-schema');


const patients = {
	create: function(_patientName, _medication) {
		console.log('Enter Patients:create');
		
		return Patients
			.create({
				name: _patientName,
				medication: _medication
			});
	},

	get: function(id = null) {
		console.log('Enter Patients:Geti ', id);
		if (id === null) {
			return Patients.find();
		} else
			return Patients.findById(id);
	},

	update: function(_id, patientName=null, _medication=null) {
		console.log('enter update function in model: ', _id, patientName, _medication);

		if (_medication){
      let meds = _medication.map(med => {
        return med
      });

      // let updateObj = {
      //   name: patientName,
      //   medication: meds
      // };

			return Patients
				.findByIdAndUpdate(_id, {$set:{'name': patientName, 'medication': meds}}, {new: true})
    } 
		else {
			return Patients.update({name: patientName}, { $pull: { medication: { _id: _id } }}, { safe: true, multi:true });
		}
	},

	delete: function(_id) {
		console.log('Enter Patients:Delete id ');
		return Patients.findByIdAndRemove(_id);

	}

};

module.exports = { patients };