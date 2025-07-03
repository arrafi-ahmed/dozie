require("dotenv").config({
  path:
      process.env.NODE_ENV === "production"
          ? ".env.production"
          : ".env.development",
});
process.env.TZ = "UTC";

const express = require("express");
const app = express();
const path = require("path");
const customCors = require("./src/middleware/customCors");
const {
  globalErrHandler,
  uncaughtErrHandler,
} = require("./src/middleware/errHandler");
const { appInfo } = require("./src/others/util");
const port = process.env.PORT || 3000;

// Uncomment if Stripe webhook is needed
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  require("./src/controller/stripe").webhook,
);
//middlewares
app.use(customCors);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

//routes
app.use("/api/user", require("./src/controller/user"));
app.use("/api/club", require("./src/controller/club"));
app.use("/api/event", require("./src/controller/event"));
app.use("/api/registration", require("./src/controller/registration"));
app.use("/api/checkin", require("./src/controller/checkin"));
app.use("/api/form", require("./src/controller/form"));
app.use("/api/appUser", require("./src/controller/appUser"));
app.use("/api/stripe", require("./src/controller/stripe").router);

app.get("/api/version", (req, res) => {
  res.status(200).json(appInfo);
});

app.listen(port, (err) => {
  if (err) return console.error(err);
  console.log(`Server started at ${port} - ${new Date()}`);
});

uncaughtErrHandler();
app.use(globalErrHandler);
