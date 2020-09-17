const AWS = require('aws-sdk');
const express = require ('express');

AWS.config.update({
    region: "us-east-1"
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const sesv2 = new AWS.SESV2({apiVersion: '2019-09-27'});
const ses = new AWS.SES({apiVersion: '2010-12-01'});
const bodyParser = require('body-parser');
const qrcode = require('qrcode');
const { v4 : uuid } = require('uuid');
const cors = require('cors')
const port = process.env.PORT || 3000;

const app = express();
app.options(cors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function declarationCheck (req, res, next) {
    const check = {
        "de1" : req.body.de1, 
        "de2" : req.body.de2, 
        "de3" : req.body.de3,
    };
    Object.entries(check).forEach((i) => {
        req.body[i[0]] = (i[1] === "true" ||i[1] === true) ? true : false
    })
    if (!(Object.values(req.body).includes(false))){
        const details = {
            "declaration1": req.body.de1,
            "declaration2": req.body.de2,
            "declaration3": req.body.de3
        }
        req.details = details;
        next()
    }
    else res.send("declaration invalid")
}

function getDetails (dc, req, res, next) {
    const details = {
        "visitingDate": req.body.date || null,
        "firstName": req.body.firstName || null,
        "lastName": req.body.lastName || null,
        "NRIC": req.body.nric || null,
        "emailAddress": req.body.email || null,
        "relationship": req.body.relationship || null,
        "address": req.body.address || null,
        "patientFirstName": req.body.patientFirstName || null,
        "patientLastName": req.body.patientLastName || null,
        "patientWard": req.body.ward || null, 
        "patientBed": req.body.bed || null,
        "visitingID": (dc) ? (req.body.id || null) : uuid()
    }

    console.log(details)
    if (!Object.values(details).includes(null) && !Object.values(details).includes("")) {
        if (req.details) Object.assign(req.details, details);
        else req.details = details;
        next();
    } else {
        res.send("input invalid")
    }
}

app.get('/', (req, res) => {
    const x = req.body.x || null
    xx = "l"
    y = "x"
    const replacementTemplateData = `{\"firstName\":\"${x}\",\"formLink\":\"${y}\"}`
    console.log(typeof replacementTemplateData, )
    res.send(replacementTemplateData)
})

app.post('/login/:user', (req, res) => {
    const username = req.body.username || null;
    const password = req.body.password || null;
    const fullName = req.body.name || null;
    const userTypes = ["staff", "patient"];
    const user = userTypes.includes(req.params.user) ? req.params.user : null;

    const params = (user == "staff")
        ?   {
            "TableName": "adminDetails",
            "ConsistentRead": true,
            "ExpressionAttributeNames": {
                "#uid": "userID",
                "#p": "userPassword",
                "#r": "roomStats"
            },
            "ExpressionAttributeValues": {
                ":u": {
                    "S": username
                },
                ":p": {
                    "S": password
                }
            },
            "FilterExpression": "#uid = :u AND #p = :p",
            "ProjectionExpression": "#r",
        } : {
            "TableName": "patientDetails",
            "ConsistentRead": true,
            "ExpressionAttributeNames": {
                "#uid": "userID",
                "#fn": "firstName",
                "#ln": "lastName",
                "#b": "bed",
                "#w": "ward"
            },
            "ExpressionAttributeValues": {
                ":u": {
                    "S": username
                },
                ":fn": {
                    "S": fullName.substr(0, fullName.indexOf(" "))
                },
                ":ln": {
                    "S": fullName.substr(fullName.indexOf(" ")+1)
                }
            },
            "FilterExpression": "#uid = :u AND #fn = :fn AND #ln = :ln",
            "ProjectionExpression": "#b, #w",
        };
    console.log(params)
    dynamodb.scan(params).promise()
        .then(({ Items: data }) => {
            console.log(data)
            const result = data.map((i) => {
                if (user === "staff"){
                    const roomStats = i.roomStats.M;
                    Object.keys(roomStats).forEach((room) => {
                        roomStats[room] = roomStats[room].N
                    })
                    return roomStats
                } else {
                    Object.keys(i).forEach((d) => {
                        i[d] = i[d].S
                    })
                    return i
                }
            })
            res.header("Access-Control-Allow-Origin", "http://localhost:1234")
            res.header('Origin', "*")
            res.send(result)
        })
        .catch((err) => {
            res.send(err)
        })
});

app.post('/snapshot/:methodUsed', (req, res) => {
    const allowedMethods = ["REQ", "UPDATE"];
    const snapshotID = req.body.id || null;
    const newSnapshot = req.body.snapshot || null;
    const method = allowedMethods.includes(req.params.methodUsed) ? req.params.methodUsed : null;

    if (method == "REQ" && snapshotID) {
        const params =   {
            "TableName": "websiteSnapshot",
            "ConsistentRead": true,
            "ExpressionAttributeNames": {
                "#sid": "snapshotID",
                "#s": "snapshot"
            },
            "ExpressionAttributeValues": {
                ":sid": {
                    "S": snapshotID
                }
            },
            "FilterExpression": "#sid = :sid",
            "ProjectionExpression": "#s",
        } 

        dynamodb.scan(params).promise()
        .then(({ Items: data }) => {
            res.send(data[0].snapshot.S)
        })
        .catch((err) => {
            res.send(err)
        })

    } else if (method == "UPDATE" && snapshotID && newSnapshot) {

        const params = {
            "TableName": "websiteSnapshot",
            "Key": {
                "snapshotID": {
                    "S": snapshotID
                }
            },
            "ExpressionAttributeNames": {
                "#s": "snapshot"
            },
            "ExpressionAttributeValues": {
                ":s": {
                    "S": newSnapshot
                }
            },
            "UpdateExpression":"SET #s = :s",
            "ReturnValues": "UPDATED_NEW"
        }

        dynamodb.updateItem(params, (err, data) => {
            if (err) {
                res.send("something went wrong oh no")
            } else {
                res.send('Successfully updated!')
            }
        }) 
    }
});

app.post('/healthdeclaration', declarationCheck, (req, res, next) => {
    //lets assume that there is all greatness in people and no false value is given. not implementing any checks
    getDetails(true, req, res, next);
}, (req, res) => {
    const details = req.details;
    const params = {
        "TableName": "visitorDetails",
        "Key": {
            "visitingID": {
                "S": details.visitingID
            },
            "visitingDate": {
                "S": details.visitingDate
            }
        },
        "ExpressionAttributeNames": {
            "#cID": "checkInID",
            "#de1": "declaration1",
            "#de2": "declaration2",
            "#de3": "declaration3",
            "#V": "visitor",
            "#hd": "healthDeclaration",
            "#cid": "checkInDetails"
        },
        "ExpressionAttributeValues": {
            ":a1": {
                "BOOL": details.declaration1
            },
            ":a2": {
                "BOOL": details.declaration2
            },
            ":a3": {
                "BOOL": details.declaration3
            },
            ":c": {
                "S": uuid()
            }
        },
        "UpdateExpression":"SET #V.#hd.#de1 = :a1, #V.#hd.#de2 = :a2, #V.#hd.#de3 = :a3, #V.#cid.#cID = :c",
        "ReturnValues": "UPDATED_NEW"
    }

    dynamodb.updateItem(params, (err, data) => {
        if (err) {
            res.send("something went wrong oh no")
        } else {
            const checkInID = data.Attributes.visitor.M.checkInDetails.M.checkInID.S;
            qrcode.toDataURL(checkInID, (err, url) => {
                const img = Buffer.from(url.replace(/^data:image\/png;base64,/, ''), 'base64');
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': img.length
                  });
                res.end(img);
            })
        }
    }) 
});

app.post('/reservation', (req, res, next) => {
    getDetails(false, req, res, next);
    //lets assume that there is all greatness in people and no false value is given. not implementing any checks
}, (req, res) => {
    const details = req.details;
    const params = {
        "TableName": "visitorDetails",
        "Item": {
            "visitingID": {
                "S": details.visitingID //lets also assume that uuid does its job properly. 
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
                    "emailSent": {
                        "BOOL": false
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
                            },
                            "checkInID": {
                                "S": "null"
                            }
                        }
                    },
                    "healthDeclaration": {
                        "M": {
                            "declaration1": {
                                "BOOL": false
                            },
                            "declaration2": {
                                "BOOL": false
                            },
                            "declaration3": {
                                "BOOL": false
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
        if (data){
            res.json({
                "success": "reservation.",
                "payload": details.visitingID
            })
        } else {
            res.send(err)
        }
    })
})

app.get('/retrieveDate', async (req, res) => {
    const d = new Date(new Date().getTime() - 28800000); //(+8hrs or + 28800000 depending on server location)
    const queryParams = {
        "TableName": "visitorDetails",
        "ConsistentRead": true,
        "ExpressionAttributeNames": {
            "#V": "visitor",
            "#vd": "visitingDate",
            "#vs": "emailSent",
            "#PD": "patientDetails"
        },
        "ExpressionAttributeValues": {
            ":e": {
                "S": `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
            },
            ":s": {
                "BOOL": false
            }
        },
        "FilterExpression": "#vd = :e AND #V.#vs = :s",
        "ProjectionExpression": "#V, #vd, #PD",
    };

    const detailsList = await dynamodb.scan(queryParams).promise()
        .then((data) => {
            return data.Items.map((item) => {
                if (!item.visitor.M.emailAddress.S || !item.visitor.M || !item.patientDetails.M) {
                    return null
                } else {
                    const visitor = item.visitor.M || null;
                    const patient = item.patientDetails.M || null;
                    
                    const formLink = `https://google.com?fn=${visitor.firstName.S}&ln=${visitor.lastName.S}&nric=${visitor.NRIC.S}&rs=${visitor.relationship.S}&pfn=${patient.firstName.S}&pln=${patient.lastName.S}&pw=${patient.ward.S}&pb=${patient.bed.S}`;
                    const replacementTemplateData = `{\"firstName\":\"${visitor.firstName.S}\",\"formLink\":\"${formLink}\"}`;

                    const emailTemplateEntries = {
                        "Destination": {
                            "ToAddresses": [String(visitor.emailAddress.S)]
                        },
                        "ReplacementEmailContent": {
                            "ReplacementTemplate": {
                                "ReplacementTemplateData": String(replacementTemplateData)
                            }
                        }
                    };

                    return emailTemplateEntries;
                }
            }).filter((f) => {
                return (f !== undefined && f !== null) //removes null values
            })
        })

    const emailParams = {
        "BulkEmailEntries": detailsList,
        "DefaultContent": {
            "Template": {
                "TemplateName": "healthDeclarationEmailTemplate",
                "TemplateData": `{\"firstName\":\"Oh no!\",\"formLink\":\"Something went wrong!\"}`
            }
        },
        "FromEmailAddress": "farrerpark.sg@gmail.com",
        "ReplyToAddresses": ["farrerpark.sg@gmail.com"]
    }

    sesv2.sendBulkEmail(emailParams).promise()
        .then((data) => {
            res.send(data)
        })
})

app.get('/retrieveDateV1', async (req, res) => {
    const d = new Date(new Date().getTime()); //(+8hrs or + 28800000 depending on server location)
    const queryParams = {
        "TableName": "visitorDetails",
        "ConsistentRead": true,
        "ExpressionAttributeNames": {
            "#V": "visitor",
            "#VID": "visitingID",
            "#vs": "emailSent",
            "#PD": "patientDetails",
            "#vd": "visitingDate"
        },
        "ExpressionAttributeValues": {
            ":e": {
                "S": `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
            },
            ":s": {
                "BOOL": false
            }
        },
        "FilterExpression": "#vd = :e AND #V.#vs = :s",
        "ProjectionExpression": "#V, #VID, #PD, #vd",
    };

    const detailsList = await dynamodb.scan(queryParams).promise()
        .then((data) => {
            const emailDetails =  data.Items.map((item) => {
                if (!item.visitor.M.emailAddress.S || !item.visitor.M || !item.patientDetails.M) {
                    return null
                } else {
                    const visitor = item.visitor.M || null;
                    const patient = item.patientDetails.M || null;
                    const visitingID = item.visitingID.S || null;
                    const visitingDate = item.visitingDate.S || null;
                    const emailAddress = visitor.emailAddress.S.trim().replace(/\.+/g, '-').replace(/@+/g, '_').toLowerCase();
                    const address = visitor.address.S.trim().replace(/\s+/g, '-').toLowerCase();

                    const formLink = `http://d19c6e337bapzj.cloudfront.net/declaration.html?id=${visitingID}&fn=${visitor.firstName.S}&ln=${visitor.lastName.S}&nric=${visitor.NRIC.S}&rs=${visitor.relationship.S}&d=${visitingDate}&e=${emailAddress}&a=${address}&pfn=${patient.firstName.S}&pln=${patient.lastName.S}&pw=${patient.ward.S}&pb=${patient.bed.S}`;
                    const replacementTemplateData = `{\"firstName\":\"${visitor.firstName.S}\",\"formLink\":\"${formLink}\",\"visitingID\":\"${visitingID}\"}`;

                    const emailTemplateEntries = {
                        "Destination": {
                            "ToAddresses": [String(visitor.emailAddress.S)]
                        },
                        "ReplacementTemplateData": String(replacementTemplateData)
                    };

                    return emailTemplateEntries;
                }
            }).filter((f) => {
                return (f !== undefined && f !== null) //removes null values
            })
            const updateDetails = data.Items.map((item) => {
                if (!item.visitor.M.emailAddress.S || !item.visitor.M || !item.patientDetails.M) {
                    return null
                } else { 
                    const visitingID = item.visitingID.S || null;
                    const visitingDate = item.visitingDate.S || null;
                    
                    return {visitingID, visitingDate}
                }
            })
            return [emailDetails, updateDetails]
        })

    console.log(detailsList)
    if (detailsList[0].length > 0){

        const emailParams = {
            "Destinations": detailsList[0],
            "Template": "healthDeclarationEmailTemplate",
            "DefaultTemplateData": `{\"firstName\":\"Oh no!\",\"formLink\":\"Something went wrong!\"}`,
            "Source": "farrerpark.sg@gmail.com",
            "ReplyToAddresses": ["farrerpark.sg@gmail.com"]
        }

        detailsList[1].map((details) => {
            const updateParams = {
                "TableName": "visitorDetails",
                "Key": {
                    "visitingID": {
                        "S": details.visitingID
                    },
                    "visitingDate": {
                        "S": details.visitingDate
                    }
                },
                "ExpressionAttributeNames": {
                    "#V": "visitor",
                    "#vs": "emailSent",
                },
                "ExpressionAttributeValues": {
                    ":s": {
                        "BOOL": true
                    }
                },
                "UpdateExpression":"SET #V.#vs = :s",
                "ReturnValues": "UPDATED_NEW"
            }

            dynamodb.updateItem(updateParams, (err, data) => {
                if (err) res.send("something went wrong oh no")
            }) 

        })

        ses.sendBulkTemplatedEmail(emailParams).promise()
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    } else {
        res.send("nth to send bruh")
    }

})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});