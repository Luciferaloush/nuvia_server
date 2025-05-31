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
const getNotification = errorHandler(async (req, res) => {
          const userId = req.user.id;
          const notification = await Notification.find({ userId }).sort({ createdAt: -1 });
          res.status(200).json({
                   notification 
          })
})
module.exports = {
          saveNotification,
          getNotification
}