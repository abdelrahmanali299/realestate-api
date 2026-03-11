const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// تهيئة Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
    });
}

const db = admin.firestore();
const messaging = admin.messaging();

// إرسال إشعار لكل المستخدمين
router.post("/send-to-all", async (req, res) => {
    const { title, body, data } = req.body;

    try {
        // جلب كل FCM Tokens من Firestore
        const usersSnapshot = await db.collection("users").get();

        const tokens = [];
        usersSnapshot.forEach((doc) => {
            const fcmToken = doc.data().fcmToken;
            if (fcmToken) tokens.push(fcmToken);
        });

        if (tokens.length === 0) {
            return res.status(400).json({ error: "No users found" });
        }

        // إرسال الإشعار
        const message = {
            notification: { title, body },
            data: data || {},
            tokens: tokens,
        };

        const response = await messaging.sendEachForMulticast(message);

        res.json({
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;