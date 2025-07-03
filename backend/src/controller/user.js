const router = require("express").Router();
const userService = require("../service/user");
const ApiResponse = require("../model/ApiResponse");
const clubService = require("../service/club");

router.post("/save", async (req, res, next) => {
    try {
        const savedUser = await userService
            .save(req.body)

        //added
        const savedClub = await clubService
            .save({payload: {name: savedUser.fullName}, currentUser: savedUser})

        const updatedUser = await userService
            .save({...savedUser, clubId: savedClub.id})

        if (updatedUser) {
            res
                .status(200)
                .json(new ApiResponse("Registration successful!", {result: updatedUser}));
        }
    } catch (err) {
        next(err)
    }
});

router.post("/signin", (req, res, next) => {
    userService
        .signin(req.body)
        .then(({token, currentUser}) => {
            if (token) {
                res
                    .status(200)
                    .header("authorization", token)
                    .json(new ApiResponse("Sign in successful!", {currentUser}));
            }
        })
        .catch((err) => next(err));
});

module.exports = router;
