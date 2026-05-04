import prisma from "../libs/prisma";

export const syncUser = async (clerkId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId },
  });
  if (!existingUser) {
    const newUser = await prisma.user.create({
      data: {
        clerkId,
      },
    });
    return newUser;
  }
  return existingUser;
};
