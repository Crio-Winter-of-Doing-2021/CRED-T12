exports.addCard = {
    required: ["cardNumber","bank","expiaryDate","nameOnCard" ],
    allOf: [{
        properties: {
            "cardNumber": {type: "string"}, 
            "bank": { type: "string" },
            "expiaryDate":{ type: "object" },
            "nameOnCard":{type: "string" }
        },
        additionalProperties: false
    }]
};

exports.payBill = {
    required: ["amount"],
    allOf: [{
        properties: {
            "amount": {type: "number"}
        },
        additionalProperties: false
    }]
};
