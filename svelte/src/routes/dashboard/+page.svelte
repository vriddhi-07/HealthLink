<script>
    import Dashboard from "../../components/Dashboard.svelte";
    import HealthTip from "../../components/HealthTip.svelte"
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { auth, db } from "../../lib/firebase/firebase";
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
    import { dataStore, authStore } from "../../store/store";
    import { onDestroy } from "svelte";

    let authStoreVariable,dataStoreVariable
  const unsubscribe2 = authStore.subscribe((value) => {
        if (value.user!={email:"test@test.cc",uid:"RANDOMID"}){
          authStoreVariable = value.user
        }else{
          authStoreVariable = {email:"test@test.cc",uid:"RANDOMID"}
        }
	});
  const unsubscribe3 = dataStore.subscribe((value) => {
        if (Object.keys(value.basicinfo).length != 0){
          dataStoreVariable = value
        }else{
          dataStoreVariable = {basicinfo:{},reportlist:[],conversationlist:[]}
        }
	});
    $: dataStoreVariable = dataStoreVariable
    async function createChatbotChat() {
        const docRef = await addDoc(collection(db, "chat"), {
            chat_ended: false,
            date_started: serverTimestamp(),
            date_ended: serverTimestamp(),
            db_messages: [
                {
                    role: "system",
                    content:
                        // "You are a doctor tasked with diagnosing medical conditions based on patient symptoms and medical history. Your role is to ask concise questions to gather relevant information from the patient. Based on the provided details, you will predict the possible medical illness and recommend the type of specialist the patient should visit for further evaluation and treatment.  Make your questions as specific and concise as possible to accurately assess the situation and provide appropriate guidance."
                        // "Act like a medical illness diagnosing doctor. Ask various concise non-sympathetic questions such as symptoms and its duration, past medical history, etc. Ask follow up questions to narrow down the possible illness and identify it. Recommend the type of doctor they have to consult."
                        // "You are a medical illness diagnosing chatbot. Ask various concise non-sympathetic questions such as patient's symptoms, duration of symptoms, any past medical conditions, etc to gather relevant informtion from patient. Ask follow up questions to narrow down the possible illness. Based on the details given, identify the illness they are having and type of doctor they have to consult. After identification, reroute the user to correct doctor. Please ask the necessary questions to understand the symptoms, their duration, any underlying medical conditions, medications, allergies, and any other pertinent information.",
                        "You are a medical illness diagnosing chatbot who will talk with a patient. Ask various concise non-sympathetic questions such as patient's symptoms, duration of symptoms, any past medical conditions,etc to gather relevant information from patient. Ask follow up questions to narrow down the possible illness. Based on the details given, identify the illness they are having and type of doctor they have to consult. Please ask the necessary questions to understand the symptoms, their duration, any underlying medical conditions, medications, allergies, and any other pertinent information. After identification, reroute the user to correct doctor. Return symptoms, summary of conversation with user, predicted illness, response to be given to user, and the doctor type required. You always have to give a non-empty response to the user."
                },
            ],
            doctor_id: "CHATBOT",
            doctor_name: "CHATBOT",
            patient_name: dataStoreVariable.basicinfo.name,
            is_chatbot: true,
            patient_id: authStoreVariable.uid,
            doctor_chosen: false,
            doctor_chosen_id: "",
        });
        goto("/r/chat~" + docRef.id);
    }
</script>

    <Dashboard>
        <div
            style="height:20%;display:flex;flex-direction:column;justify-content:center;"
        >
            <span>Welcome Back,</span>
            <span style="font-size:25px;font-weight:bold;">{dataStoreVariable.basicinfo.name}</span>
        </div>
        <div style="display: flex;flex-direction:row;flex-wrap:wrap;align-items:center;">
            <div class = "click_btn" style="background-color: #1ebfc4;" on:click={createChatbotChat}><i class='bx bx-plus-medical'></i><span>Chat with MediBot</span></div>
            {#if dataStoreVariable.reportlist.length !=0}
                <div class = "click_btn" style="background-color: #E91E63;" on:click={function(){goto("/r/reports~"+dataStoreVariable.reportlist[0].id)}}><i class='bx bxs-report'></i><span>Latest Report</span></div>
            {/if}
            {#if dataStoreVariable.conversationlist.length !=0}
                <div class = "click_btn" style="background-color: #F44336;" on:click={function(){goto("/r/chat~"+dataStoreVariable.conversationlist[0].id)}}><i class='bx bxs-message-dots'></i><span>Most Recent Conversation</span></div>
            {/if}
        </div>
        <HealthTip></HealthTip>
    </Dashboard>


<style>
    .click_btn {
        width: 200px;
        height: 150px;
        color: white;
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 10px;
        cursor:pointer;
        margin:10px;
    }
    .click_btn span {
        font-size:20px;
    }
    .click_btn i{
        font-size:50px;
    }
    .click_btn:hover{
        filter:grayscale(0.5)
    }
</style>
