exports.addCard = {
    required: ["number","bank","expiaryDate","name", "cvc" ],
    allOf: [{
        properties: {
            "number": {type: "string"}, 
            "bank": { type: "string" },
            "expiaryDate":{ type: "object" },
            "name":{type: "string" },
            "cvc":{type: "string" }
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
