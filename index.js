const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Product = require('./models/product');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/api_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


app.get('/',(req,res)=>{
    res.json({"message":"node API is in the making"})
})

//get the data
app.get('/products', async (req,res)=>{
    try {
        const product = await Product.find();
        res.status(200).json(product)
        console.log(product);
    } catch (error) {
        res.status(500).json(error.message)
    }
})

// post the data
app.post('/products', async (req,res)=>{
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product)
        console.log(product);

    } catch (error) {
        res.status(500).json(error.message)
    }
})

//update the data
app.put('/products/:id',async (req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id,req.body);
        if(!product){
            return res.status(404).json({message:`cannot find a product by id ${id}`})
        }
        const newProduct = await Product.findById(id);
        res.status(200).json(newProduct);
        console.log(newProduct);
    } catch (error) {
        res.status(500).json(error.message)
    }
})

//delete the data
app.delete('/products/:id', async (req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message:`product is not found by id ${id}`})
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error.message)
    }
})

const port = 5000;
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
})