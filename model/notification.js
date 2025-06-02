const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      title: String,
      body: String,
      createdAt: { type: Date, default: Date.now },
      delivered: { type: Boolean, default: false },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;