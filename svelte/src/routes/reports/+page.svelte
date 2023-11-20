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
    let userData;
    let reportList = [];
	const unsubscribe = authStore.subscribe((value) => {
        if (value.user!=undefined){
		    userID = value.user.uid
        }
	});
    const unsubscribe2 = dataStore.subscribe((value) => {
		reportList = value.reportlist
        userData = value.basicinfo
        if (reportList.length == 0 && userID != undefined){
            getReportList()
        }
	});
    async function getReportList() {
        let q;
        if (userData.is_doctor == true){
            q = query(
            collection(db, "reports"),
            where("allowed_doctors", "array-contains", userID),orderBy("created", "desc"),limit(10)
        );
        }else{
            q = query(
            collection(db, "reports"),
            where("patient_id", "==", userID),orderBy("created", "desc"),limit(10)
        );
        }
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let b = doc.data();
            reportList.push({id:doc.id,patient_name:b.patient_info.name,created:b.created.seconds*1000,severity:b.severity,symptoms:b.symptoms,doctor_name:b.doctor_name})
        });
        dataStore.update(function (state){return {...state,reportlist:reportList}})
    }
</script>

<Dashboard>
    <h1>Reports</h1>
    {#each reportList as elem}
        <div class="myClass" style = "width:100%;border:2px solid black;border-radius:10px;height:fit-content;margin:10px;padding:7px;display:flex;flex-direction:row;align-items:center;cursor:pointer;" on:click = {function(){if (userData.is_doctor){goto("/r/edit_reports~"+elem.id)}else{ goto("/r/reports~"+elem.id)}}}>
            <div style = "display:flex;flex-direction:column">
                <!-- <span style="font-size: medium;">Severity: {elem.severity}</span>
                <span style="font-size: medium;">Symptoms {elem.symptoms}</span> -->
                <span style="font-size: medium;">Report Date: {(new Date(elem.created)).toLocaleString()}</span>
                {#if userData.is_doctor}
                    <span style="font-size: medium;">Patient: {elem.patient_name}</span>
                {:else}
                    <span style="font-size: medium;">Doctor: {elem.doctor_name}</span>
                {/if}
            </div>
        </div>
    {/each}
</Dashboard>

<style>
    /* .myClass
    {
        padding: 7px;
    } */
    .click_btn {
        height: 150px;
        color: white;
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;
        margin: 10px;
        /* padding: 7px; */
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
