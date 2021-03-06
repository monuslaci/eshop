//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("public"));
const morgan = require("morgan");
const mongoose = require('mongoose');
const api = process.env.API_URL;
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


//Enable CORS
const cors=require("cors");
app.use(cors());
app.options("*", cors());

//--------Middleware-----
//middleware for parsing json objects
app.use(bodyParser.json());
//middleware for parsing bodies from URL
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan("tiny"));
//with this any request will come will be asked authentication JWT -> express Jwt will decide if the user can use the api based on the token or not
app.use(authJwt());
//handle if there are any errors in authentication
app.use(errorHandler);


//------Routes------
//Products
const productsRouter=require("./routes/products")
app.use(`${api}/products`, productsRouter);

//Categories
const categoriesRoutes = require("./routes/categories");
app.use(`${api}/categories`, categoriesRoutes);

//Users
const usersRoutes = require("./routes/users");
app.use(`${api}/users`, usersRoutes);

//Orders
const ordersRoutes = require("./routes/orders");
app.use(`${api}/orders`, ordersRoutes);


//DB connection
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "eshopDB"
    })
    .then(() => {
        console.log("Database connection is ready.");
    })
    .catch((err) => {
        console.log(err);
    })
//mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

//Server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port 3000");
})