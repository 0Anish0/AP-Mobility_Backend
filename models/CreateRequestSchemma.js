// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const documentSchema = new mongoose.Schema({
//     filename: {
//         type: String,
//         // required: true
//     },
//     filepath: {
//         type: String,
//         // required: true
//     },
//     filetype: {
//         type: String,
//         // required: true
//     }
// });

// const receiptSchema = new mongoose.Schema({
//     filename: String,
//     filepath: String,
//     filetype: String
// });

// const requestSchema = new mongoose.Schema({
//     requestId: {
//         type: String,
//         default: function () {
//             return `REQ-${uuidv4().slice(0, 8).toUpperCase()}`;
//         },
//         unique: true
//     },
//     mobileNumber: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     timeToConnect: {
//         type: String,
//         required: true
//     },
//     pickupAddress: {
//         type: String,
//         required: true
//     },
//     language: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Date,
//         required: true
//     },
//     time: {
//         type: String,
//         required: true
//     },
//     documents: {
//         type: [documentSchema],
//         // required: true
//     },
//     receipt: [receiptSchema],
//     status: {
//         type: String,
//         enum: ['Initiated', 'InProgress', 'Completed', 'Rejected'],
//         default: 'Initiated'
//     },
//     createdBy: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     createdAt: { 
//         type: Date, 
//         default: Date.now,
//         requred: true
//     }
// });

// const Request = mongoose.model('Request', requestSchema);
// module.exports = Request;



const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const documentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    filetype: {
        type: String,
        required: true
    }
});

const receiptSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    filetype: {
        type: String,
        required: true
    }
});

const requestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        default: function () {
            return REQ-${uuidv4().slice(0, 8).toUpperCase()};
        },
        unique: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timeToConnect: {
        type: String,
        required: true
    },
    pickupAddress: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    documents: {
        type: [documentSchema],
        required: true
    },
    receipt: [receiptSchema],
    status: {
        type: String,
        enum: ['Initiated', 'InProgress', 'Completed', 'Rejected'],
        default: 'Initiated'
    },
    createdBy: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        required: true
    }
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;