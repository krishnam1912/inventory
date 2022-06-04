const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');
const res = require('express/lib/response');
app.use(methodOverride('_method'));


mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.get('/products', async (req, res) => {

    const products = await Product.find({})
    //console.log(p)
    // res.send('All are here') 
    res.render('products/index', { products });
})
app.get('/products/new', (req, res) => {

    res.render('products/new');
})
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct.id}`);
})
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show', { product });

})
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    //console.log(product);
    res.render('products/edit', { product });
    //res.send("hi");
})
app.put('/products/:id', async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    // const prod
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });


    res.redirect(`/products/${product._id}`);
})
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    console.log("id");
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
    //res.send("Hidsvbjsgv");
})
app.listen(3000, () => {
    console.log("App is Listening on port 3000");
})
