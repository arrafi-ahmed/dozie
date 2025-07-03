const jwt = require("jsonwebtoken");
const {getEventByEventIdnClubId} = require("../service/event");
const {ifAdmin, ifSudo} = require("../others/util");

const auth = (req, res, next) => {
    const token = req.header("authorization");
    if (!token) {
        console.error("Access denied in auth middleware");
        return res.status(401).json({msg: "Access denied"});
    }
    try {
        const {currentUser} = jwt.verify(token, process.env.TOKEN_SECRET);
        req.currentUser = currentUser;
        next();
    } catch (error) {
        console.error("Invalid token in auth middleware", error);
        return res.status(400).json({msg: "Invalid token"});
    }
};

const isSudo = (req, res, next) => {
    const currentUser = req.currentUser;
    if (!currentUser) {
        console.log("Invalid request blocked in isSudo middleware");
        res.status(400).json({msg: "Invalid request"});
    }
    try {
        if (ifSudo(currentUser.role)) next();
    } catch (error) {
        console.log("Invalid request blocked in isSudo middleware", error);
        return res.status(400).json({msg: "Invalid request"});
    }
};

const isAdmin = (req, res, next) => {
    const currentUser = req.currentUser;
    if (!currentUser) {
        console.log("Invalid request blocked in isAdmin middleware");
        res.status(400).json({msg: "Invalid request"});
    }
    try {
        if (ifAdmin(currentUser.role)) next();
    } catch (error) {
        console.log("Invalid request blocked in isAdmin middleware", error);
        return res.status(400).json({msg: "Invalid request"});
    }
};

const isAdminEventAuthor = async (req, res, next) => {
    const currentUser = req.currentUser;
    if (!currentUser) {
        console.log("Invalid request blocked in isAdminEventAuthor middleware");
        res.status(400).json({msg: "Invalid request"});
    }
    if (ifSudo(currentUser.role)) return true;

    const eventId =
        req.query?.eventId || req.body?.eventId || req.body?.payload?.eventId;

    const clubId = currentUser.clubId;
    try {
        const [event] = await getEventByEventIdnClubId({eventId, clubId});
        if (!event || !event.id) {
            console.log("Access denied in isAdminEventAuthor middleware");
            return res.status(401).json({msg: "Access denied"});
        }
        next();
    } catch (error) {
        console.log(
            "Invalid request blocked in isAdminEventAuthor middleware",
            error,
        );
        return res.status(400).json({msg: "Invalid request"});
    }
};

const isAdminClubAuthor = async (req, res, next) => {
    const currentUser = req.currentUser;
    if (!currentUser) {
        console.log("Invalid request blocked in isAdminClubAuthor middleware");
        res.status(400).json({msg: "Invalid request"});
    }
    if (ifSudo(currentUser.role)) return true;

    const inputClubId =
        req.query?.clubId || req.body?.clubId || req.body?.payload?.clubId;

    const clubId = currentUser.clubId;
    try {
        if (inputClubId != clubId) {
            console.log("Access denied in isAdminClubAuthor middleware");
            return res.status(401).json({msg: "Access denied"});
        }

        next();
    } catch (error) {
        console.log(
            "Invalid request blocked in isAdminClubAuthor middleware",
            error,
        );
        return res.status(400).json({msg: "Invalid request"});
    }
};

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.header("authorization");
        if (!token) throw new Error();
        const {currentUser} = jwt.verify(token, process.env.TOKEN_SECRET);
        req.currentUser = currentUser;
        req.isLoggedIn = true;
    } catch (error) {
        req.isLoggedIn = false;
    } finally {
        next();
    }
};

module.exports = {
    auth,
    isSudo,
    isAdmin,
    isAuthenticated,
    isAdminEventAuthor,
    isAdminClubAuthor,
};
