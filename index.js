const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5000;

// use of mileware
app.use(cors());
app.use(express.json());

// user and password and connection part
const uri = "mongodb+srv://my-mongodb-user1:7GHnHbSl0NiCgp2O@cluster0.yw3x3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async await system 
async function run() {
    try {
        await client.connect();

        // create database and collection 
        const database = client.db('foodCluster')
        const usersCollection = database.collection('users')


        // GET API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({})
            const users = await cursor.toArray();
            res.send(users)
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await usersCollection.findOne(query)

            console.log('load user of id', id)
            res.send(user)
        })

        // POST API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser)
            console.log('this is new User', req.body)
            console.log(result, 'result')
            res.json(result)
        });

        // UPDATE or PUT API
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query);

            console.log('delete user', id, result)
            res.json(result)
        })
        //
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('success fully get request (crud)');
});

app.listen(port, () => {
    console.log('listening to-', port)
})












// const user ='my-mongodb-user1'
// password = 7GHnHbSl0NiCgp2O