const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmergencyAlertSchema = new Schema({
    alertMessage: {
        type: String,
        default: '',
        trim: true,
        required: 'Message cannot be blank'
    },
    medicalResponse: {
        type: String,
        default: '',
        trim: true
    },
    alertState: {
        type: String, 
        default: 'created',
        trim: true
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    answeredBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    creationDate: { 
        type: Date, 
        default: Date.now 
    },
    answerDate:{
        type:Date
    }
});
mongoose.model('EmergencyAlert', EmergencyAlertSchema);
