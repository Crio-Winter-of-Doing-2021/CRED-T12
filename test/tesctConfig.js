const cardBody = {
    number: "4024007186152863",
    bank: "jest",
    expiaryDate: {
        month: "3",
        year: "22"
    },
    name: "test-jest",
    cvc: "456"
}

const userBody = {
    email: 'test@gmail.com',
    password: 'testPassword',
    username: 'test-username'
}

const loginBody = {
    email: 'test@gmail.com',
    password: 'testPassword'
}

const transactionBody = {
    transactions: 2
}

module.exports = {
    'cardBody': cardBody,
    'userBody': userBody,
    'loginBody': loginBody,
    'transactionBody': transactionBody
}