// import logo from './logo.svg';
import './App.css';


// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';

import React, { useEffect, useRef, useState } from "react";

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth';   

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  //configs
  apiKey: "AIzaSyA2Wp7t2XXi-9RGyP3Pp23uyefOxtMa7Ck",
  authDomain: "web-chat-4cbe0.firebaseapp.com",
  projectId: "web-chat-4cbe0",
  storageBucket: "web-chat-4cbe0.appspot.com",
  messagingSenderId: "839471572863",
  appId: "1:839471572863:web:d580ef951e9f074e79dc4a",
  measurementId: "G-SSB3RH1B8S"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className='App'>
      <header>

      </header>
      <section>
        {user ? <ChatRoom />  : <SignIn />}
        <SignOut/>

      </section>
    </div>

  );
}

// function googleSignInPopup(provider) {
//   // [START auth_google_signin_popup]
//   firebase.auth()
//     .signInWithPopup(provider)
//     .then((result) => {
//       /** @type {firebase.auth.OAuthCredential} */
//       var credential = result.credential;

//       // This gives you a Google Access Token. You can use it to access the Google API.
//       var token = credential.accessToken;
//       // The signed-in user info.
//       var user = result.user;
//       // ...
//     }).catch((error) => {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // The email of the user's account used.
//       var email = error.email;
//       // The firebase.auth.AuthCredential type that was used.
//       var credential = error.credential;
//       // ...
//     });
//   // [END auth_google_signin_popup]
// }

function SignIn() {
  const signInWithGoogle = () => {
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
      // auth.signInWithGoogle(provider);
  }
  return (
      <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
      <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef()
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFromValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFromValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});


  }
  return (
      <>
          <main>
              {messages && messages.map(msg=> <ChatMessage key={msg.id} message={msg}/>)}
            <div ref={dummy}> </div>
          </main>
          <form onSubmit={sendMessage}>
            <input value={formValue} onChange={(e) => setFromValue(e.target.value)}/>
            <button type="submit">send</button> 
          </form>
      </>
  )


}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  console.log(text);
  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>

    </div>

  )
}


export default App;
