const Notification = require("../model/notification");
const errorHandler = require("../utils/error_handler");

const saveNotification = errorHandler(async (notfId, senderId) => {
          if(!notfId || !senderId){
                    throw new Error("المعلومات المطلوبة مفقودة");}
                    const newNotification = new Notification({
                              _id: notfId,
                              userId: senderId,
                              message: "follow",
                              createdAt: new Date() 
                    });
                    const notification = await newNotification.save();
                    return notification;
});
const notification = errorHandler(async (req, res) => {
         const userId = req.user.id;
  const notifications = await Notification.find({ userId, delivered: false });

  await Notification.updateMany({ userId, delivered: false }, { delivered: true });

  res.json(notifications);
})
module.exports = {
          saveNotification,
          notification
}