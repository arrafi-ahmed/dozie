const cors = require("cors");
const { excludedSecurityURLs } = require("../others/util");

const customCors = (req, res, next) => {
    const baseUrl = process.env.VUE_BASE_URL;
    const hostname = new URL(baseUrl).hostname;
    const wwwUrl = `https://www.${hostname}`;

    const allowedOrigins = [baseUrl, wwwUrl];

    const isExcluded = excludedSecurityURLs.some((url) =>
        req.originalUrl.includes(url)
    );

    // ✅ Always set basic CORS headers for excluded routes
    if (isExcluded) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        if (req.method === "OPTIONS") {
            return res.sendStatus(204);
        }
        return next();
    }

    // ✅ Use CORS middleware for other routes
    const corsOptions = {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(
                    `[CORS Error]: Origin ${origin} not allowed for ${req.originalUrl}`
                );
                callback(new Error("Not allowed by CORS")); // Don't use res.send in CORS handler
            }
        },
        credentials: true,
        exposedHeaders: ["Content-Disposition", "authorization"],
    };

    // ✅ Always respond to preflight properly
    if (req.method === "OPTIONS") {
        cors(corsOptions)(req, res, () => {
            res.sendStatus(204);
        });
    } else {
        return cors(corsOptions)(req, res, next);
    }
};

module.exports = customCors;
