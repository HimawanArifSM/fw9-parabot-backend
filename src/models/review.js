const prisma = require('../helpers/prisma');

exports.createValueModel = async (data) => {
    const review = await prisma.reviews.create({
        data
    })
    return review;
};