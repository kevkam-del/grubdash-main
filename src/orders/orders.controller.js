const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// Middleware to validate dishes in the order
function validateDishes(req, res, next) {
    const { data: { dishes } } = req.body;
    if (Array.isArray(dishes) && dishes.length > 0) {
        next();
    } else {
        next({
            status: 400,
            message: `Order must include at least one dish`
        });
    }
}

// Middleware to validate order status
function validateStatus(req, res, next) {
    const { data: { status } } = req.body;
    const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];
    if (status && validStatuses.includes(status.toLowerCase())) {
        next();
    } else {
        next({
            status: 400,
            message: `Order must have a status of ${validStatuses.join(", ")}`
        });
    }
}

// Middleware to validate dish quantity in the order
function validateQuantity(req, res, next) {
    const { data: { dishes } } = req.body;
    for (let index = 0; index < dishes.length; index++) {
        const { quantity } = dishes[index];
        if (typeof quantity !== "number" || quantity <= 0 || !Number.isInteger(quantity)) {
            return next({
                status: 400,
                message: `Dish ${index} must have a quantity that is an integer greater than 0`
            });
        }
    }
    next();
}

// Middleware to validate request body params by property name
function validateReqBody(property) {
    return function (req, res, next) {
        const { data } = req.body;
        if (data[property]) {
            next();
        } else {
            next({
                status: 400,
                message: `Order must include a ${property}`
            });
        }
    };
}

// Middleware to check if orderId exists
function orderIdExists(req, res, next) {
    const orderId = req.params.orderId;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
        res.locals.foundOrder = foundOrder;
        next();
    } else {
        next({
            status: 404,
            message: `Order id does not match route id. Order, Route: ${orderId}.`
        });
    }
}

// Middleware to validate order id
function idPropertyIsValid(req, res, next) {
    const orderId = req.params.orderId;
    const { data: { id } = {} } = req.body;

    if (!id || id === orderId) {
        next();
    } else {
        next({
            status: 400,
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`
        });
    }
}

// Create a new order
function create(req, res, next) {
    const { data: { deliverTo, mobileNumber, status, dishes } } = req.body;

    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status,
        dishes
    };

    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

// Get order by orderId
function read(req, res, next) {
    const foundOrder = res.locals.foundOrder;
    res.status(200).json({ data: foundOrder });
}

// Get all the orders
function list(req, res, next) {
    res.status(200).json({ data: orders });
}

// Update order by orderId
function update(req, res, next) {
    const { data: { status, deliverTo } } = req.body;
    const foundOrder = res.locals.foundOrder;

    if (foundOrder.status === "delivered") {
        next({
            status: 400,
            message: 'A delivered order cannot be changed'
        });
    } else {
        foundOrder.status = status;
        foundOrder.deliverTo = deliverTo;
        res.status(200).json({ data: foundOrder });
    }
}

// Check if the order status is pending
function checkForPendingStatus(req, res, next) {
    const foundOrder = res.locals.foundOrder;
    if (foundOrder.status !== "pending") {
        next({
            status: 400,
            message: 'Order status is not pending'
        });
    } else {
        next();
    }
}

// Delete order by orderId
function destroy(req, res, next) {
    const orderId = req.params.orderId;
    const orderIndex = orders.findIndex((order) => order.id === Number(orderId));
    orders.splice(orderIndex, 1);
    res.sendStatus(204);
}

module.exports = {
    read: [
        orderIdExists,
        read
    ],
    create: [
        validateReqBody("deliverTo"),
        validateReqBody("mobileNumber"),
        validateDishes,
        validateQuantity,
        create
    ],
    update: [
        orderIdExists,
        idPropertyIsValid,
        validateReqBody("status"),
        validateReqBody("deliverTo"),
        validateReqBody("mobileNumber"),
        validateDishes,
        validateQuantity,
        validateStatus,
        update
    ],
    delete: [
        orderIdExists,
        checkForPendingStatus,
        destroy
    ],
    list
};
