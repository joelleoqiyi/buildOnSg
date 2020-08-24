module.exports =  {
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