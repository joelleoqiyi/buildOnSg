const AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const params = {
    "TableName": "visitorDetails",
    "Item": {
        "visitingID": {
            "S": visitingID
        },
        "date": {
            "S": date
        },
        "visitor": {
            "M": {
                "firstName": {
                    "S": visitorFirstName
                },
                "lastName": {
                    "S": visitorLastName
                },
                "NRIC": {
                    "S": visitorNRIC
                },
                "phoneNumber": {
                    "N": visitorPhoneNumber
                },
                "relationship": {
                    "S": visitorRelationship
                },
                "address": {
                    "S": visitorAddress
                },
                "checkInDetails": {
                    "M": {
                        "checkedIn": {
                            "BOOL": visitorCheckedIn
                        },
                        "checkedOut": {
                            "BOOL": visitorCheckedOut
                        },
                        "checkedInTiming": {
                            "S": visitorCheckedInTiming
                        },
                        "checkedOutTiming": {
                            "S": visitorCheckedOutTiming
                        }
                    }
                }
            }
        },
        "patientDetails": {
            "M": {
                "firstName": {
                    "S": patientFirstName
                },
                "lastName": {
                    "S": patientLastName
                },
                "ward": {
                    "S": patientWard
                },
                "bed": {
                    "S": patientBed
                },
            }
        }
    }
}