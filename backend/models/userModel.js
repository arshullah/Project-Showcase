const { Schema, model } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    rollNo: { type: Number }, // Removed unique constraint
    course: { type: String, default: 'Unknown' },
    year: { type: Number },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, default: 'user' }
});

module.exports = model('user', mySchema);