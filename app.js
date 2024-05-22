//import express from 'express';
const express = require('express');

//import createClient from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
//import {createClient} from '@supabase/supabase-js'
const supabaseClient = require('@supabase/supabase-js');

//import morgan from 'morgan';
const morgan = require('morgan');

//import bodyParser from "body-parser";
const bodyParser = require('body-parser');

//import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const app = express();

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const supabase = 
    supabaseClient.createClient('https://wotqqjmgalfzmdacisow.supabase.co', 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdHFxam1nYWxmem1kYWNpc293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzMDA4MTcsImV4cCI6MjAzMDg3NjgxN30.ksxl5afwA5zC2uNIdC-bQ4pMgUmj_ZVD7fUfSSsAAC4')


app.get('/products', async (req, res) => {
    const {data, error} = await supabase
        .from('products')
        .select()
    res.send(data);
    console.log(`lists all products${data}`);
});

app.get('/products/:id', async (req, res) => {
    console.log("id = " + req.params.id);
    const {data, error} = await supabase
        .from('products')
        .select()
        .eq('id', req.params.id)
    res.send(data);

    console.log("retorno "+ data);
});

app.post('/products', async (req, res) => {
    const {error} = await supabase
        .from('products')
        .insert({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        })
    if (error) {
        res.send(error);
    }
    res.send("created!!");
    console.log("retorno "+ req.body.name);
    console.log("retorno "+ req.body.description);
    console.log("retorno "+ req.body.price);

});

app.put('/products/:id', async (req, res) => {
    const {error} = await supabase
        .from('products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        .eq('id', req.params.id)
    if (error) {
        res.send(error);
    }
    res.send("updated!!");
});

app.delete('/products/:id', async (req, res) => {
    console.log("delete: " + req.params.id);
    const {error} = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id)
    if (error) {
        res.send(error);
    }
    res.send("deleted!!")
    console.log("delete: " + req.params.id);

});

app.get('/', (req, res) => {
    res.send("Hello I am working my friend Supabase <3");
});

app.get('*', (req, res) => {
    res.send("Hello again I am working my friend to the moon and behind <3");
});

app.post('/products', async (req, res) => {
   try {
       const { data, error } = await supabase
           .from('products')
           .insert({
               name: req.body.name,
               description: req.body.description,
               price: req.body.price,
           })
       if (error) {
           throw error;
       }
       res.status(201).send("Product created successfully!");
   } catch (error) {
       res.status(500).send(error.message);
   }
});

app.delete('/products/:id', async (req, res) => {
   try {
       const { data, error } = await supabase
           .from('products')
           .delete()
           .eq('id', req.params.id)
       if (error) {
           throw error;
       }
       if (data && data.length === 0) {
           res.status(404).send("Product not found!");
       } else {
           res.status(200).send("Product deleted successfully!");
       }
   } catch (error) {
       res.status(500).send(error.message);
   }
});

app.get('/products/:identifier', async (req, res) => {
   try {
       const { identifier } = req.params;
       let query;
       if (!isNaN(identifier)) {
           // Se o parâmetro é um número, assume-se que é um ID
           query = supabase.from('products').select().eq('id', identifier);
       } else {
           // Se não, assume-se que é um nome
           query = supabase.from('products').select().ilike('name', `%${identifier}%`);
       }

       const { data, error } = await query;
       if (error) {
           throw error;
       }
       if (data && data.length === 0) {
           res.status(404).send("Product not found!");
       } else {
           res.status(200).send(data);
       }
   } catch (error) {
       res.status(500).send(error.message);
   }
});

app.put('/products/:id', async (req, res) => {
   try {
       const productId = req.params.id;
       const { newName } = req.body;

       const { error: updateError } = await supabase
           .from('products')
           .update({ name: newName })
           .eq('id', productId);

       if (updateError) {
           throw updateError;
       }

       res.status(200).send("Product name updated successfully!");
   } catch (error) {
       res.status(500).send(error.message);
   }
});

app.listen(3000, () => {
    console.log(`> Ready on http://localhost:3000`);
});