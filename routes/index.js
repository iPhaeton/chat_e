var User = require("models/user").User;
var error = require("error");
var ObjectID = require("mongodb").ObjectID;

module.exports = function (app) {
  app.get("/", function (req, res, next) {
    res.render ("index");
  });

  app.get("/users", function (req, res, next) {
    var users = User.find({}, function (err, users) {
      if (err) return next(err);
      res.json(users);
    });

  });

  app.get("/user/:id", function (req, res, next) {
      try {
          var id = new ObjectID(req.params.id);
      } catch (err) {
          return next(404);
      };

      User.findById(req.params.id, function (err, user) {
          if (err) return next(err);
          if(!user) return next (new error.HttpError(404, "User not found"));
          res.json(user);
      });
  });  
};