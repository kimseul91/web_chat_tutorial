const functions = require('firebase-functions');
const Filter = require('bad-words');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.detectEvilUsers = functions.firestore
    .document('message/{msgId}')
    .onCreate(async (doc, ctx) => {
        const filter = new Filter();
        const { text, uid} = doc.data();

        if (filter.isProfane(text)) {
            const cleaned = filter.clean(text);
            await doc.ref.update({text: `I got BANNED for using bad word ${cleaned}`});

            await db.collection('banned').doc(uid).set({});

        }
    });
