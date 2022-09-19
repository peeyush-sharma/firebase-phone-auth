// Import stylesheets
import './style.css';

// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import {
//   signOut,
//   getAuth,
//   PhoneAuthProvider,
//   EmailAuthProvider,
//   onAuthStateChanged,
// } from 'firebase/auth';
// import firebaseui from 'firebaseui';

import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

// Document elements
// const phoneButton = document.getElementById('phone-button');
// const codeButton = document.getElementById('code-button');
const startTestButton = document.getElementById('start-button');

async function main() {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyAHAUSF2UXi2PDuSO8RfJV-6aU9tXNM9ls',
    authDomain: 'fir-web-codelab-53937.firebaseapp.com',
    projectId: 'fir-web-codelab-53937',
    storageBucket: 'fir-web-codelab-53937.appspot.com',
    messagingSenderId: '935405943851',
    appId: '1:935405943851:web:34005ae4f6888895a4fe6e',
  };
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  // To apply the default browser preference instead of explicitly setting it.
  auth.useDeviceLanguage();
  auth.settings.appVerificationDisabledForTesting = true; // Testing: // Turn off phone auth app verification.

  // FirebaseUI config
  // const uiConfig = {
  //   callbacks: {
  //     signInSuccessWithAuthResult: function (authResult, redirectUrl) {
  //       // User successfully signed in.
  //       // Return type determines whether we continue the redirect automatically
  //       // or whether we leave that to developer to handle.
  //       console.log('signInSuccessWithAuthResult');
  //       return true;
  //     },
  //     uiShown: function () {
  //       console.log('FirebaseUI was shown');
  //       // The widget is rendered.
  //       document.getElementById('loader').style.display = 'none'; // Hide the loader.
  //     },
  //   },
  //   // credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  //   signInOptions: [
  //     {
  //       provider: PhoneAuthProvider.PROVIDER_ID,
  //       recaptchaParameters: {
  //         type: 'image', // 'audio'
  //         size: 'normal', // 'invisible' or 'compact'
  //         badge: 'bottomleft', //' bottomright' or 'inline' applies to invisible.
  //       },
  //       defaultCountry: 'IN', // Set default country to the India (+91).
  //       defaultNationalNumber: '1234567890',
  //       loginHint: '+911234567890',
  //     },
  //   ],
  //   // signInFlow: 'popup', // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  //   // signInSuccessUrl: '<url-to-redirect-to-on-success>',
  //   // tosUrl: '<your-tos-url>', // Terms of service url.
  //   // privacyPolicyUrl: '<your-privacy-policy-url>', // Privacy policy url.
  // };

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };

  // Initialize the FirebaseUI Widget using Firebase.
  const ui =
    firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
  startTestButton.addEventListener('click', () => {
    if (auth.currentUser) {
      // User is signed in; allows user to sign out
      signOut(auth)
        .then(() => {
          console.log('Sign-Out Successfull');
        })
        .catch((error) => {
          console.log('Sign-Out Errored out!');
          console.log(error);
        });
    } else {
      // No user is signed in; allows user to sign in
      console.log('Starting FirebaseUI');
      ui.start('#firebaseui-auth-container', uiConfig);
      console.log(ui);
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      startTestButton.textContent = 'LOGOUT';
      console.log('USER LOGGED IN');
    } else {
      startTestButton.textContent = 'TEST';
      console.log('USER NOT LOGGED IN');
    }
  });

  // // Create a Recaptcha verifier instance globally // Calls submitPhoneNumberAuth() when the captcha is verified
  // window.recaptchaVerifier = new RecaptchaVerifier(
  //   'phone-button',
  //   {
  //     size: 'invisible',
  //     callback: (response) => {
  //       // reCAPTCHA solved, allow signInWithPhoneNumber.
  //       submitPhoneNumberAuth();
  //     },
  //     'expired-callback': () => {
  //       // Response expired. Ask user to solve reCAPTCHA again.
  //       // ...
  //       window.recaptchaVerifier = new RecaptchaVerifier(
  //         'recaptcha-container',
  //         {},
  //         auth
  //       );
  //       console.log('CAPTCHA expired');
  //     },
  //   },
  //   auth
  // );

  // // This function runs when the 'phone-button' is clicked
  // // Takes the value from the 'phoneNumber' input and sends SMS to that phone number
  // phoneButton.addEventListener('click', () => {
  //   submitPhoneNumberAuth();
  //   console.log('Phone Number Submitted');
  // });

  // codeButton.addEventListener('click', () => {
  //   submitNumberAuthCode();
  //   console.log('OTP Submitted');
  // });

  // function submitPhoneNumberAuth() {
  //   var phoneNumber = document.getElementById('phoneNumber').value;
  //   var appVerifier = window.recaptchaVerifier;
  //   signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  //     .then((confirmationResult) => {
  //       // SMS sent. Prompt user to type the code from the message, then sign the
  //       // user in with confirmationResult.confirm(code).
  //       window.confirmationResult = confirmationResult;
  //     })
  //     .catch((error) => {
  //       window.recaptchaVerifier.render().then(function (widgetId) {
  //         grecaptcha.reset(widgetId);
  //       });
  //       console.log(error);
  //     });
  // }

  // // This function runs when the 'confirm-code' button is clicked
  // // Takes the value from the 'code' input and submits the code to verify the phone number
  // // Return a user object if the authentication was successful, and auth is complete
  // function submitNumberAuthCode() {
  //   var code = document.getElementById('code').value;
  //   confirmationResult
  //     .confirm(code)
  //     .then((result) => {
  //       const user = result.user;
  //       console.log(user);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // This function runs everytime the auth state changes. Use to verify if the user is logged in
}
main();
