const app = require("./app");
const logger = require("./loggingFunction");
const port = 8080;

if (!("toJSON" in Error.prototype))
  Object.defineProperty(Error.prototype, "toJSON", {
    value: function () {
      var alt = {};

      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true,
  });

app.use(function (err, _req, res, _next) {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ code: 500, messgae: "Internal Server error" });
});

app.listen(process.env.PORT || port, () => {
  logger("info", "", `Express server started on port ${port}`);
  console.log(`Express server started on port ${port}`);
});
