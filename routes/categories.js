const {
    Category
} = require('../models/category');
const express = require('express');

const router = express.Router();

router.get("/", async (req, res) => {

    const categoryList = await Category.find(); //just send the productList to the frontend once it is filled

    if (!categoryList) { //if there was a problem, and there is no product list
        res.status(500).json({
            success: false
        });
    }

    res.status(200).send(categoryList);

});

//get by ID
router.get("/:id", async (req, res) => {

    const category = await Category.findById(req.params.id); //just send the productList to the frontend once it is filled

    if (!category) { //if there was a problem, and there is no category 
        res.status(500).json({
            success: false,
            message: "The category with the given ID was not found."
        });
    }

    res.status(200).send(category);

});



router.post("/", async (req, res) => {

    //create new category model
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    //fill it with data
    category = await category.save(); //wait until category is saved, this save will return a promise with a document of category that was created

    if (!category) {
        return res.status(404).send("The category cannot be created!")
    }


    res.send(category);

})


//update category: search by ID and in the response we get the updated data
router.put("/:id", async (req, res) => {


    const category = await Category.findByIdAndUpdate(
        req.params.id, { //second parameter is an object we want to update the found category to
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        //there is an option if I want to get back the new or the original data
        {new: true}
    );

    if (!category) { //if there was a problem, and there is no category 
        res.status(400).json({
            success: false,
            message: "The category cannot be created."
        });
    }

    res.send(category);

});


//it will work in a way that the user can write in the url the id, and we catch this 
router.delete("/:categoryId", async (req, res) => {

    Category.findByIdAndDelete(req.params.categoryId)
        .then(category => {
            if (category) {
                return res.status(200).json({
                    success: true,
                    message: "Category " + category.name + " is deleted!"
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Category " + category.name + " is not found!"
                })
            }
        })
        .catch(err => {
            return res.status(400).json({
                success: false,
                error: err
            })
        })


})


module.exports = router;