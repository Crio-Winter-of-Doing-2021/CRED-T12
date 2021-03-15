exports.signup = {
    required: ["email","password","username" ],
    allOf: [{
        properties: {
            "email": { type: "string" },
            "password":{ type: "string" },
            "username":{type: "string" }
        },
        additionalProperties: false
    }]
};

exports.login =  {
    required: ["email","password"],
    allOf: [{
        properties: {
            "email": { type: "string" },
            "password":{ type: "string" }
        },
        additionalProperties: false
    }]
};