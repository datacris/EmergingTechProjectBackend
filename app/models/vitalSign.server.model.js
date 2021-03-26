const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VitalSignSchema = new Schema({
    bodyTemperature: {
        type: String,
        default: '',
        trim: true,
        required: 'Body Temperature cannot be blank'
    },
    heartRate: {
        type: String,
        default: '',
        trim: true,
        required: 'Heart rate cannot be blank'
    },
    bloodPressure: {
        type: String, 
        default: '',
        trim: true,
        required: 'Blood Pressure cannot be blank'
    },
    respiratoryRate: {
        type: String, 
        default: '',
        trim: true,
        required: 'Respiratory rate cannot be blank'
    },    
    patient: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});
mongoose.model('VitalSign', VitalSignSchema);
