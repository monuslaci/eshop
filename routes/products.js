const {
    Product
} = require("../models/product")
const { Category } = require('../models/category');
const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();



//needs the async because it will have asynchronous operation -> it will need to wait for the results from the db
router.get("/", async (req, res) => {

    const productList = await Product.find(); //just send the productList to the frontend once it is filled

    if (!productList) { //if there was a problem, and there is no product list
        res.status(500).json({
            success: false
        });
    }

    res.send(productList);

});


//get a particular product by ID
router.get("/", async (req, res) => {

    const productList = await Product.find(); //just send the productList to the frontend once it is filled

    if (!productList) { //if there was a problem, and there is no product list
        res.status(500).json({
            success: false
        });
    }

    res.send(productList);

});


//post new product
router.post("/", async (req, res) => {
    //Check if the category exists or not
    const category= await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid category!");

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });
    //save the product, it returnes a promise with a document
    product.save()
        .then((createdProduct => {
            res.status(201).json(createdProduct); //return the created product in json format, to see it on the frontend
        }))
        .catch((err) => {
            res.status(500).json({ //create an object to be sent in case of error
                error: err,
                success: false, //this flag can be used later
                message: "Product could not be saved"
            });
        })
});

module.exports = router;