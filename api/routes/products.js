const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) =>{
    Product.find()
    .select('gameID home away book homePrice awayPrice homeSpread awaySpread homeSpreadPrice awaySpreadPrice OverTotal UnderTotal OverTotalPrice UnderTotalPrice date')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return{
                    gameID: doc.gameID,
                    home: doc.home,
                    away: doc.away,
                    home: doc.home,
                    book: doc.book,
                    homePrice: doc.homePrice,
                    awayPrice: doc.awayPrice,
                    homeSpread: doc.homeSpread,
                    awaySpread: doc.awaySpread,
                    homeSpreadPrice: doc.homeSpreadPrice,
                    awaySpreadPrice: doc.awaySpreadPrice,
                    OverTotal: doc.homeOverTotalrice,
                    UnderTotal: doc.UnderTotal,
                    OverTotalPrice: doc.OverTotalPrice,
                    UnderTotalPrice: doc.UnderTotalPrice,
                    date: doc.date,
                     request:{
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id                     
                    }
                }
            })
        }
        //if(docs.length >= 0){
            res.status(200).json(response);
        //}
        //else{
            //res.status(404).json({
           //     message: 'No entries found'
           // })
        //}
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
})

router.get("/:productId", (req, res, next) =>{
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc){
                res.status(200).json({
                    product: doc,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/products/'                     
                    }
                });
            }
            else{
                res.status(400).json({message: "No valid entry for provided ID found"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.post('/', (req, res, next) =>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        gameID: req.body.gameID,
        home: req.body.home,
        away: req.body.away,
        book: req.body.book,
        homePrice: req.body.homePrice,
        awayPrice: req.body.awayPrice,
        homeSpread: req.body.homeSpread,
        awaySpread: req.body.awaySpread,
        homeSpreadPrice: req.body.homeSpreadPrice,
        awaySpreadPrice: req.body.awaySpreadPrice,
        OverTotal: req.body.OverTotal,
        UnderTotal: req.body.UnderTotal,
        OverTotalPrice: req.body.OverTotalPrice,
        UnderTotalPrice: req.body.UnderTotalPrice,
        date: req.body.date
    });
    product
    .save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'post in /products',
            createdProduct: {
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
    
});

router.patch('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateMany({ _id: id}, { $set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Changes',
            request: {
                type: "GET",
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/', (req, res, next) =>{
    Product.deleteMany({})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'All products deleted',
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    Product.deleteOne({ _id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/',
                body: {name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

module.exports = router;
