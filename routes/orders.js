const {Order}=require("../models/order")
const express = require("express");
const router=express.Router();

router.get("/", async (req, res) => {

    const orderList = await Product.find(); //just send the productList to the frontend once it is filled

    if (!orderList) { //if there was a problem, and there is no product list
        res.status(500).json({
            success: false
        });
    }

    res.send(orderList);

});


module.exports=router;