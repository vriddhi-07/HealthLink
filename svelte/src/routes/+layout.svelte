<svelte:head>
  <title>HealthLink</title>
</svelte:head>
<script>
  import { onMount } from "svelte";
  import { db } from "../lib/firebase/firebase";
  import { auth } from "../lib/firebase/firebase";
  import { goto } from "$app/navigation";
  import { writable, get } from 'svelte/store';
  import { authStore, dataStore , extraStore} from "../store/store";
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
        getCountFromServer,
    } from "firebase/firestore";
  const nonAuthRoutes = ["/", "/aboutus", "/contactus", "/login", "/register","/terms"];
  let authStoreVariable,dataStoreVariable,reportList,conversationList,user
  const unsubscribe2 = authStore.subscribe((value) => {
        if (value.user!={email:"test@test.cc",uid:"RANDOMID"}){
          authStoreVariable = value.user
        }else{
          authStoreVariable = {email:"test@test.cc",uid:"RANDOMID"}
        }
	});
  const unsubscribe3 = dataStore.subscribe((value) => {
        if (value.basicinfo!={}){
          dataStoreVariable = value
          reportList = value.reportlist
          conversationList = value.conversationlist
        }else{
          dataStoreVariable = {}
        }
	});
  let unsub
  async function getChatList() {
        let q
        if (dataStoreVariable.basicinfo.is_doctor == true){
            q = query(
            collection(db, "chat"),
            where("doctor_id", "==", authStoreVariable.uid),orderBy("date_started", "desc"),limit(10)
        );
        }else{
            q = query(
            collection(db, "chat"),
            where("patient_id", "==", authStoreVariable.uid),orderBy("date_started", "desc"),limit(10)
        );
        }
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let b = doc.data();
            conversationList.push({id:doc.id,is_chatbot:b.is_chatbot,date_started:b.date_started.seconds*1000,date_ended:b.date_ended.seconds*1000,doctor_id:b.doctor_id,doctor_name:b.doctor_name,patient_name:b.patient_name})
        });
        dataStore.update(function (state){return {...state,conversationlist:conversationList}})
    }
    async function getReportList() {
        let q;
        console.log(dataStoreVariable.basicinfo)
        if (dataStoreVariable.basicinfo.is_doctor == true){
            q = query(
            collection(db, "reports"),
            where("allowed_doctors", "array-contains", authStoreVariable.uid),orderBy("created", "desc"),limit(10)
        );
        }else{
            q = query(
            collection(db, "reports"),
            where("patient_id", "==", authStoreVariable.uid),orderBy("created", "desc"),limit(10)
        );
        }
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let b = doc.data();
            reportList.push({id:doc.id,patient_name:b.patient_info.name,created:b.created.seconds*1000,severity:b.severity,symptoms:b.symptoms,doctor_name:b.doctor_name})
        });
        dataStore.update(function (state){return {...state,reportlist:reportList}})
    }
  async function getReportChatCount(){
    let q;
      if (dataStoreVariable.basicinfo.is_doctor == true){
            q = query(
            collection(db, "reports"),
            where("allowed_doctors", "array-contains", authStoreVariable.uid),orderBy("created", "desc")
      );
      }else{
            q = query(
            collection(db, "reports"),
            where("patient_id", "==", authStoreVariable.uid),orderBy("created", "desc")
        );
        }
    const snapshot = await getCountFromServer(q);
    if (dataStoreVariable.basicinfo.is_doctor == true){
            q = query(
            collection(db, "chat"),
            where("doctor_id", "==", authStoreVariable.uid),orderBy("date_started", "desc")
        );
        }else{
            q = query(
            collection(db, "chat"),
            where("patient_id", "==", authStoreVariable.uid),orderBy("date_started", "desc")
        );
        }
    const snapshot2 = await getCountFromServer(q);
    extraStore.update(function(state){return {chatcount:snapshot2.data().count,reportcount:snapshot.data().count,retrivedresource:true}})
  }
  // onMount(function () {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const currentPath = window.location.pathname;
      // If user is logged out OR User is not in a page which doesnt require authentication. Redirect him
      if (!user && !nonAuthRoutes.includes(currentPath)) {
        window.location.href = "/";
        return;
      }
      if (user && currentPath == "/register"){
        window.location.href = "/onboarding"
      }
      // If user was already logged in, and he is in landing page, redirect him to dashboard.
      if (user && (currentPath == "/" || currentPath == "/login")) {
        window.location.href = "/dashboard";
      }
      authStore.update(function (state){return {...state,user:user}})
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        unsub = onSnapshot(doc(db, "users", authStoreVariable.uid), (doc) => {
          dataStore.update(function (state){return {...state,basicinfo:doc.data()}})
        });
        if (conversationList.length == 0){
            getChatList()
        }
        if (reportList.length == 0){
            getReportList()
        }
        if (get(extraStore).retrivedresource == false){
          getReportChatCount()
        }
      } else {
        // docSnap.data() will be undefined in this case
        await setDoc(doc(db, "users", user.uid), {
          name: "Some Random Guy",
          height: 180,
          weight: 75,
          dob: "",
          gender: "",
          mobileno: 0,
          place: "",
          state: "",
          allergies: "",
          past_disease: [],
          is_doctor: false,
          doctor_roles: [],
          email: user.email,
          registered_on: serverTimestamp(),
          profile_last_updated: serverTimestamp(),
        });
      }
      // goto("/onboarding")
      // Implement code for getting user details and store it in `dataStore.basicinfo`
    });
  // });
</script>

<div id="output" out:blur={{ duration: 0 }} in:blur={{ duration: 300 }}>
  <slot />
</div>

<style>
  #output {
    background-color: rgb(255, 255, 255);
    color: white;
    width: 100vw;
    min-height: 100vh;
    height:100vh;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Nunito;
  }
</style>
