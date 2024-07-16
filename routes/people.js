const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");
const Person = require("../models/person");
const Program = require("../models/program"); //?

// Session Authenticator
function requireAuth(req, res, next) {
    console.log("Checking authentication...");
    if (req.session.user && req.session.user.authenticated) {
        console.log("User is authenticated. Proceeding to people page...");
        next(); 
    } else {
        console.log("User is not authenticated. Redirecting to login page...");
        res.redirect('/login');
    }
}

router.use(requireAuth);

//GET request to list all people
router.get('/', asyncHandler(async(req, res, next) => {
    const people = await Person.find()
                               .sort({ first_name: 1, last_name: 1 })
                               .exec();
    
    console.log(people[0].age);
    res.render("people-list", { people: people });
}));

const barangayCodes = {
    "001": "Almanza Uno",
    "002": "Daniel Fajardo",
    "003": "Elias Aldana",
    "004": "Ilaya",
    "005": "Manuyo Uno",
    "006": "Pamplona Uno",
    "007": "Pulanglupa Uno",
    "008": "Talon Uno",
    "009": "Zapote",
    "010": "Almanza Dos",
    "011": "BF International/CAA",
    "012": "Manuyo Dos",
    "013": "Pamplona Dos",
    "014": "Pamplona Tres",
    "015": "Pilar",
    "016": "Pulanglupa Dos",
    "017": "Talon Dos",
    "018": "Talon Tres",
    "019": "Talos Kuartro",
    "020": "Talon Singko"
};

// POST request for updating person
router.get('/edit', asyncHandler(async (req, res, next) => { //Change to post. POST will be used.
    const { id, first_name, last_name, gender,
            birthdate, address, barangay,
            contact_number, disability_type,
            disability, pwd_card_id_no, 
            recent_pwd_id_update_date } = req.body;

    if (first_name === "" || last_name === "") {
        res.sendStatus(400); // HTTP 400: Bad Request
    }

    const person = {
        first_name: first_name,
        last_name: last_name,
        gender: gender,
        birthdate: birthdate, 
        address: address,
        barangay: barangay,
        contact_number: contact_number,
        disability_type: disability_type,
        disability: disability,
        pwd_card_id_no: pwd_card_id_no,
        recent_pwd_id_update_date: recent_pwd_id_update_date,
    };

    await Program.updateOne({_id: id}, person);

    res.sendStatus(200);
}));

// GET request for fetching people list under a specific program
router.get('/:id', asyncHandler(async(req, res, next) => {
    try {
        // Fetch the program details by ID
        const program = await Program.findById(req.params.id);

        // Check if the program exists
        if (!program) {
            console.log('Program not found with ID:', req.params.id);
            return res.status(404).send('Program not found');
        }

        // Log the program details
        console.log('Program details:', program);

        // Render the people list template with the fetched data
        res.render('people-list', { title: 'People List', program, barangayCodes });
    } catch (err) {
        // Handle any errors that occur during fetching
        console.error('Error fetching program details:', err);
        res.status(500).send(err.message);
    }
}));

// POST request for creating people.
router.post('/create', asyncHandler(async(req, res, next) => {
    const newPerson = new Person({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        address: req.body.address,
        barangay: req.body.barangay,
        contact_number: req.body.contact_number,
        disability_type: req.body.disability_type,
        disability: req.body.disability,
        pwd_card_id_no: req.body.pwd_card_id_no,
        recent_pwd_id_update_date: req.body.recent_pwd_id_update_date
    });

    await newPerson.save();
    

    console.log("New person instance saved.");
}));

//POST request for deleting person
router.post('/delete', asyncHandler(async (req, res, next) => {
    await Program.deleteOne({_id: req.body.person_id});
    console.log("Person ID " + req.body.person_id + " has been deleted.");
    res.sendStatus(200);
}));

module.exports = router;