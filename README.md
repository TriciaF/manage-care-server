

## Table of Contents

- [Project Description](#Product-Description)
- [Application Links](#Link-to-Deployed-Application)
- [Application Release version](#Release Version)
- [Tech Resources used in this application](#Tech-Stack)
- [Application Screen Shots](#Screen Shots)
- [Server side REST API description](#Server- REST API)

#Project Description
Manage Care is an application which addresses one aspect of patient care – managing a patient’s prescription medications.  The application allows a care giver to add a patient, add a medication, which includes the name of the medication, the dosage, the schedule, pharmacy information and prescribing physician information.  This allows care givers to advocate on behalf of the patient and understand the purpose of the medication and ensure the proper dosage is being taken and the prescribed schedule.  

#Link to Deployed Application 

Client:  https://manage-care.netlify.com/
Server:  https://manage-care-server.herokuapp.com
MongoDb-production: mongodb://TriciaF:tjandsam01@ds231588.mlab.com:31588/patients

# Release Version
v1.0.0

#Tech Stack

* Node.js
* Express.js
* Mongoose and MongoDB
* Travis CI, Netlify, and Heroku for CICD
* Front End: HTML, CSS, JavaScript, React, Redux

#Screen Shots
Home Page
 
Patient Dashboard
 

#Server - REST API

* User Router:
  *  POST - /login
        Creates and returns a new user through application registration
        Protected: No
        Required Fields: username, password, email

  *  DELETE - /login/:id
        Returns all users
        Protected: No
        Required Fields: User id

*  Auth Router:
  *  POST - /auth/login
        Creates and returns a 'local' authorization token
        Protected: Yes
        Required Fields: username and password, token

  *  POST - /auth/refresh
        Creates and returns a refreshed 'jwt' authorization token
        Protected: Yes
        Required Fields: username, password, token

* patient Router:
  *  POST- /patient
        Creates a new patient
        Protected: Yes
        Required Fields: patient name, medication name, dosage, schedule, pharmacy name, pharmacy address, pharmacy phone number, physician name, physician address, physician phone number

  *  DELETE - /patient/:id
        Removes a patient
        Protected: No
        Required Fields: Patient id



