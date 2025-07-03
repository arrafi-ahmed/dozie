const express = require("express");
const router = require("express").Router();
const stripeService = require("../service/stripe");
const ApiResponse = require("../model/ApiResponse");

router.post("/createCheckout", (req, res, next) => {
    stripeService
        .createCheckout({payload: req.body})
        .then((results) => res.status(200).json(new ApiResponse(null, results)))
        .catch((err) => next(err));
});

router.post("/createStripeCheckoutIfNeeded", (req, res, next) => {
    stripeService
        .createStripeCheckoutIfNeeded({payload: req.body})
        .then((results) => res.status(200).json(new ApiResponse(null, results)))
        .catch((err) => next(err));
});

router.get("/sessionStatus", (req, res, next) => {
    stripeService
        .sessionStatus({sessionId: req.query.sessionId})
        .then((result) => res.status(200).json(new ApiResponse(null, result)))
        .catch((err) => next(err));
});

const webhook = async (req, res, next) => {
    stripeService
        .webhook(req)
        .then((result) => {
            res.status(200).json(new ApiResponse(result, null));
        })
        .catch((err) => next(err));
};

module.exports = {router, webhook};
