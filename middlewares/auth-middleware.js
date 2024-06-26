const { User } = require("./../models/index");
const { verify } = require("./../helpers/jwt");

async function authenticationMiddleware(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw { name: "NoAuthorization" };
    token = authorization.split("Bearer ");
    if (token.length !== 2) throw { name: "InvalidToken" };
    const { id, email } = verify(token[1]);
    const user = await User.findOne({ where: { id, email } });
    if (!user) throw { name: "Unauthorized" };
    req.user = { id, email };
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticationMiddleware;
