const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1}); //populate together with the user

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})

router.get(`/:id`, async (req, res) =>{
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ 
        path: 'orderItems', populate: {  //since orderItems is an array it needs to be populated this way
            path : 'product', populate: 'category'} //since product is an array it needs to be populated this way
        });

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
})

router.post('/', async (req,res)=>{

        //create the orderitems and attach them to the order
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{ //loop through the orderItems array which are sent from the user ->it returns a promise, and we combine them with promise.all, they will be resolved before we create the order
        let newOrderItem = new OrderItem({ //for every item in the orderItems create a new OrderItem 
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save(); //save each new order item to the database

        return newOrderItem._id; //we only want to use the id's, so return only the id of the new order item, this will connect the order to the order item in the OrderItem table
    }))
    const orderItemsIdsResolved =  await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{ //for the total price loop through the order items and calculte the sum of the price, it is an array of total prices for every order item
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price'); //get back the order item but populted only with the price
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a +b , 0);  //sum the items of the array, initial value is 0

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order)
    return res.status(400).send('the order cannot be created!')

    res.send(order); //send the order to the frontend
})

//update the status of the order
router.put('/:id',async (req, res)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true}
    )

    if(!order)
    return res.status(400).send('the order cannot be update!')

    res.send(order);
})


router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})



router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Order.aggregate([ //aggregates (joins) the tables inside into one
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}} //name the filed we want to return to the API, it is totalsales, and it is the sum of the field named "totalPrice"
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }



    res.send({totalsales: totalSales.pop().totalsales}) //totalSales is an array of objects, I get the last item (actually it has only one item), and from that object item get the totalsales item
})



router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Order.countDocuments((count) => count)

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
})

//get the orders of a user
router.get(`/get/userorders/:userid`, async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
})



module.exports =router;