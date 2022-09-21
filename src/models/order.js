const prisma = require("../helpers/prisma")

const convertMoney = (number) => new Intl.NumberFormat('Id-ID', {
    style:'currency',    
    currency: 'IDR',
}).format(number)

exports.createOrder = async (data) => {
    console.log(data)
    const getCart = await prisma.cart.findMany({
        where: {
            id: parseInt(data.cart_id, 10)
        }
    });
    if (getCart.length < 1){
        return 'error get product and order';
    } else {
        await prisma.cart.update({
            where: {
                id: parseInt(data.cart_id, 10)
            },
            data: {
                is_deleted: true,
            }
        })
    }
    const product_id = getCart[0].product_id;
    const getProduct = await prisma.products.findMany({
        where: {
            id: product_id
        }
    });
    if (getProduct.length < 1){
        return 'error get product and order';
    } else {
        await prisma.products.update({
            where: {
                id: product_id,
            },
            data: {
                stock: parseInt(getProduct[0].stock, 10) - parseInt(getCart[0].quantity, 10),
                sold: parseInt(getProduct[0].sold, 10) + parseInt(getCart[0].quantity, 10),
            }
        })
    }

    await prisma.notification.create({
        data:{
            tittle: 'You have new order',
            text: `You order ${getProduct[0].product_name} with price ${convertMoney(parseInt(getCart[0].total_price, 10))}.`,
            user_id: data.user_id,
        }
    })

    const order = await prisma.orders.create({
        data: {
            cart_id: parseInt(data.cart_id, 10),
            checkout_id: parseInt(data.checkout_id, 10),
            status_payment: 'paid'
        }
    });

    return order;
}

exports.getOrderForSeller = async (type) => {
    const includeData = {
        include: {
            cart: {
                select: {
                    quantity: true,
                    total_price: true,
                    products: {
                        select: {
                            product_images: true,
                            product_name: true,
                            price: true,
                        }
                    }
                }
            }
        }
    }
    const getOrder = await prisma.orders.findMany();
    console.log(getOrder)
    // const getProduct = await prisma.cart.findMany()
    switch (type) {
        case 'paid':
            const orderPaid = await prisma.orders.findMany({
                where: {
                    status_payment: 'paid'
                },
                ...includeData
            });
            return orderPaid;
        case 'pending':
            const orderPending = await prisma.orders.findMany({
                where: {
                    status_payment: 'pending'
                },
                ...includeData
            });
            return orderPending;
        case 'sent':
            const orderSent = await prisma.orders.findMany({
                where: {
                    status_payment: 'sent'
                },
                ...includeData
            });
            return orderSent;
        case 'complate':
            const orderComplate = await prisma.orders.findMany({
                where: {
                    status_payment: 'complate'
                },
                ...includeData
            });
            return orderComplate;
        case 'cancel':
            const orderCancel = await prisma.orders.findMany({
                where: {
                    status_payment: 'cancel'
                },
                ...includeData
            });
            return orderCancel;
        default:
            const order = await prisma.orders.findMany({
                ...includeData
            });
            return order;
    }
}
