const { createUserFromToken } = require("../services/auth.service");

const registerUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    const user = await createUserFromToken(token);

    res.status(200).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

module.exports = { registerUser };
