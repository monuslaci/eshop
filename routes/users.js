const {User}=require("../models/user")
const express = require("express");
const router=express.Router();

router.get("/", async (req, res) => {

    const userList = await User.find(); //just send the productList to the frontend once it is filled

    if (!userList) { //if there was a problem, and there is no product list
        res.status(500).json({
            success: false
        });
    }

    res.send(userList);

});


module.exports=router;