<script>
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
  import { goto } from "$app/navigation";
  import { authStore, dataStore } from "../../store/store";
  import { db } from "../../lib/firebase/firebase";
  import { fade,blur } from 'svelte/transition';
  let authStoreVariable, dataStoreVariable;
  $: dataStoreVariable = dataStoreVariable;
  const unsubscribe2 = authStore.subscribe((value) => {
        if (value.user != { email: "test@test.cc", uid: "" }) {
            authStoreVariable = value.user;
        } else {
            authStoreVariable = { email: "test@test.cc", uid: "" };
        }
    });
    let selection_health = []
    let allergies = []
  const unsubscribe3 = dataStore.subscribe((value) => {
        if (Object.keys(value.basicinfo).length != 0) {
            dataStoreVariable = value.basicinfo;
            console.log(dataStoreVariable,value.basicinfo)
            selection_health = dataStoreVariable.past_illness.split(",")
            allergies = dataStoreVariable.allergies.split(",")
        } else {
            dataStoreVariable = {};
        }
  });

  let x = 1;
  $: dataStoreVariable.past_illness = selection_health.toString()
  $: dataStoreVariable.allergies = allergies.toString()
  $: x = x;
  function setx(t) {
    x = t;
  }
  function decx(k) {
    x = k;
  }
  async function updateProfile() {
      await updateDoc(doc(db, "users", authStoreVariable.uid), {
        ...dataStoreVariable,
        profile_last_updated: serverTimestamp(),
      });
      goto("/dashboard")
    }
</script>

<!--enter name , dob, mobileno-->
<div id = "outer">
{#if x == 1}
  <div class="basic" out:blur={{ duration: 0 }} in:blur={{ duration: 300 }}>
    <h1>Tell us a Bit <br>about yourself</h1>
    <br>
    <label class="body_label">
      <input bind:value={dataStoreVariable.name} type="text" placeholder="Enter Your Name" />
    </label>
    <br>
    <label class="body_label">
      <input bind:value={dataStoreVariable.dob} type="date" placeholder="dd/mm/yyyy" />
    </label>
    <br>
    <label class="body_label">
      <input
        bind:value={dataStoreVariable.phno}
        type="tel"
        pattern="[0-9]{10}"
        placeholder="Enter Your Mobile Number"
      />
    </label>
    <br>
    <div class="merebutton">
      <button class = "next"
        type="submit"
        on:click={function () {
          setx(2);
        }}>Next</button
      >
    </div>
  </div>
  <!--enter gender ,ht,wt-->
{:else if x == 2}
  <div class = "page2" out:blur={{ duration: 0 }} in:blur={{ duration: 300 }}>
    <h1>Some Basic Details</h1>
  <div class="gender_button-container">
    <input type="radio" bind:group={dataStoreVariable.gender} value="Female" id="gender_female"/>
    <label for = "gender_female" class="gender-button"
      ><img src="undraw_female.svg" alt="female" width = "150" height = "150" /></label
    >
    <input type="radio" value="Male" bind:group={dataStoreVariable.gender} id="gender_male" />
    <label for = "gender_male" class="gender-button"
      ><img src="undraw_male.svg" alt="male" width = "150" height = "150" /></label
    >
  </div>
      Height in cms:
      <label class = "body_label"
        ><input
          bind:value={dataStoreVariable.height}
          type="text"
          placeholder="Enter your height"
        /></label
      >
      Weight in kilos:
      <label class = "body_label"
        ><input
          bind:value={dataStoreVariable.weight}
          type="text"
          placeholder="Enter your weight"
        /></label
      >
      <br>
    <div class="merebutton">
      <button class  = "back"
        type="submit"
        on:click={function () {
          setx(1);
        }}>Back</button
      >
      <button class = "next"
        type="submit"
        on:click={function () {
          setx(3);
        }}>Next</button
      >
    </div>
  </div>
  <!--previous disease-->
{:else if x == 3}
  <div class="disease" out:blur={{ duration: 0 }} in:blur={{ duration: 300 }}> 
    <h1>Any Past/Current Major Health Problems?</h1>
    <div style="display: flex;flex-direction:row;flex-wrap:wrap;align-items:center;">
      <div>
        <input type="checkbox" id="med_1" value = "cancer" bind:group={selection_health}/>
        <label for= "med_1" class="dis_check">Cancer</label>
      </div>
      <div>
        <input type="checkbox" id="med_2" value = "asthama" bind:group={selection_health}/>
        <label for= "med_2" class="dis_check">Asthama</label>
      </div>
      <div>
        <input type="checkbox" id="med_3" value = "hypertension" bind:group={selection_health}/>
        <label for= "med_3" class="dis_check">Hypertension</label>
      </div>
      <div>
        <input type="checkbox" id="med_4" value = "syphilis" bind:group={selection_health}/>
        <label for= "med_4" class="dis_check">Syphilis</label>
      </div>
      <div>
        <input type="checkbox" id="med_5" value = "arthritis" bind:group={selection_health}/>
        <label for= "med_5" class="dis_check">Arthritis</label>
      </div>
      <div>
        <input type="checkbox" id="med_6" value = "diabetes" bind:group={selection_health}/>
        <label for= "med_6" class="dis_check">Diabetes</label>
      </div>
      <div>
        <input type="checkbox" id="med_7" value = "high_chrolestrol" bind:group={selection_health}/>
        <label for= "med_7" class="dis_check">High Cholestrol</label>
      </div>
      <div>
        <input type="checkbox" id="med_8" value = "aids" bind:group={selection_health}/>
        <label for= "med_8" class="dis_check">AIDS</label>
      </div>
      <div>
        <input type="checkbox" id="med_9" value = "alzheimers" bind:group={selection_health}/>
        <label for= "med_9" class="dis_check">Alzheimer's</label>
      </div>
    </div>
    <br>
    <div class="merebutton">
      <button class = "back"
        type="submit"
        on:click={function () {
          decx(2);
        }}>Back</button
      >
      <button class = "next"
        type="submit"
        on:click={function () {
          setx(4);
        }}>Next</button
      >
    </div>
  </div>

  <!--med and allergy-->
{:else if x == 4}
  <div class="medall" out:blur={{ duration: 0 }} in:blur={{ duration: 300 }}>
    <h1>Allergies</h1>
    <div style="display: flex;flex-direction:row;flex-wrap:wrap;align-items:center;">
      <div>
        <input type="checkbox" id="medall_1" value = "Peanuts" bind:group={allergies}/>
        <label for= "medall_1" class="dis_check">Peanuts</label>
      </div>
      <div>
        <input type="checkbox" id="medall_2" value = "Milk" bind:group={allergies}/>
        <label for= "medall_2" class="dis_check">Milk</label>
      </div>
      <div>
        <input type="checkbox" id="medall_3" value = "Egg" bind:group={allergies}/>
        <label for= "medall_3" class="dis_check">Egg</label>
      </div>
      <div>
        <input type="checkbox" id="medall_4" value = "Shellfish" bind:group={allergies}/>
        <label for= "medall_4" class="dis_check">Shellfish</label>
      </div>
      <div>
        <input type="checkbox" id="medall_5" value = "Soy" bind:group={allergies}/>
        <label for= "medall_5" class="dis_check">Soy</label>
      </div>
      <div>
        <input type="checkbox" id="medall_6" value = "Wheat" bind:group={allergies}/>
        <label for= "medall_6" class="dis_check">Wheat</label>
      </div>
      <div>
        <input type="checkbox" id="medall_7" value = "Fish" bind:group={allergies}/>
        <label for= "medall_7" class="dis_check">Fish</label>
      </div>
    </div>
      <div class="merebutton">
        <button class = "back"
          type="submit"
          on:click={function () {
            decx(3);
          }}>Back</button
        >
        <button class = "next"
          type="submit"
          on:click={function () {
            setx(5);
          }}>Next</button
        >
      </div>
  </div>
{:else if x == 5}
<div class="accepttos" out:blur={{ duration: 0 }} in:blur={{ duration: 300 }}>
  <h1>Accept TOS</h1>
  <p>By Clicking Accept, you agree that you accept our Terms of Service and Privacy Policy
  </p>
  <div class="merebutton">
    <button class = "back"
      type="submit"
      on:click={function () {
        decx(4);
      }}>Back</button
    >
    <button class = "next"
      type="submit"
      on:click={updateProfile}>Accept</button
    >
  </div>
</div>
{/if}
</div>

<style>

  #outer {
    display: flex;
    flex-direction: column;
    align-items: center;
    color:black;
    justify-content: center;
    flex: 1;
    width: 100%;
    height:max-content;
    background-image: linear-gradient(
                rgba(206, 252, 241, 0.9),
                rgba(244, 222, 255, 0.9)
            ),
            url("bgvev1.png");
  }
  .basic,.page2,.accepttos,.disease,.medall{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding:10px;
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
    backdrop-filter: blur( 15.5px );
    -webkit-backdrop-filter: blur( 15.5px );
    border-radius: 10px;
    max-width: 365px;
    text-align: center;
    min-height: 300px;
    justify-content: space-evenly;
  }
  
  .merebutton{
    text-align: center;
    width: 15%;
    font-size: 30px;
    justify-content:center;
    display: flex;
    flex-direction: row;
  }

  .next
  {
    background-color:rgb(120, 230, 206) ;
    border-radius:12px;
    width:max-content;
    padding:5px;
    font-size: 30px;
    float: right;
    margin-left: 10px;
  }

  .back
  {
    background-color:rgb(120, 230, 206) ;
    border-radius:12px;
    width:max-content;
    padding:5px;
    font-size: 30px;
    float: right;
    margin-left: 10px;
  }

   .body_label {
    background-color:aliceblue;
    width: 300px;
    font-size: 20px;
    border-style: solid;

  }

  p{
    color:black;
    font-size: 20px;
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

  .body_label {
    position: relative;
    border: 1px solid navy;
    border-radius: 5px;
  }

  input {
    width: 300px;
    border: none;
    background: transparent;
    color: black;
    padding: 14px;
    border-color: transparent;
  }

  .disease h3 {
    margin-bottom: 15px;
  }

  .disease p {
    margin-bottom: 10px;
    padding: 10px;
  }

  .disease input[type="checkbox"] {
    margin-right: 5px;
  }

  .inner1 {
    display: flex;
    flex-direction: row;
  }

  .inner2 {
    display: flex;
    flex-direction: row;
  }

  .inner3 {
    display: flex;
    flex-direction: row;
  }
input[type=radio], input[type=checkbox]{
  visibility: hidden;
  height:0px;
  width:0px;
}
input[type=radio]+label, input[type=checkbox]+label{
  filter:grayscale(0.9);
}
input[type=radio]:checked+label, input[type=checkbox]:checked+label{
  filter:none;
}
.dis_check{
  border:2px solid black;
  padding:5px;
  border-radius: 10px;
  margin-left:0px;
  margin-right:2px;
  margin-top:25px;
}
.disease div div,.medall div div{
  display: flex;
  flex-direction: row;
  flex-wrap:wrap;
}
.disease input[type=radio], .disease input[type=checkbox],.medall input[type=radio], .medall input[type=checkbox]{
  border:2px solid black;
  margin:5px;
}
.disease input[type=radio]:checked+label, .disease input[type=checkbox]:checked+label,.medall input[type=radio]:checked+label, .medall input[type=checkbox]:checked+label{
  background-color: grey;
  border-radius:10px;
  padding:5px;
  /* margin:10px; */
}
</style>

