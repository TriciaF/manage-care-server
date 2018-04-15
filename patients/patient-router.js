'use strict';

const express = require('express');

const patientRouter = express.Router();
const { patients } = require('./patient-model');
const bodyParser = require('body-parser');

patientRouter.use(bodyParser.json());



/* ========== GET/READ ALL PATIENTS ========== */
patientRouter.get('/patient', (req, res) => {
	console.log('enter GET end point');
	patients.get()
		.then(response => {
      console.log('response from find patients = ', response)
      res.json(response.map(item => item.serialize()));
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: 'Something went wrong in GET all' });
		});
});

/* ========== GET/READ PATIENT BY ID ========== */
patientRouter.get('/patient/:id', (req, res) => {
	console.log('enter GET/id end point');
	patients.get(req.params.id)
		.then(response => res.status(201).json(response.serialize()))
		.catch(err => {
			res.status(500).json({ message: 'Somthing went wrong: GET Patient by ID' });
		});
});

/* ========== POST/CREATE PATIENT ITEM ========== */
patientRouter.post('/patient', (req, res) => {
	console.log('enter post end point');
	const requiredFields = ['name',
		'medication',
		'dosage',
		'schedule',
		'pharmacyName',
		'pharmacyAddr',
		'pharmacyPhone',
		'physicianName',
		'physicianAddr',
		'physicianPhone'
	];

	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		console.log(field);
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const {
		name,
		medication,
		dosage,
		schedule,
		pharmacyName,
		pharmacyAddr,
		pharmacyPhone,
		physicianName,
		physicianAddr,
		physicianPhone
	} = req.body;

	const meds = [];
	meds.push({
		name: medication,
		dosage: dosage,
		schedule: schedule,
		pharmacy: {
			name: pharmacyName,
			address: pharmacyAddr,
			phoneNumber: pharmacyPhone,
		},
		physician: {
			name: physicianName,
			address: physicianAddr,
			phoneNumber: physicianPhone
		},
	});


	patients.create(name, meds)
		.then(response => {
			res.status(201).json(response.serialize());
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

/* ========== PUT/UPDATE A SINGLE PATIENT ITEM OR REMOVE A MEDICATION ========== */
patientRouter.put('/patient/:id', (req, res) => {
	console.log('enter put end point', req.body);

	if (req.body.medication) {
		console.log('enter if');
		const requiredFields = ['name', 'medication'];

		for (let i = 0; i < requiredFields.length; i++) {
			const field = requiredFields[i];
			console.log(field);
			if (!(field in req.body)) {
				const message = `Missing \`${field}\` in request body`;
				console.error(message);
				return res.status(400).send(message);
			}
		}

		const { name, medication } = req.body;
		const id = req.params.id;
		patients.update(id, name, medication)
			.then(response => res.status(204).json(response))
			.catch(err => {
				res.status(500).json(err);
			});

	} else {
		console.log('enter else');
		const requiredFields = ['name'];

		for (let i = 0; i < requiredFields.length; i++) {
			const field = requiredFields[i];
			console.log(field);
			if (!(field in req.body)) {
				const message = `Missing \`${field}\` in request body`;
				console.error(message);
				return res.status(400).send(message);
			}
		}

		const { name } = req.body;
		const id = req.params.id;
		patients.update(id, name, null)
			.then(response => res.status(204).json(response))
			.catch(err => {
				res.status(500).json(err);
			});
	}

});

/* ========== DELETE/REMOVE A SINGLE PATIENT ITEM ========== */
patientRouter.delete('/patient/:id', (req, res) => {
	console.log('enter delete end point');

	patients.delete(req.params.id)
		.then(response => res.status(204).json(response))
		.catch(err => {
			res.status(500).json({ message: 'Something went wrong: Delete Patient' });
		});
});



module.exports = patientRouter;