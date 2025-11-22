import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    isRead: { type: Boolean, default: false },
}, {
    timestamps: true
})

const notificationModel = mongoose.models.Notification || mongoose.model("notification", notificationSchema);

export default notificationModel;