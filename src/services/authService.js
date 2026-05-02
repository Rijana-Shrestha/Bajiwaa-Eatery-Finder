const supabase = require("../config/supabase");
const prisma = require("../config/db");

const createUserFromToken = async (token) => {
  // Verify token with Supabase
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new Error("Invalid token");
  }

  const user = data.user;

  // Extract important info
  const auth_id = user.id;
  const email = user.email;

  // Check if user already exists
  let existingUser = await prisma.user.findUnique({
    where: { auth_id },
  });

  if (existingUser) {
    return existingUser;
  }

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      auth_id,
      email,
      isOnboarding: false,
    },
  });

  return newUser;
};

module.exports = { createUserFromToken };
