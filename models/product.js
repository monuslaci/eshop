const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price : {
        type: Number,
        default:0
    },
    category: { //link to the Category table
        type: mongoose.Schema.Types.ObjectId, //so it means that I will have to pass the ID
        ref: 'Category', //it tells that the refrence is the Category schema, so the ID will be connected to the categories schema
        required:true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

//create a virtual field called id from the field _id
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

//enable the virtual field called id
productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model("Product", productSchema);