const router = require("express").Router();
const eventService = require("../service/event");
const ApiResponse = require("../model/ApiResponse");
const {
    auth,
    isAdminEventAuthor,
    isAuthenticated,
} = require("../middleware/auth");
const {uploadEventBanner} = require("../middleware/upload");
const compressImages = require("../middleware/compress");
const {ifSudo, ifAdmin} = require("../others/util");

router.post(
    "/save",
    auth,
    uploadEventBanner,
    compressImages,
    (req, res, next) => {
        if (!ifAdmin(req.currentUser.role))
            return res.status(403).json(new ApiResponse("Invalid Request!", null));

        eventService
            .save({
                payload: req.body,
                files: req.files,
                currentUser: req.currentUser,
            })
            .then((result) => {
                res.status(200).json(new ApiResponse("Event saved!", result));
            })
            .catch((err) => next(err));
    },
);

router.post("/saveExtras", auth, (req, res, next) => {
    if (!ifAdmin(req.currentUser.role))
        return res.status(403).json(new ApiResponse("Invalid Request!", null));

    eventService
        .saveExtras({
            payload: req.body,
            currentUser: req.currentUser,
        })
        .then((result) => {
            res.status(200).json(new ApiResponse("Voucher saved!", result));
        })
        .catch((err) => next(err));
});

router.get("/getAllEvents", (req, res, next) => {
    eventService
        .getAllEvents({clubId: req.query.clubId})
        .then((results) => res.status(200).json(new ApiResponse(null, results)))
        .catch((err) => next(err));
});

router.get("/getEvent", (req, res, next) => {
    eventService
        .getEvent({
            eventId: req.query.eventId,
        })
        .then((results) => res.status(200).json(new ApiResponse(null, results)))
        .catch((err) => next(err));
});

router.get("/getEventByEventIdnClubId", isAuthenticated, (req, res, next) => {
    const isRoleSudo = ifSudo(req.currentUser?.role);
    eventService
        .getEventByEventIdnClubId({
            clubId: isRoleSudo ? req.query.clubId : req.currentUser.clubId,
            eventId: req.query.eventId,
        })
        .then((results) => res.status(200).json(new ApiResponse(null, results[0])))
        .catch((err) => next(err));
});

router.get("/removeEvent", auth, isAdminEventAuthor, (req, res, next) => {
    const isRoleSudo = ifSudo(req.currentUser.role);
    eventService
        .removeEvent({
            clubId: isRoleSudo ? req.query.clubId : req.currentUser.clubId,
            eventId: req.query.eventId,
        })
        .then((results) =>
            res.status(200).json(new ApiResponse("Event deleted!", results)),
        )
        .catch((err) => next(err));
});

router.get("/removeExtras", auth, isAdminEventAuthor, (req, res, next) => {
    eventService
        .removeExtras({
            eventId: req.query.eventId,
            extrasId: req.query.extrasId,
        })
        .then((results) =>
            res.status(200).json(new ApiResponse("Voucher deleted!", results)),
        )
        .catch((err) => next(err));
});

router.get("/getAllActiveEvents", (req, res, next) => {
    eventService
        .getAllActiveEvents({
            clubId: req.query.clubId,
            currentDate: req.query.currentDate,
        })
        .then((results) => res.status(200).json(new ApiResponse(null, results)))
        .catch((err) => next(err));
});

router.post("/saveExtras", auth, (req, res, next) => {
    if (!ifAdmin(req.currentUser.role))
        return res.status(403).json(new ApiResponse("Invalid Request!", null));

    eventService
        .saveExtras({
            payload: req.body,
            currentUser: req.currentUser,
        })
        .then((result) => {
            res.status(200).json(new ApiResponse("Voucher saved!", result));
        })
        .catch((err) => next(err));
});

router.get("/getExtras", (req, res, next) => {
    eventService
        .getExtrasByEventId({eventId: req.query.eventId})
        .then((results) => res.status(200).json(new ApiResponse(null, results)))
        .catch((err) => next(err));
});

module.exports = router;
