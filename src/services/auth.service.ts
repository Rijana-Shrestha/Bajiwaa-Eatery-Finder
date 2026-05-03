import prisma from "../libs/prisma";

export const createUser = async (clerkId: string) => {
  const user = await prisma.user.create({
    data: {
      clerkId,
    },
  });
  return user;
};

export const deleteUser = async (clerkId: string) => {
  const user = await prisma.user.delete({
    where: {
      clerkId,
    },
  });
  return user;
};
