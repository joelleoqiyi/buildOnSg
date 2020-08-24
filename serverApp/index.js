const AWS = require('aws-sdk');
const express = require ('express');

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const app = express();

const params = require('./params/insertItem.js');
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({
        "message": "i am god lol"
    })
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});