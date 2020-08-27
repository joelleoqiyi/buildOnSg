const AWS = require('aws-sdk');
const express = require ('express');

AWS.config.update({
    region: "us-east-1"
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const dynamoDB2 = new AWS.DynamoDB.DocumentClient()
const sesv2 = new AWS.SESV2({apiVersion: '2019-09-27'});
const bodyParser = require('body-parser');
const { v4 : uuid } = require('uuid');
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.json({
        "message": uuid()
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username ?? null;
    const password = req.body.password ?? null;
    if (!username || !password) {
        res.json({
            "error": "invalid input"
        })
        res.end(); 
        return;
    } 
    const params = {
        "TableName": "loginDetails",
        "Key": {
            "userID": {
                "S": username
            }
        },
        "ProjectionExpression": "userPassword",
        "ConsistentRead": true,
        "ReturnConsumedCapacity": "NONE"
    }

    dynamodb.getItem(params, (err, { Item : data }) => {
        if (err) console.log(err.stack)
        else {
            const resPassword = data.userPassword.S ?? null
            if (resPassword && resPassword === password) {
                res.json({
                    "success": "loggedIn"
                })
            } else {
                res.json({
                    "failure": "password wrong/ username doesnt exist"
                })
            }
        }
    })
});

app.get('/retrieveSpecific', (req, res) => {
    const params = {
        "TableName": "visitorDetails",
        "Key": {
            "visitingID": {
                "S": "7bb25b5f-6363-4fa5-a0dc-156f9e54253f"
            },
            "visitingDate": {
                "S": "2020-08-29"
            }
        },
        "ProjectionExpression":"visitor",
        "ConsistentRead": true,
        "ReturnConsumedCapacity": "TOTAL"
    }

    dynamodb.getItem(params, (err, data) => {
        if (err) console.log(err.stack)
        else console.log(data.Item.visitor.M.firstName)
    })
})

app.post('/reservation', (req, res) => {
    const details = {
        "visitingDate": req.body.date ?? null,
        "firstName": req.body.firstName ?? null,
        "lastName": req.body.lastName ?? null,
        "NRIC": req.body.nric ?? null,
        "emailAddress": req.body.email ?? null,
        "relationship": req.body.relationship ?? null,
        "address": req.body.address ?? null,
        "patientFirstName": req.body.patientFirstName ?? null,
        "patientLastName": req.body.patientLastName ?? null,
        "patientWard": req.body.ward ?? null, 
        "patientBed": req.body.bed ?? null,
        "uuid": uuid()
    }
    //lets assume that there is all greatness in people and no false value is given. not implementing any checks
    if (!Object.values(details).includes(null) || !Object.values(details).includes("")) {
        const params = {
            "TableName": "visitorDetails",
            "Item": {
                "visitingID": {
                    "S": details.uuid //lets also assume that uuid does its job properly. 
                },
                "visitingDate": {
                    "S": details.visitingDate
                },
                "visitor": {
                    "M": {
                        "firstName": {
                            "S": details.firstName
                        },
                        "lastName": {
                            "S": details.lastName
                        },
                        "NRIC": {
                            "S": details.NRIC
                        },
                        "emailAddress": {
                            "S": details.emailAddress
                        },
                        "relationship": {
                            "S": details.relationship
                        },
                        "address": {
                            "S": details.address
                        },
                        "checkInDetails": {
                            "M": {
                                "checkedIn": {
                                    "BOOL": false
                                },
                                "checkedOut": {
                                    "BOOL": false
                                },
                                "checkedInTiming": {
                                    "S": "null"
                                },
                                "checkedOutTiming": {
                                    "S": "null"
                                }
                            }
                        }
                    }
                },
                "patientDetails": {
                    "M": {
                        "firstName": {
                            "S": details.patientFirstName
                        },
                        "lastName": {
                            "S": details.patientLastName
                        },
                        "ward": {
                            "S": details.patientWard
                        },
                        "bed": {
                            "S": details.patientBed
                        },
                    }
                }
            }
        }

        dynamodb.putItem(params, (err, data) => {
            if (data === {}){
                res.json({
                    "success": "reservation.",
                    "payload": details.uuid
                })
            }
        })
    } else {
        res.json({
            "error": "invalid input"
        })
    }

})


app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});