const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobFetchSchema = new Schema({
    jobName: {
        type: String,
        required: true
    },
    fetchEndpoint: {
        type: String,
        required: true
    },
    collectionName: {
        type: String,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { versionKey: false });

const JobFetch = mongoose.model('JobFetch', JobFetchSchema);

module.exports = JobFetch;