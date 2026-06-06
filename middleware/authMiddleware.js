// middleware/authMiddleware.js
// This is the "security guard" of our API.
// It checks every protected route to make sure the user is logged in (has a valid token).

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Step 1: Check if the Authorization header exists and starts with "Bearer"
  // A token in the header looks like:  Authorization: Bearer eyJhbGciOiJIUzI1...
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT secret is not configured" });
      }

      // Step 2: Extract just the token part (remove the "Bearer " prefix)
      // "Bearer eyJhbGciOiJIUzI1..." → split on space → ["Bearer", "eyJhbG..."] → take [1]
      token = req.headers.authorization.split(" ")[1];

      // Step 3: Verify the token using our secret key
      // jwt.verify() decodes the token and checks:
      //   - Is the signature valid? (Was it created with our JWT_SECRET?)
      //   - Has the token expired?
      // If valid, it returns the decoded payload (which contains the user's id)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Step 4: Find the user in the database using the id from the token
      // .select("-password") means: return everything EXCEPT the password field
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Step 5: Call next() to continue to the actual route handler
      next();
    } catch (error) {
      // Token is invalid or expired
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token was provided at all
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
