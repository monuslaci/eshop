const {
    Product
} = require("../models/product")
const {
    Category
} = require('../models/category');
const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();



//needs the async because it will have asynchronous operation -> it will need to wait for the results from the db
// router.get("/", async (req, res) => {
//     //when showing the results also show the category details connecting to the product
//     const productList = await Product.find().populate("category"); //just send the productList to the frontend once it is filled

//     if (!productList) { //if there was a problem, and there is no product list
//         res.status(500).json({
//             success: false
//         });
//     }

//     res.send(productList);

// });


//find based on category
router.get(`/`, async (req, res) =>{
    let filter = {};
    //http://localhost:3000/api/v1/products?categories=24332,3343432
    //I can catch the string after the ? with req.query.categories
    if(req.query.categories)
    {
         filter = {category: req.query.categories.split(',')} //split the query string at the ",", and store it. If the query param is empty than, the filter wont't be applied, it will be empty, too
    }

    const productList = await Product.find(filter).populate('category');

    if(!productList) {
        res.status(500).json({success: false})
    } 
    res.send(productList);
})


//get a particular product by ID
router.get("/:id", async (req, res) => {
    //populate: any connected table or field can be displayed also in the same query
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) { //if there was a problem, and there is no product list
        res.status(500).json({
            success: false
        });
    }

    res.send(product);

});

//count of products
router.get("/get/count", async (req, res) => {
    //when showing the results also show the category details connecting to the product
    const productCount = await Product.countDocuments((count) => count) //in the callback I define what to return: now only the count

    if (!productCount) { //if there was a problem, and there is no product list
        res.status(500).json({
            success: false
        });
    }

    res.send({
        productCount: productCount
    });

});


//get featured products
router.get("/get/featured/:count", async (req, res) => {
    //If the count parameter is filled than we use it otherwise it is zero
    const count = req.params.count ? req.params.count : 0;
    const featuredProducts = await Product.find({
        isFeatured: true
    }).limit(+count); //only the top x (count) number is showed (+ converts to integer)

    if (!featuredProducts) { //if there was a problem, and there is no product list
        res.status(500).json({
            success: false
        });
    }

    res.send(featuredProducts);

});


//post new product
router.post("/", async (req, res) => {
    //Check if the category exists or not
    const category = await Category.findById(req.body.category);
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



router.put("/:id", async (req, res) => {
    //Validate the ID: if valid than continue, if not return with an error
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }

    //Check if the category exists or not
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid category!");


    const product = await Product.findByIdAndUpdate(
        req.params.id, { //second parameter is an object we want to update the found category to
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
        },
        //there is an option if I want to get back the new or the original data
        {
            new: true
        }
    );

    if (!product) { //if there was a problem, and there is no category 
        res.status(500).json({
            success: false,
            message: "The product cannot be updated."
        });
    }

    res.send(product);

});



router.delete("/:productId", async (req, res) => {
    //Validate the ID: if valid than continue, if not return with an error
    if (!mongoose.isValidObjectId(req.params.productId)) {
        console.log(req.params.productId)
        return res.status(400).send('Invalid Product Id')
    }

    Product.findByIdAndDelete(req.params.productId)
        .then(product => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: "Product " + product.name + " is deleted!"
                })
            } else if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product " + product._id + " is not found!"
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                error: err
            })
        })


})





module.exports = router;