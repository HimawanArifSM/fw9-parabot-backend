const prisma = require('../helpers/prisma');

exports.createValueModel = async (data) => {
    const review = await prisma.reviews.create({
        data
    })
    return review;
};

exports.getReviewModel = async (product_id,offset,limit) => {
    const review = await prisma.reviews.findMany({
        skip: offset,
        take: limit,
        where: {
            product_id: product_id,
        },
        include: {
            users: {
                select: {
                    id: true,
                    profiles: {
                        select: {
                            full_name: true,
                            image: true,
                        }
                    }
                }
            }
        }
    })
    return review;
}

exports.getCountReview = async(product_id) => {
    const review = await prisma.reviews.count({
        where: {
            product_id: product_id,
        }
    })
    return review
}