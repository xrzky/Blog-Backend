const { User } = require("./../models/index");
const { verify } = require("./../helpers/jwt");

async function authenticationMiddleware(req, res, next) {
  const { authorization } = req.headers;
  token = authorization.split("Bearer ");
  try {
    if (token.length !== 2) throw { name: "InvalidToken" };
    const { id, email } = verify(token[1]);
    const user = User.findOne({ where: { id, email } });
    if (!user) throw { name: "Unauthorized" };
    req.user = { id, email };
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticationMiddleware;
