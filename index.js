const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const fileUpload = require('express-fileupload');;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfwri.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());



app.get('/', (req, res) => {
    res.send("Hello WOrld!")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    
    const serviceCollection = client.db("cleanBD").collection("services");
    const adminCollection = client.db("cleanBD").collection("admins");
    const reviewCollection = client.db("cleanBD").collection("reviews");
    const bookingCollection = client.db("cleanBD").collection("bookings");
    const testimonialCollection = client.db("cleanBD").collection("testimonials");

    
    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        serviceCollection.insertOne({ name, description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/AddReview', (req, res) => {
        const file = req.files.file;
        const userName = req.body.userName;
        const review = req.body.review;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        reviewCollection.insertOne({ userName, review, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/AddTestimonial', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const title = req.body.title;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        testimonialCollection.insertOne({ name, title, description , image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addOrder', (req, res) => {
        const appointment = req.body;
        appointmentCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/bookingData', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // app.get('/orders', (req, res) => {
    //     appointmentCollection.find({})
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })
    
    app.get('/testimonials', (req, res) => {
        testimonialCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    
    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/addBooking', (req, res) => {
        const appointment = req.body;
        bookingCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/allOrders', (req, res) => {
        bookingCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/bookings', (req, res) => {
        const email = req.body.email;
        bookingCollection.find({ email: email })
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addAdmin', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        adminCollection.insertOne({ name, email, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })
    
   

});


app.listen((process.env.PORT || port), () => {
    console.log(`Example app listening at http://localhost:${port}`)
})