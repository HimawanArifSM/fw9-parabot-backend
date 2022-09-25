const prisma = require("../helpers/prisma");

exports.getAllCheckouts = async () => {
  const checkouts = await prisma.checkouts.findMany();
  return checkouts;
};

exports.create = async (data) => {
  const findCheckout = await prisma.checkouts.findMany({
    where: {
      name: data.name,
      OR: {
        phone_number: data.phone_number
      }
    }
  });
  if(findCheckout.length < 1) {
    const checkouts = await prisma.checkouts.create({
      data
    });
    return checkouts;
  } else {
    const checkout = await prisma.checkouts.update({
      where: {
        id: parseInt(findCheckout[0].id)
      },
      data
    });
    return checkout;
  }
};