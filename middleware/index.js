const admin = require("../config/firebase.js");
const UserModel = require("../models/userModel.js");
class Middleware {
  async decodeToken(req, res, next) {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const decode = await admin.auth().verifyIdToken(token);
        if (decode) {
          req.user = decode;
          return next();
        }
        return res.json({
          message: "Unauthorized to access this resource",
          status: "error",
        });
      } else {
        throw new Error("Your authorization header is not present");
      }
    } catch (e) {
      res.json({
        message: "Internal server error" + e.message,
        status: "error",
      });
    }
  }

  async userExists(req, res, next) {
    try {
      const user = await UserModel.findOne({ email: req.user.email });
      if (user) {
        req.user = user;
        return next();
      }
      return res.json({
        message: "Unauthorized to access this resource",
        status: "error",
      });
    } catch (e) {}
  }
}
module.exports = new Middleware();
