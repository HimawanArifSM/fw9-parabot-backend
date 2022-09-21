const prisma = require("../helpers/prisma")

const convertMoney = (number) => new Intl.NumberFormat('Id-ID', {
    style:'currency',    
    currency: 'IDR',
}).format(number)

exports.createOrder = async (data) => {
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
    const seller_id = getProduct[0].user_id;
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

    //notification for customers
    await prisma.notification.create({
        data:{
            tittle: 'You have new order',
            text: `You order product ${getProduct[0].product_name} with price ${convertMoney(parseInt(getCart[0].total_price, 10))}.`,
            user_id: data.user_id,
        }
    });

    //notification for seller
    await prisma.notification.create({
        data:{
            tittle: 'You have new order',
            text: `You have an order for ${getProduct[0].product_name} products.`,
            user_id: parseInt(seller_id, 10),
        }
    });

    const order = await prisma.orders.create({
        data: {
            cart_id: parseInt(data.cart_id, 10),
            checkout_id: parseInt(data.checkout_id, 10),
            status_payment: 'paid',
            custumer_id: data.user_id,
            seller_id: parseInt(seller_id, 10),
        },
    });

    const finalOrder = await prisma.orders.update({
        where: {
            id: order.id,
        },
        data: {
            transaction_id: Math.floor(Math.random(10) * 1000000000000000)+`${product_id}${order.id}OFRNFS`
        }
    });

    return finalOrder;
}

exports.getAllOrder = async (type, seller_id, custumer_id, limit, offset) => {
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
    
    let isSeller;

    if(type === 'all' && seller_id!=null) {
        isSeller = {seller_id: seller_id}
    } else if(type === 'all' && seller_id==null) {
        isSeller = {custumer_id: custumer_id}
    } else if(type !== 'all' && seller_id!=null){
        isSeller = { 
            AND: {
                seller_id: seller_id
            }
        }
    } else if(type !== 'all' && seller_id==null) {
        isSeller = { 
            AND: {
                custumer_id: custumer_id
            }
        }
    }

    const getOrder = await prisma.orders.findMany();
    // console.log(getOrder)
    // const getProduct = await prisma.cart.findMany()
    switch (type) {
        case 'paid':
            const orderPaid = await prisma.orders.findMany({
                skip: offset,
                take: limit,
                where: {
                    status_payment: 'paid',
                    ...isSeller
                },
                ...includeData
            });
            return orderPaid;
        case 'process':
            const orderProcess = await prisma.orders.findMany({
                skip: offset,
                take: limit,
                where: {
                    status_payment: 'process',
                    ...isSeller
                },
                ...includeData
            });
            return orderProcess;
        case 'sent':
            const orderSent = await prisma.orders.findMany({
                skip: offset,
                take: limit,
                where: {
                    status_payment: 'sent',
                    ...isSeller
                },
                ...includeData
            });
            return orderSent;
        case 'complate':
            const orderComplate = await prisma.orders.findMany({
                skip: offset,
                take: limit,
                where: {
                    status_payment: 'complate',
                    ...isSeller
                },
                ...includeData
            });
            return orderComplate;
        case 'cancel':
            const orderCancel = await prisma.orders.findMany({
                skip: offset,
                take: limit,
                where: {
                    status_payment: 'cancel',
                    ...isSeller
                },
                ...includeData
            });
            return orderCancel;
        case 'all':
            const orderAll = await prisma.orders.findMany({
                skip: offset,
                take: limit,
                where: {
                    ...isSeller
                },
                ...includeData
            });
            return orderAll;
        default:
            // const order = await prisma.orders.findMany({
            //     skip: offset,
            //     take: limit,
            //     where: {
            //         seller_id: seller_id,
            //     },
            //     ...includeData
            // });
            return `No data for type order ${type}`;
    }
}

exports.countOrderList = async (type, seller_id, custumer_id) => {
    let isSeller;

    if(type === 'all' && seller_id!=null) {
        isSeller = {seller_id: seller_id}
    } else if(type === 'all' && seller_id==null) {
        isSeller = {custumer_id: custumer_id}
    } else if(type !== 'all' && seller_id!=null){
        isSeller = {seller_id: seller_id}
    } else if(type !== 'all' && seller_id==null) {
        isSeller = {custumer_id: custumer_id}
    }
    switch (type) {
        case 'paid':
            const coundDataPaid = await prisma.orders.count({
                where: {
                    status_payment: 'paid',
                    AND: {
                        ...isSeller,
                    }
                }
            })
            return coundDataPaid;
        case 'process':
            const countDataProcess = await prisma.orders.count({
                where: {
                    status_payment: 'process',
                    AND: {
                        ...isSeller,
                    }
                }
            })
            return countDataProcess;
        case 'sent':
            const countDataSent = await prisma.orders.count({
                where: {
                    status_payment: 'sent',
                    AND: {
                        ...isSeller,
                    }
                }
            })
            return countDataSent;
        case 'complate':
            const countDataComplate = await prisma.orders.count({
                where: {
                    status_payment: 'complate',
                    AND: {
                        ...isSeller,
                    }
                }
            })
            return countDataComplate;
        case 'cancel':
            const countDataCancel = await prisma.orders.count({
                where: {
                    status_payment: 'cancel',
                    AND: {
                        ...isSeller,
                    }
                }
            })
            return countDataCancel;
        case 'all':
            const countDataAll = await prisma.orders.count({
                where: {
                    ...isSeller,
                }
            })
            return countDataAll;
        default:
            // const countData = await prisma.orders.count({
            //     where: {
            //         seller_id: seller_id,
            //     },
            // });
            return `No data for ${type}`;
    }
}

exports.updateStatusOrder = async (idOrder, data) => {
    if(data.type === 'cancel' || data.type === 'complate') {
        const order = await prisma.orders.update({
            where: {
                id: idOrder,
            },
            data: {
                status_payment: data.type,
                update_at: new Date().toISOString()
            }
        })
        return order;       
    } else {
        const order = await prisma.orders.update({
            where: {
                id: idOrder,
            },
            data: {
                status_payment: data.type,
            }
        })
        return order;
    }
}

exports.getDetailsOrder = async (idOrder) => {
    const order = await prisma.orders.findMany({
        where: {
            id: idOrder,
        },
        select: {
            id: true,
            created_at: true,
            update_at: true,
            transaction_id: true,
            status_payment: true,
            cart: {
                select:{
                    quantity: true,
                    total_price: true,
                    shipping: true,
                    products: {
                        select: {
                            product_name: true,
                            product_images: true,
                        }
                    }
                }
            },
            checkouts:{
                select: {
                    name: true,
                    phone_number: true,
                    address: true,
                    payments: {
                        select: {
                            bank_account: true,
                            logo: true,
                            payment_name: true,
                        }
                    },
                }
            },
            users_orders_custumer_idTousers: {
                select: {
                    username: true,
                    profiles: {
                        select: {
                            full_name: true,
                            image: true,
                            phone_num: true,
                        }
                    }
                }
            },
            users_orders_seller_idTousers: {
                select: {
                    profiles: {
                        select: {
                            store_name: true,
                            image: true,
                            phone_num: true,
                        }
                    }
                }
            },
        }
    })
    return order;
}