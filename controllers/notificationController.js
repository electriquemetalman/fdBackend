import notificationModel from "../models/notificationModel.js";

const listNotifications = async (req, res) => {
    try{
        const notifications = await notificationModel.find().sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "Notifications Listed Successfully",
            data: notifications,
        });
    } catch (error) {
        res.status(401).send({
            success: false, 
            message: "Failed to List Notifications",
            error: error.message,
        });
    }
}

export { listNotifications };