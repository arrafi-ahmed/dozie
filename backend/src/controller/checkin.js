const router = require("express").Router();
const checkinService = require("../service/checkin");
const ApiResponse = require("../model/ApiResponse");
const {auth, isAdminEventAuthor} = require("../middleware/auth");

router.post("/save", auth, isAdminEventAuthor, (req, res, next) => {
    checkinService
        .save({
            newCheckin: {
                ...req.body.payload?.newCheckin,
                checkedinBy: req.currentUser.id,
            },
        })
        .then((results) =>
            res.status(200).json(new ApiResponse("Check-in saved!", results)),
        )
        .catch((err) => next(err));
});

router.post(
    "/scanByRegistrationId",
    auth,
    isAdminEventAuthor,
    (req, res, next) => {
        checkinService
            .scanByRegistrationId({
                ...req.body.payload,
                userId: req.currentUser.id,
            })
            .then((results) =>
                res.status(200).json(new ApiResponse("Check-in successful!", results)),
            )
            .catch((err) => next(err));
    },
);

router.get("/getStatistics", auth, isAdminEventAuthor, (req, res, next) => {
    checkinService
        .getStatistics({eventId: req.query.eventId, date: req.query.date})
        .then((results) => res.status(200).json(new ApiResponse(null, results)))
        .catch((err) => next(err));
});

module.exports = router;
