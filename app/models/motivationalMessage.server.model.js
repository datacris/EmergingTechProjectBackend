const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MotivationalMessageSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    description: {
        type: String,
        default: '',
        trim: true,
        required: 'description cannot be blank'
    },
    // two states: created, responded
    linkVideo: {
        type: String,
        default: '',
        trim: true,
        required: 'video link cannot be blank'
    },
    linkImage: {
        type: String,
        default: '',
        trim: true,
        required: 'Image link cannot be blank'
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});
mongoose.model('MotivationalMessage', MotivationalMessageSchema);
