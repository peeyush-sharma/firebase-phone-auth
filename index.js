// Import stylesheets
import './style.css';

// Firebase Imports
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, addDoc, collection } from 'firebase/firestore';

// Document elements
const authStartButton = document.getElementById('auth-button');
const calendlyWidget = document.getElementById('calendly-widget');
const kycForm = document.getElementById('kyc-form');
const userName = document.getElementById('username');
const email = document.getElementById('email');
const address = document.getElementById('address');
const petname = document.getElementById('petname');
const complaint = document.getElementById('summary');
const formSubmitButton = document.getElementById('form-submit-btn');

async function main() {
  // Your Firebase configuration
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

  // Firebase DB setup
  const db = getFirestore();

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: 'image', // 'audio'
          size: 'normal', // 'invisible' or 'compact'
          badge: 'bottomleft', //' bottomright' or 'inline' applies to invisible.
        },
      },
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: 'image', // 'audio'
          size: 'normal', // 'invisible' or 'compact'
          badge: 'bottomleft', //' bottomright' or 'inline' applies to invisible.
        },
        defaultCountry: 'IN', // Set default country to the India (+91).
        defaultNationalNumber: '1234567890',
        loginHint: '+911234567890',
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        console.log('signInSuccessWithAuthResult');
        kycForm.style.display = 'block';
        // calendlyWidget.style.display = 'block';
        return false; // Return false to avoid redirect.
      },
      uiShown: function () {
        // The widget is rendered.
        console.log('FirebaseUI was shown');
      },
    },
    signInFlow: 'popup', // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    // signInSuccessUrl: '<url-to-redirect-to-on-success>',
    tosUrl: '<your-tos-url>', // Terms of service url.
    privacyPolicyUrl: '<your-privacy-policy-url>', // Privacy policy url.
  };

  // Initialize the FirebaseUI Widget using Firebase.
  const ui =
    firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
  authStartButton.addEventListener('click', () => {
    if (auth.currentUser) {
      // User is signed in; allows user to sign out
      signOut(auth)
        .then(() => {
          console.log('Sign-Out Success');
        })
        .catch((error) => {
          console.log('Sign-Out Error!');
          console.log(error);
        });
    } else {
      // No user is signed in; so allow user to sign in; Start FirebaseUI
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      authStartButton.textContent = 'LOGOUT';
    } else {
      authStartButton.textContent = 'LOGIN';
      calendlyWidget.style.display = 'none';
      // kycForm.style.display = 'none';
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

  // Listen to the form submission
  formSubmitButton.addEventListener('click', async (e) => {
    console.log('Pressed Submit Button');
    console.log(db);
    e.preventDefault(); // Prevent the default form redirect
    // Write a new message to the database collection "customer-book"

    let username = auth.currentUser.displayName;
    if (!username && username.length == 0) {
      username = userName;
      console.log('username is null');
    }

    addDoc(collection(db, 'customer-book'), {
      userId: auth.currentUser.uid,
      name: username,
      email: email.value,
      address: address.value,
      petname: petname.value,
      complaint: complaint.value,
      timestamp: Date.now(),
    });
    return false; // Return false to avoid redirect
  });
}
main();

// document.addEventListener('DOMContentLoaded', function () {
//   // kycForm.style.display = 'none';
//   calendlyWidget.style.display = 'none';
//   authStartButton.textContent = 'LOGIN';
// });
