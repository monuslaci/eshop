const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{

    const categoryList = await Category.find(); //just send the productList to the frontend once it is filled

    if (!categoryList) { //if there was a problem, and there is no product list
        res.status(500).json({
            success: false
        });
    }

    res.send(categoryList);

});


module.exports=router;