const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();    

//GET request for creating program.
router.get('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program create GET");
}));

//POST request for creating program.
router.post('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program create POST");
}));

//GET request for editing program.
router.get('/:id/edit', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program edit GET");
}));

//POST request for editing program.
router.post('/:id/edit', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program edit POST");
}));

//GET request for deleting program. 
router.get('/:id/delete', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program delete GET");
}));

//POST request for deleting program. 
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program delete POST");
}));

//GET request to list all programs.
router.get('/', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program list");
}));

//GET request for one program.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program detail");
}));

module.exports = router;