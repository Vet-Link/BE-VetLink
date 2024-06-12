const jwt = require("jsonwebtoken");

function isTokenExpired(token) {
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.exp) {
      return true; // Invalid token or no expiration time found
  }
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

module.exports = isTokenExpired;