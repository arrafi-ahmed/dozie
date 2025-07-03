const router = require("express").Router();
const formService = require("../service/form");
const ApiResponse = require("../model/ApiResponse");
const {auth, isAdminEventAuthor} = require("../middleware/auth");

router.post("/save", auth, isAdminEventAuthor, (req, res, next) => {
    formService
        .save(req.body)
        .then((results) => {
            if (results) {
                res.status(200).json(new ApiResponse("Form saved!", results));
            }
        })
        .catch((err) => next(err));
});

router.get("/getFormQuestions", (req, res, next) => {
    formService
        .getFormQuestions(req.query.eventId)
        .then((results) => {
            res.status(200).json(new ApiResponse(null, results));
        })
        .catch((err) => next(err));
});

module.exports = router;
