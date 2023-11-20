<!-- Register Page -->
<script>
  import { auth } from "../../lib/firebase/firebase";
  import { goto } from "$app/navigation";
  import { db } from "../../lib/firebase/firebase";
  import {
    getAuth,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
  } from "firebase/auth";
  import {
    getFirestore,
    orderBy,
    limit,
    writeBatch,
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    setDoc,
    updateDoc,
    getDocs,
    doc,
    serverTimestamp,
    getDoc,
    query,
    where,
  } from "firebase/firestore";
  import { authHandlers } from "../../store/store";
  let email = "";
  let password = "";
  let confirmpassword = "";

  import { onMount, onDestroy } from "svelte";

  let user = null;
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    if (currentUser) {
      user = currentUser;
      console.log(user);
    } else {
      user = null;
    }
  });

  onDestroy(() => {
    // Unsubscribe from the auth state changes when the component is destroyed
    unsubscribe();
  });

  async function handleAuthenticate() {
    if (!email || !password || !confirmpassword) {
      alert("Please fill all the fields");
      return;
    }
    if (confirmpassword != password) {
      alert("Confirm password is not the same as password");
      return;
    }
    if (password.length < 8){
      alert("Password should be at least 8 characters long")
      return;
    }
    if (email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
      try{
        await authHandlers.signup(email, password);
      }catch{
        alert("Something Went Wrong")
      }
    }else{
      alert("Please enter a valid email.")
    }
    goto("/onboarding");
  }
</script>

<div class="authContainer">
  <h1>Sign Up</h1>
  <br>
  <label>
    <input bind:value={email} type="email" id="email" placeholder="Email" />
  </label>
  <br>
  <label>
    <input
      bind:value={password}
      type="password"
      id="password"
      placeholder="Password"
    />
  </label>
  <br>
  <label>
    <input
      bind:value={confirmpassword}
      type="password"
      id="confirmpassword"
      placeholder="Confirm Password"
    />
  </label>
  <br><br>
  <button class = "button" type="submit" on:click={handleAuthenticate}>Register</button>
  <br>
  <p>
    Already have an account?
    <a href="../../login"> Login </a>
  </p>
</div>

<style>

  .authContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  .button{
    background-color:rgb(120, 230, 206) ;
    width:10%;
    min-width:120px;
    color: white;
    text-align: center;
    font-size: 30px;
    border-radius:12px;
    border: none;
    cursor: pointer;
  }
  .button:hover{
    filter:grayscale(0.5),
    
  }

   label {
    background-color:aliceblue;
    width: 300px;
    font-size: 20px;
    border-style: solid;

  }

  p{
    color:black;
  }

  div{
    width: 100%;
    height:500%;
    background-image: linear-gradient(
                rgba(206, 252, 241, 0.9),
                rgba(244, 222, 255, 0.9)
            ),
            url("$lib/images/bgvev1.png");
  }

  h1 {
    text-align: center;
    color:#009688;
    border: 1px;
    border-radius: 5px;
    padding: 2px;
    font-family: sans-serif;
    font-size: xx-large;
  }

  label {
    position: relative;
    border: 1px solid Onavy;
    border-radius: 5px;
  }

  input {
    width: 300px;
    border: none;
    background: transparent;
    color: black;
    padding: 14px;
  }
</style>
