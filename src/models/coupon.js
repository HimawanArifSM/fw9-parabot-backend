const prisma = require("../helpers/prisma")

exports.checkCoupon = async (code) => {
    const coupon = await prisma.coupons.findMany({
        where: {
            code: code
        },
        select: {
            id: true,
            coupon_name: true,
            discount: true,
            category: true,
            code: true,
        }
    });
    return coupon;
}

exports.getAllCoupons = async () => {
    const coupons = await prisma.coupons.findMany({});
    return coupons;
}

exports.createCoupon = async (data) => {
    const checkCoupon = await prisma.coupons.findMany({
        where: {
            code: data.code,
        },
    });
    if(checkCoupon.length < 1) {
        const coupon = await prisma.coupons.create({
            data: {
                ...data
            }
        });
        return coupon;
    } else {
        return 'coupon has been created.'
    }
}

exports.updateCoupon = async (id, data) => {
    const coupon = await prisma.coupons.update({
        where: {
            id: id,
        },
        data
    })
    return coupon
}

exports.deleteCoupon = async (id) => {
    const coupon = await prisma.coupons.delete({
        where: {
            id: id,
        }
    })
    return coupon;
}