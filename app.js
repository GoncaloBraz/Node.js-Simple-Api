const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

/* mongoose.connect('mongodb://gbraz:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-shard-00-00-fw9ms.mongodb.net:27017,node-rest-shop-shard-00-01-fw9ms.mongodb.net:27017,node-rest-shop-shard-00-02-fw9ms.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true');
 */
/* mongoose.connect('mongodb+srv://gbraz:Gb022009@node-rest-shop-fw9ms.mongodb.net/admin'); */
mongoose.connect('mongodb+srv://gbraz:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-fw9ms.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// HANDLING CORS https://www.youtube.com/watch?v=zoSJ3bNGPp0&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=5
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Widht, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which sould handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Error Handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })

})

module.exports = app;

// VIDEO
/* https://youtu.be/WDrU305J1yw?list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&t=1232 */