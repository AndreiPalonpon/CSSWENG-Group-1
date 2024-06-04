const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();    

//GET request for creating item.
router.get('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item create GET");
}));

//POST request for creating item.
router.post('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item create POST");
}));

//GET request for editing item.
router.get('/:id/edit', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item edit GET");
}));

//POST request for editing item.
router.post('/:id/edit', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item edit POST");
}));

//GET request for deleting item. 
router.get('/:id/delete', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item delete GET");
}));

//POST request for deleting item. 
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item delete POST");
}));

//GET request to list all items.
router.get('/', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item list");
}));

//GET request for one item.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item detail");
}));

module.exports = router;