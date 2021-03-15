exports.addTransactions = {
    required: ["transactions"],
    allOf: [{
        properties: {
            "transactions": {type: "number"}
        },
        additionalProperties: false
    }]
};

