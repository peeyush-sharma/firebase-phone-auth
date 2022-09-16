// Import stylesheets
import './style.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  getAuth,
} from 'firebase/auth';

// Document elements
const phoneButton = document.getElementById('phone-button');
const codeButton = document.getElementById('code-button');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  // To apply the default browser preference instead of explicitly setting it.
  auth.useDeviceLanguage();

  // Testing
  // Turn off phone auth app verification.
  // auth.settings.appVerificationDisabledForTesting = true;

  function submitPhoneNumberAuth() {
    var phoneNumber = document.getElementById('phoneNumber').value;
    var appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        window.recaptchaVerifier.render().then(function (widgetId) {
          grecaptcha.reset(widgetId);
        });
        console.log(error);
      });
  }

  // Create a Recaptcha verifier instance globally
  // Calls submitPhoneNumberAuth() when the captcha is verified
  window.recaptchaVerifier = new RecaptchaVerifier(
    'recaptcha-container',
    {
      size: 'invisible',
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        submitPhoneNumberAuth();
      },
    },
    auth
  );

  // This function runs when the 'phone-button' is clicked
  // Takes the value from the 'phoneNumber' input and sends SMS to that phone number
  phoneButton.addEventListener('click', () => {
    submitPhoneNumberAuth();
    console.log('Phone Number Submitted');
  });

  codeButton.addEventListener('click', () => {
    submitNumberAuthCode();
    console.log('OTP Submitted');
  });

  // This function runs when the 'confirm-code' button is clicked
  // Takes the value from the 'code' input and submits the code to verify the phone number
  // Return a user object if the authentication was successful, and auth is complete
  function submitNumberAuthCode() {
    var code = document.getElementById('code').value;
    confirmationResult
      .confirm(code)
      .then((result) => {
        var user = result.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // This function runs everytime the auth state changes. Use to verify if the user is logged in
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('USER LOGGED IN');
    } else {
      // No user is signed in.
      console.log('USER NOT LOGGED IN');
    }
  });
}
main();
