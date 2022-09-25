const prisma = require("../helpers/prisma")

exports.createPayment = async (data) => {
    const payment = await prisma.payments.create({
        data:{
            ...data
        }
    });
    return payment;
}

exports.getAllPayments = async () => {
    const payments = await prisma.payments.findMany({});
    return payments;
}

