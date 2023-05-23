const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Admin:Admin69@cluster0.bs2zgrh.mongodb.net/Log', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const attendanceSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  studentId: String,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
