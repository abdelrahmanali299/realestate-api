// import admin from "firebase-admin";
// import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

// if (!admin.apps.length) {
//     admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//     });
// }

// const db = admin.firestore();

// export default async function handler(req, res) {
//     try {
//         const { title, body } = req.body;

//         const snapshot = await db.collection("users").get();

//         const tokens = [];

//         snapshot.forEach((doc) => {
//             const data = doc.data();
//             if (data.fcmToken) {
//                 tokens.push(data.fcmToken);
//             }
//         });

//         if (tokens.length === 0) {
//             return res.status(200).json({ message: "No tokens found" });
//         }

//         const message = {
//             notification: {
//                 title: title || "شقة جديدة",
//                 body: body || "تم إضافة شقة جديدة",
//             },
//             tokens,
//         };

//         const response = await admin.messaging().sendEachForMulticast(message);

//         res.status(200).json({
//             success: response.successCount,
//             failed: response.failureCount,
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }
// send-notification.js
import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export default async function handler(req, res) {
    try {
        // البيانات القادمة من client
        const { title, body, realestateId } = req.body;

        if (!title || !body) {
            return res.status(400).json({ error: "title and body are required" });
        }

        // الرسالة التي ستُرسل لكل المشتركين في topic
        const message = {
            topic: "realestate", // هذا هو Topic الذي سنستخدمه في Flutter
            notification: {
                title,
                body,
            },
            data: {
                realestateId: realestateId || "",
            },
        };

        // إرسال الإشعار
        const response = await admin.messaging().send(message);

        res.status(200).json({
            success: true,
            message: "Notification sent to topic 'realestate'",
            response,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}