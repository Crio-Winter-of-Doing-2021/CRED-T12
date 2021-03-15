const Ajv = require("ajv").default
const ajv = new Ajv({allErrors: true}) // options can be passed, e.g. {allErrors: true}

exports.validate = async (schema, reqBody) => {
    const validate = ajv.compile(schema)
    const valid = validate(reqBody)
    
    if (!valid) console.log(validate.errors)

    return !!valid;
}
