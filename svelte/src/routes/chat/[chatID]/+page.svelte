<script>
    import OpenAI from "openai";
    import { page } from "$app/stores";
    import { db } from "../../../lib/firebase/firebase";
    import { authStore, dataStore } from "../../../store/store";
    import Dashboard from "../../../components/Dashboard.svelte";
    import { goto } from "$app/navigation";
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
    import { onMount,onDestroy } from "svelte";
    const scrollToBottom12 = node => {
    const scroll = () => node.scroll({
        top: node.scrollHeight,
        behavior: 'smooth',
    });
    scroll();

    return { update: scroll }
};
    const openai = new OpenAI({
        apiKey: "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",
        dangerouslyAllowBrowser: true,
    });
    let authStoreVariable, dataStoreVariable;
    $: dataStoreVariable = dataStoreVariable
    const unsubscribe2 = authStore.subscribe((value) => {
        if (value.user != { email: "test@test.cc", uid: "" }) {
            authStoreVariable = value.user;
        } else {
            authStoreVariable = { email: "test@test.cc", uid: "" };
        }
    });
    const unsubscribe3 = dataStore.subscribe((value) => {
        if (Object.keys(value.basicinfo).length != 0) {
            dataStoreVariable = value.basicinfo;
        } else {
            dataStoreVariable = {};
        }
    });

    let msgerInput = "";
    let chatID = $page.params.chatID;
    let reportID = "";
    let chatgpt_running = false;
    let chatInfo = {};
    let doctorList = [];

    $: console.log(chatInfo, chatInfo.db_messages);
    $: db_messages = chatInfo.db_messages;

    const unsub = onSnapshot(doc(db, "chat", chatID), (doc) => {
        chatInfo = doc.data();
        reportID = doc.data().report;
        scrollToBottom(msgrchat)
    });

    function readFile() {
        if (!this.files || !this.files[0]) return;
        const FR = new FileReader();
        FR.addEventListener("load", async function (evt) {
            let crole = "";
            if (chatInfo.patient_id == authStoreVariable.uid) {
                crole = "user";
            } else {
                crole = "doctor";
            }
            chatInfo.db_messages.push({
                role: crole,
                time: Date.now(),
                content: msgerInput,
                image: evt.target.result,
            });
            await updateDoc(doc(db, "chat", chatID), {
                db_messages: chatInfo.db_messages,
            });
        });
        FR.readAsDataURL(this.files[0]);
    }
    async function videocall_sendMessage() {
        for (let i = chatInfo.db_messages.length-1;i>=0;i--){
            console.log(chatInfo.db_messages[i].time-parseInt(new Date().toUTCString()))
            if (chatInfo.db_messages[i].role == "videocall" && Date.now()-chatInfo.db_messages[i].time<300000){ 
                alert("A Video Meeting is already running!")
                return
            }
        }
        function makeid(length) {
            let result = "";
            const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                );
                counter += 1;
            }
            return result;
        }
        let mID = makeid(6)
        chatInfo.db_messages.push({
            role: "videocall",
            time: Date.now(),
            content: chatID+mID,
        });
        await updateDoc(doc(db, "chat", chatID), {
            db_messages: chatInfo.db_messages,
        });
        goto("/r/videocall~"+chatID+mID)
    }
    async function createNewConversation(docID, docName,docPic) {
        const docRef = await addDoc(collection(db, "chat"), {
            chat_ended: false,
            date_started: serverTimestamp(),
            date_ended: serverTimestamp(),
            db_messages: [],
            doctor_id: docID,
            patient_name: dataStoreVariable.name,
            doctor_name: docName,
            doctor_profile_picture:docPic,
            patient_profile_picture:dataStoreVariable.profile_picture,
            is_chatbot: false,
            patient_id: authStoreVariable.uid,
            report: reportID,
        });
        await updateDoc(doc(db, "chat", chatID), {
            doctor_chosen: true,
            doctor_chosen_id: docRef.id,
        });
        await updateDoc(doc(db, "reports", reportID), {
            allowed_doctors: arrayUnion(docID),
            doctor_name:docName,
        });
        goto("/r/chat~" + docRef.id);
    }
    async function endchat(){
        await updateDoc(doc(db, "chat", chatID), {
                date_ended: serverTimestamp(),
                chat_ended: true,
            });
    }
    let ask_progress = false
    async function askHealthCareProf() {
        if (ask_progress == true){
            return
        }
        if (chatInfo != {} && chatInfo.chat_ended && reportID != "") {
            const docRef = doc(db, "reports", chatInfo.report);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let reportDetails = docSnap.data();
                const q = query(
                    collection(db, "users"),
                    where("is_doctor", "==", true),
                    where(
                        "doctor_roles",
                        "array-contains",
                        reportDetails.doctor_type
                    ),
                    limit(3)
                );
                try{
                    const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    let b = doc.data();
                    doctorList.push({
                        role: "doctor",
                        doctor_role: b.doctor_roles[0],
                        name: b.name,
                        profile_picture:b.profile_picture,
                        id: doc.id,
                    });
                });
                doctorList = doctorList;
                }catch(e){
                    console.log(e)
                }
            } else {
                console.log("No such document!");
            }
        } else {
            ask_progress = true
            try{
                let report_num = db_messages.length - 1;
            for (var i = db_messages.length - 1; i > 0; i--) {
                if (
                    db_messages[i].role == "assistant" &&
                    db_messages[i].severity != "undetermined"
                ) {
                    report_num = i;
                    break;
                }
            }
            if (["General practitioner","Neurologist","Surgeon","Dermatologist","Psychiatrist","Pediatrician","Cardiologist","Radiologist","Oncologist","Urologist","Orthopedic surgeon","Pathologist","Internal medicine","Ophthalmologist","Rheumatologist","Endocrinologist","Gastroenterologist","Ophthalmology","Neurology","Family medicine","Pediatrics","Pulmonologist","Otolaryngologist",].includes(db_messages[report_num].doctor_type)){

            }else{
                db_messages[report_num].doctor_type = "General practitioner"
            }
            await addDoc(collection(db, "reports"), {
                patient_id: authStoreVariable.uid,
                patient_info: {
                    ...dataStoreVariable,
                    city: "",
                    doctor_roles: [],
                    email: "",
                    is_doctor: false,
                    phno: 0,
                    state: "",
                    registered_on: "",
                    profile_last_updated: "",
                },
                related_report: "",
                related_conversation: [chatID],
                allowed_doctors: [],
                symptoms: db_messages[report_num].symptoms,
                history: "",
                summary: db_messages[report_num].summary,
                severity: db_messages[report_num].severity,
                doctor_type: db_messages[report_num].doctor_type,
                doctor_name:"CHATBOT",
                predicted_illness: "",
                other_illness: "",
                created: serverTimestamp(),
                last_updated: serverTimestamp(),
                final_verdict: {stage:"Preliminary ChatBot Examination",prescription:""},
                attachments: "",
            }).then(async function(docRef){
                reportID = docRef.id;
                await updateDoc(doc(db, "chat", chatID), {
                    date_ended: serverTimestamp(),
                    chat_ended: true,
                    report: reportID,
                });
            });
            }catch{
                
            }
            ask_progress = false
        }
    }
    $: if (Object.keys(chatInfo).length && chatInfo.is_chatbot) {
        check_chatBot(chatInfo.db_messages);
    }
    function check_chatBot(db_messages) {
        let count_mild_severe = 0;
        let count_predicted_illness = 0;
        for (var i = db_messages.length - 1; i >= 0; i--) {
            if (
                db_messages[i].role == "assistant" &&
                db_messages[i].predicted_illness != ""
            ) {
                count_predicted_illness += 1;
            }
            if (db_messages[i].role == "assistant" &&
                db_messages[i].severity == "severe"){
                    askHealthCareProf();
                    return false;
                }
            if (count_mild_severe >= 2 || count_predicted_illness >= 2) {
                askHealthCareProf();
                return false;
            }
            if (
                db_messages[i].role == "assistant" &&
                db_messages[i].severity != "undetermined"
            ) {
                count_mild_severe += 1;
            }
        }
        if (count_mild_severe > 1) {
            askHealthCareProf();
            return false;
        } else {
            return true;
        }
    }
    async function user_sendMessage(is_chatbot) {
        if (chatInfo.chat_ended && chatInfo.is_chatbot) {
            alert(
                "This Chat Has Ended. Please Perform The Operations mentioned below."
            );
            return;
        } else if (chatInfo.chat_ended) {
            alert(
                "This Chat Has Ended under Request of Doctor. Please Check your Reports. "
            );
        }
        let crole = "";
        if (chatInfo.patient_id == authStoreVariable.uid) {
            crole = "user";
        } else {
            crole = "doctor";
        }
        chatInfo.db_messages.push({
            role: crole,
            time: Date.now(),
            content: msgerInput,
            image: "",
        });
        console.log(chatInfo.db_messages);
        msgerInput = "";
        chatInfo.db_messages = chatInfo.db_messages;
        if (is_chatbot) {
            chatgpt_running = true;
            let currentmessage = await runConversation(chatInfo.db_messages);
            let response = JSON.parse(currentmessage);
            chatInfo.db_messages.push({
                role: "assistant",
                content: response.response_to_user,
                symptoms: response.symptoms,
                summary: response.conversation_summary,
                severity: response.severity,
                doctor_type: response.doctor_type,
                predicted_illness: response.predicted_illness,
                time: Date.now(),
            });
            chatInfo.db_messages = chatInfo.db_messages;
            chatgpt_running = false;
        }
        await updateDoc(doc(db, "chat", chatID), {
            db_messages: chatInfo.db_messages,
        });
        // check_chatBot(chatInfo.db_messages)
    }
    async function runConversation(gh) {
        let db_messages = [...gh];
        for (var i = 0; i < db_messages.length; i++) {
            let elem = db_messages[i];
            db_messages[i] = { role: elem.role, content: elem.content };
        }
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: db_messages,
            functions: [
                {
                    name: "e",
                    description: "The most suitable doctor and severity to be returned. Must be one from the enum.",
                    parameters: {
                        type: "object",
                        properties: {
                            symptoms: {
                                type: "string",
                            },
                            response_to_user: {
                                type: "string",
                            },
                            predicted_illness: {
                                type: "string",
                            },
                            conversation_summary: {
                                type: "string",
                            },
                            severity: {
                                type: "string",
                                enum: ["mild", "severe", "undetermined"],
                            },
                            doctor_type: {
                                type: "string",
                                enum: [
                                    "General practitioner",
                                    "Neurologist",
                                    "Surgeon",
                                    "Dermatologist",
                                    "Psychiatrist",
                                    "Pediatrician",
                                    "Cardiologist",
                                    "Radiologist",
                                    "Oncologist",
                                    "Urologist",
                                    "Orthopedic surgeon",
                                    "Pathologist",
                                    "Internal medicine",
                                    "Ophthalmologist",
                                    "Rheumatologist",
                                    "Endocrinologist",
                                    "Gastroenterologist",
                                    "Ophthalmology",
                                    "Neurology",
                                    "Family medicine",
                                    "Pediatrics",
                                    "Pulmonologist",
                                    "Otolaryngologist",
                                ],
                            },
                        },
                        required: [
                            "symptoms",
                            "response_to_user",
                            "conversation_summary",
                            "severity",
                            "doctor_type",
                            "predicted_illness",
                        ],
                    },
                },
            ],
            function_call: { name: "e" },
            temperature: 0.5,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty:0.2,
        });
        const responseMessage =
            response.choices[0].message.function_call.arguments;
        console.log(response.choices[0])
        return responseMessage;
    }
    function us_M() {
        user_sendMessage(chatInfo.is_chatbot);
    }
    onDestroy(unsub);
    let msgrchat;
    const scrollToBottom = async (node) => {
        node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
    }; 
</script>

<Dashboard>
    <div
        id="div_chat_window"
        style="width:100%;;display:flex;flex-direction:column;height:100%;"
    >
        <div class="msger-header">
            <div>Doctor {chatInfo.doctor_name}</div>
            <div>Patient: {chatInfo.patient_name}</div>
            {#if !chatInfo.chat_ended && dataStoreVariable.is_doctor && chatInfo.is_chatbot==false}
            <button
                class="msger-send-btn"
                on:click={videocall_sendMessage}
                disabled={chatInfo.chat_ended}>Start Video Call</button
            >
            {/if}
            {#if !chatInfo.chat_ended && dataStoreVariable.is_doctor && chatInfo.is_chatbot==false}
            <button
                class="msger-send-btn" style="background-color: red;"
                on:click={function(){
                    var agree = prompt("Are you sure you want to end this chat? Please type YES")
                    if (agree=="YES"){
                        endchat()
                    }
                }}
                disabled={chatInfo.chat_ended}>End Chat</button
            >
            {/if}
            {#if (chatInfo.report != "" || chatInfo.report == undefined) && chatInfo.is_chatbot==false}
                <button
                    class="msger-send-btn"
                    on:click={function () {
                        goto("/r/reports~" + chatInfo.report);
                    }}
                    
                    >Patient Report</button
                >
            {/if}
        </div>
        <main class="msger-chat" id="msger-chat" bind:this={msgrchat} use:scrollToBottom12 = {db_messages}>
            {#if db_messages != undefined}
                {#if db_messages.length <= 1}
                    <div>Say Hi to start the Conversation.</div>
                {/if}
                {#each db_messages as item, index}
                    {#if item.role == "system"}
                        <div />
                    {:else if item.role == "doctor"}
                        <div class="msg left-msg">
                            <div class="msg-bubble">
                                <div class="msg-info">
                                    <div class="msg-info-name">
                                        <span class="material-symbols-outlined"
                                            >ecg_heart</span
                                        >
                                        <div class="msg-info-time">
                                            {new Date(item.time).toLocaleString(
                                                "en-GB",
                                                { hour12: false }
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div class="msg-text">{item.content}</div>
                                {#if item.image != undefined && item.image != ""}
                                    <img
                                        class="msg-image"
                                        src={item.image}
                                        alt="img"
                                        style="max-width:300px;max-height:300px;"
                                    />
                                {/if}
                            </div>
                        </div>
                    {:else if item.role == "assistant"}
                        <div class="msg left-msg">
                            <div class="msg-bubble">
                                <div class="msg-info">
                                    <div class="msg-info-name">
                                        <span class="material-symbols-outlined"
                                            >smart_toy</span
                                        >
                                        <div class="msg-info-time">
                                            {new Date(item.time).toLocaleString(
                                                "en-GB",
                                                { hour12: false }
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div class="msg-text">{item.content}</div>
                            </div>
                        </div>
                    {:else if item.role == "videocall"}
                        <div class="msg left-msg">
                            <div class="msg-bubble">
                                <div class="msg-info">
                                    <div class="msg-info-name">
                                        <span class="material-symbols-outlined"
                                            >settings</span
                                        >
                                        <div class="msg-info-time">
                                            {new Date(item.time).toLocaleString(
                                                "en-GB",
                                                { hour12: false }
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div class="msg-text">
                                    {#if Date.now() - item.time <= 300000}
                                        <button
                                            class="msger-send-btn"
                                            on:click={function () {
                                                if (
                                                    Date.now() - item.time >
                                                    300000
                                                ) {
                                                    alert(
                                                        "Meeting has Expired"
                                                    );
                                                }else{
                                                goto(
                                                    "/r/videocall~" +
                                                        item.content
                                                )};
                                            }}>Join Video Call</button
                                        ><br />
                                        <span style="font-size:smaller"
                                            >Meeting Link will be active for 5
                                            mins.</span
                                        >
                                    {:else}
                                        <span style="font-size:smaller"
                                            >Meeting has Expired.
                                        </span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {:else}
                        <div class="msg right-msg">
                            <div class="msg-bubble">
                                <div class="msg-info">
                                    <div class="msg-info-name">
                                        <span class="material-symbols-outlined"
                                            >person</span
                                        >
                                        <div class="msg-info-time">
                                            {new Date(item.time).toLocaleString(
                                                "en-GB",
                                                { hour12: false }
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div class="msg-text">{item.content}</div>
                                {#if item.image != undefined && item.image != ""}
                                    <img
                                        class="msg-image"
                                        src={item.image}
                                        alt="img"
                                        style="max-width:300px;max-height:300px;"
                                    />
                                {/if}
                            </div>
                        </div>
                    {/if}
                {/each}
            {/if}
            {#if chatgpt_running}
                <div style="color:black">
                    <div class="load" />
                    Generating Response...
                </div>
            {/if}
            {#if chatInfo.chat_ended}
                <div style="color:black">This Conversation has Ended.</div>
            {/if}
            {#if doctorList.length != 0}
                {#if !chatInfo.doctor_chosen}
                    <span style="color:black"
                        >Choose a Specialist to Talk From:</span
                    >
                    <div
                        style="display: flex;flex-direction:row;color:black;width:100%;overflow-x:scroll;"
                    >
                        {#each doctorList as item, index}
                            <div
                                style="width:250px;height:250px;display:flex;flex-direction:column;border:2px solid;padding:10px;align-items:center;text-align:center;border-radius:10px;"
                            >
                                <span style="font-size:20px;font-weight:bold;"
                                    >{item.name}</span
                                >
                                <span style="font-size:14px"
                                    >{item.doctor_role}</span
                                >
                                <img
                                    src={item.profile_picture}
                                    alt="doc_img"
                                    style="width:140px;height:140px;"
                                />
                                <button
                                    class="msger-send-btn"
                                    on:click={function () {
                                        createNewConversation(
                                            item.id,
                                            item.name,
                                            item.profile_picture
                                        );
                                    }}>Chat with Doctor</button
                                >
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div style="color:black">
                        You have already Chosen a Doctor.
                    </div>
                    <button
                        class="msger-send-btn"
                        on:click={function () {
                            goto("/r/chat~" + chatInfo.doctor_chosen_id);
                        }}>Chat with Doctor</button
                    >
                {/if}
            {:else if chatInfo.chat_ended==true}
            <span style="color:black"
            >No Doctors Currently Available:</span
        >
            {/if}
        </main>
        <div id="msger-inputarea">
            {#if !chatInfo.is_chatbot}
                <label for="msger-image" style="padding:0px;font-size:35px;"
                    >📷</label
                >
                <input
                    id="msger-image"
                    on:change={readFile}
                    type="file"
                    accept="image/png, image/jpeg"
                    hidden
                />
            {/if}
            <input
                type="text"
                id="msger-input"
                on:keypress={function(e){if (e.key == "Enter"){us_M()}}}
                disabled={chatInfo.chat_ended}
                placeholder="Enter your message..."
                bind:value={msgerInput}
            />
            <button
                type="submit"
                style="margin-left: 10px;"
                class="msger-send-btn"
                on:click={us_M}
                disabled={chatInfo.chat_ended}>Send</button
            >
        </div>
    </div>
</Dashboard>

<!-- chatgpt - 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 -->
<style>
    :root {
        --body-bg: linear-gradient(135deg, rgb(120, 230, 206) 0%, #c3cfe2 100%);
        --msger-bg: #fffrgb(120, 230, 206);
        --border: 2px solid #ddd;
        --left-msg-bg: #86bb71;
        --right-msg-bg: #579ffb;
    }

    *,
    *:before,
    *:after {
        margin: 0;
        padding: 0;
        box-sizing: inherit;
    }

    .msger {
        display: flex;
        flex-flow: column wrap;
        justify-content: space-between;
        width: 100%;
        max-width: 867px;
        margin: 25px 10px;
        height: calc(100% - 50px);
        border: var(--border);
        border-radius: 5px;
        background: var(--msger-bg);
        box-shadow: 0 15px 15px -5px rgba(0, 0, 0, 0.2);
    }

    .msger-header {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: var(--border);
        color: #666;
        height: 60px;
    }

    .msger-chat {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        background-color: transparent;
    }
    .msger-chat::-webkit-scrollbar {
        width: 6px;
    }
    .msger-chat::-webkit-scrollbar-track {
        background: #ddd;
    }
    .msger-chat::-webkit-scrollbar-thumb {
        background: #bdbdbd;
    }
    .msg {
        display: flex;
        align-items: flex-end;
        margin-bottom: 10px;
    }
    .msg:last-of-type {
        margin: 0;
    }
    .msg-bubble {
        max-width: 450px;
        padding: 15px;
        border-radius: 15px;
        background: var(--left-msg-bg);
    }
    .msg-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .msg-info-name {
        margin-right: 10px;
        font-weight: bold;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .msg-info-time {
        font-size: 0.85em;
        margin-left: 5px;
    }

    .left-msg .msg-bubble {
        border-bottom-left-radius: 0;
    }

    .right-msg {
        flex-direction: row-reverse;
    }
    .right-msg .msg-info-name {
        flex-direction: row-reverse;
    }
    .right-msg .msg-bubble {
        background: var(--right-msg-bg);
        color: #fff;
        border-bottom-right-radius: 0;
    }
    .right-msg .msg-img {
        margin: 0 0 0 10px;
    }

    #msger-inputarea {
        display: flex;
        padding: 10px;
        border-top: var(--border);
        background: #eee;
    }
    #msger-inputarea * {
        padding: 10px;
        border: none;
        border-radius: 3px;
        font-size: 1em;
    }
    #msger-input {
        flex: 1;
        background: #ddd;
    }
    .msger-send-btn {
        background: rgb(0, 196, 65);
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.23s;
        padding: 10px;
        border: none;
        border-radius: 3px;
        font-size: 1em;
    }
    .msger-send-btn:hover {
        background: rgb(0, 180, 50);
    }

    .dash_side_ico {
        font-size: 40px;
        cursor: pointer;
    }
    .dash_side_ico:hover {
        color: rgb(230, 215, 10);
    }
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes rotate {
        from {
            -webkit-transform: rotate(0deg);
        }
        to {
            -webkit-transform: rotate(360deg);
        }
    }

    .load {
        width: 100px;
        height: 100px;
        margin: 110px auto 0;
        border: solid 10px #8822aa;
        border-radius: 50%;
        border-right-color: transparent;
        border-bottom-color: transparent;
        -webkit-transition: all 0.5s ease-in;
        -webkit-animation-name: rotate;
        -webkit-animation-duration: 1s;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-timing-function: linear;

        transition: all 0.5s ease-in;
        animation-name: rotate;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
</style>
