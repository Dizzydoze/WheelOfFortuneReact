import React from 'react';
import './App.css';

import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider, signInWithRedirect} from 'firebase/auth';

function Login({onLogin}) {

    const firebaseConfig = {
        apiKey: "AIzaSyCS1K-wWVKsRrdoT4bGOMK3JPBS49vA9Qs",
        authDomain: "wheeloffortunereactversion.firebaseapp.com",
        projectId: "wheeloffortunereactversion",
        storageBucket: "wheeloffortunereactversion.appspot.com",
        messagingSenderId: "844012626805",
        appId: "1:844012626805:web:07df0f2c50b45e4247e93c",
        measurementId: "G-7RB1K9JP6B"
    };

    initializeApp(firebaseConfig);

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithRedirect(auth, provider)
            .then((result) => {
                // User signed in
                console.log(result.user);
            }).catch((error) => {
            // Handle Errors here.
            console.error(error);
        });
    };

    const auth = getAuth();
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            console.log("User is signed in:", user);
            // setUserId(user.uid)
            onLogin(user.uid)
        } else {
            // No user is signed in.
            console.log("No user is signed in.");
        }
    });

    return (
        <div>
            <button onClick={signInWithGoogle} >Sign in with Google</button>
        </div>
    );
}

export default Login;
