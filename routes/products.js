const {Product}=require("../models/product")
const express = require("express");
const mongoose = require('mongoose');
const router=express.Router();



//needs the async because it will have asynchronous operation -> it will need to wait for the results from the db
router.get(`/`, async (req, res) =>{

    const productList = await Product.find(); //just send the productList to the frontend once it is filled

    if (!productList) { //if there was a problem, and there is no product list
        res.status(500).json({
            success: false
        });
    }

    res.send(productList);

});



router.post(`/`, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var countInStock = req.body.countInStock;


    const product = new Product({
        name: name,
        image: image,
        countInStock: countInStock
    });
    //save the product, it returnes a promise with a document
    product.save()
        .then((createdProduct => {
            res.status(201).json(createdProduct); //return the created product in json format, to see it on the frontend
        }))
        .catch((err) => {
            res.status(500).json({ //create an object to be sent in case of error
                error: err,
                success: false //this flag can be used later
            });
        })
});

module.exports=router;