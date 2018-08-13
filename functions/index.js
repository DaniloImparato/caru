const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require('./secret/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://caru-47212.firebaseio.com"
});

// Adiciona o campo verified no usuario.
exports.addVerificationField = functions.auth.user().onCreate((user, context) => {
    return admin.database().ref('users/' + user.uid + '/verified').set(false);
});

// Log
exports.addLogEntry = functions.database.ref('/cards/{pushId}/userid').onWrite((change, context) => {
    var uid = context.auth ? context.auth.uid : 'admin';

    const userid = change.after.val();

    return admin.database().ref('/log').push({
            cardid: context.params.pushId,
            triggerer: uid,
            userid: userid,
            timestamp: admin.database.ServerValue.TIMESTAMP
        }).then(snapshot => {
            console.log("Logged card " + context.params.pushId);
    });
});