// Import the Firebase SDK for Google Cloud Functions.
const functions = require('firebase-functions');

// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Adds a message that welcomes new users into the chat.
exports.addVerificationField = functions.auth.user().onCreate(event => {
  const user = event.data;
  console.log('A new user signed in for the first time.');

  // Adds the field
  return admin.database().ref('users/' + user.uid + '/verified').set(false);
});

exports.makeUppercase = functions.database.ref('/cards/{pushId}/userid').onWrite(event => {    
    //var isAdmin = event.auth.admin;
    var uid = event.auth.variable ? event.auth.variable.uid : null;

    const userid = event.data.val();
    console.log('Logging', event.params.pushId, userid);
    
    admin.database().ref('/log').push(
        {
            cardid: event.params.pushId,
            triggerer: uid,
            userid: userid,
            timestamp: admin.database.ServerValue.TIMESTAMP
        }
        ).then(snapshot => {
        console.log('Logged');
    });
});