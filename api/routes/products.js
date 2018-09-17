const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

// GET ALL PRODUCTS
router.get('/', (req, res, next) => {

    Product.find()
        .select('_id name price')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});
// POST NEW PRODUCT
router.post('/', (req, res, next) => {
    // DEFINITION OF PRODUCT
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    // CREATION OF PRODUCT
    product.save()
        .then(result => {

            res.status(201).json({
                message: "Create product succesfully",
                product: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });


});
// GET SINGLE PRODUCT BY ID
router.get('/:productId', (req, res, next) => {

    const id = req.params.productId;

    Product.findById(id)
        .select('_id name price')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all products',
                        url: 'http://localhost:3000/products/'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
})

// UPDATE SINGLE PRODUCT BY ID
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    // ESTÁ A ACTUALIZAR DADOS NA BD
    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
// DELETE SINGLE PRODUCT BY ID
router.delete('/:productId', (req, res, next) => {

    const id = req.params.productId;

    Product.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    data: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        });
});


module.exports = router;