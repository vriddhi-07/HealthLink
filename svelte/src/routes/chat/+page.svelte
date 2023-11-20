<script>
    import { goto } from "$app/navigation";
    import Dashboard from "../../components/Dashboard.svelte";
    import { db } from "../../lib/firebase/firebase";
    import { authStore,dataStore } from "../../store/store";

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
    let userID;
    let user;
    let conversationList = [];
	const unsubscribe = authStore.subscribe((value) => {
        if (value.user!=undefined){
		    userID = value.user.uid
        }
	});
    const unsubscribe2 = dataStore.subscribe((value) => {
		conversationList = value.conversationlist
        user = value.basicinfo
        if (conversationList.length == 0 && userID != undefined){
            getChatList()
        }
	});
    async function getChatList() {
        let q
        if (user.is_doctor == true){
            q = query(
            collection(db, "chat"),
            where("doctor_id", "==", userID),orderBy("date_started", "desc"),limit(10)
        );
        }else{
            q = query(
            collection(db, "chat"),
            where("patient_id", "==", userID),orderBy("date_started", "desc"),limit(10)
        );
        }
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let b = doc.data();
            conversationList.push({id:doc.id,is_chatbot:b.is_chatbot,date_started:b.date_started.seconds*1000,date_ended:b.date_ended.seconds*1000,doctor_id:b.doctor_id,doctor_name:b.doctor_name,patient_name:b.patient_name})
        });
        dataStore.update(function (state){return {...state,conversationlist:conversationList}})
    }
</script>

<Dashboard>
    <h1>Conversations</h1>
    {#each conversationList as elem}
        <div style = "width:100%;border:2px solid black;border-radius:10px;height:fit-content;margin:10px;display:flex;flex-direction:row;align-items:center;cursor:pointer;" on:click = {function(){goto("/r/chat~"+elem.id)}}>
            <div>
                {#if elem.is_chatbot}
                    <span style = "width:50px;height:50px;font-size:40px;color:grey;" class = "material-symbols-outlined">smart_toy</span>
                {:else}
                    <span style = "width:50px;height:50px;font-size:40px;color:red;" class = "material-symbols-outlined">ecg_heart</span>
                {/if}
            </div>
            <div style = "display:flex;flex-direction:column">
                {#if user.is_doctor==true}
                    <span style="font-size: medium;">Patient {elem.patient_name}</span>
                {:else}
                    <span style="font-size: medium;">Doctor {elem.doctor_name}</span>
                {/if}
                <span style="font-size: smaller;">Started On: {(new Date(elem.date_started)).toLocaleString()}</span>
            </div>
        </div>
    {/each}
</Dashboard>

<style>
    .click_btn {
        height: 150px;
        color: white;
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;
        margin: 10px;
    }
    .click_btn span {
        font-size: 20px;
    }
    .click_btn i {
        font-size: 50px;
    }
    .click_btn:hover {
        filter: grayscale(0.5);
    }
</style>
