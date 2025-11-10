const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  publications: { type: Number, default: 0 },
  citations: { type: Number, default: 0 },
  teachingScore: { type: Number, default: 0 },
  experienceYears: { type: Number, default: 0 },
  otherMetrics: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', FacultySchema);
