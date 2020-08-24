const AWS = require('./node_modules/aws-sdk');

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const params = require('./params/insertItem.js')

console.log(params)