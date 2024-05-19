const express = require('express')

const  router = express.Router()

const ordersController = require('../controllers/ordersController')

router.get('/payment',ordersController.payment)

router.get('/',ordersController.getAllOrders)

router.post('/',ordersController.createOrder)

router.delete('/:orderId',ordersController.deleteOrder)

router.put('/:orderId',ordersController.editOrder)


router.get('/byshop/:shopId', ordersController.getOrdersByShop)

module.exports =router

