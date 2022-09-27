// Import stylesheets
import './style.css';

// Firebase Imports
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { signOut, onAuthStateChanged } from 'firebase/auth';

// Document elements
const authStartButton = document.getElementById('auth-button');

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

  // auth.settings.appVerificationDisabledForTesting = true; // Testing: // Turn off phone auth app verification.

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
        // Handle sign-in. // Return false to avoid redirect.
        console.log('signInSuccessWithAuthResult');
        return true;
      },
      uiShown: function () {
        console.log('FirebaseUI was shown');
        // The widget is rendered.
        // document.getElementById('loader').style.display = 'none'; // Hide the loader.
      },
    },
    signInFlow: 'popup', // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
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
