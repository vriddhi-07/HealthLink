<script>
    import Dashboard from "../../../components/Dashboard.svelte";
    import { getFirestore, doc, getDoc } from "firebase/firestore";
    import { page } from "$app/stores";
    import { GoogleAuthProvider } from "firebase/auth";
    import { goto } from "$app/navigation";
    import { authStore,dataStore } from "../../../store/store";
    const db = getFirestore();
    let reportData = undefined
    $: reportData = reportData
    let reportID = $page.params.reportID;
    let userData;
    const unsubscribe2 = dataStore.subscribe((value) => {
        userData = value.basicinfo
	});
    async function getData() {
        const reportInst = doc(db, "reports", reportID);
        const reportDet = await getDoc(reportInst);
        if (reportDet.exists()){
            reportData = reportDet.data()
            console.log(reportData)
        }else{
            console.log("Invalid Report ID");
        }
    }
    getData();
</script>

<Dashboard>
    <div class="InsideDashboard">
        <h1>Patient Report</h1>
        <h2>Report Details</h2>
        {#if reportData != undefined}
        <table>
            <tr><th>Last Updated: </th> <td>{new Date(reportData.last_updated.seconds*1000).toLocaleString(
                "en-GB",
                { hour12: false }
            )}</td></tr>
            <tr><th>Created On: </th> <td>{new Date(reportData.created.seconds*1000).toLocaleString(
                "en-GB",
                { hour12: false }
            )}</td></tr>
        </table>
        <h2>Patient Details</h2>
        <table>
            <tr><th>Name: </th> <td>{reportData.patient_info.name}</td></tr>
            <tr><th>Date of Birth: </th> <td>{reportData.patient_info.dob}</td></tr>
            <tr><th>Gender: </th> <td>{reportData.patient_info.gender}</td></tr>
            <tr><th>Past Illnesses: </th> <td>{reportData.patient_info.past_disease}</td></tr>
            <tr><th>Known allergies: </th> <td>{reportData.patient_info.allergies}</td></tr>
            <tr><th>Weight: </th> <td>{reportData.patient_info.weight}</td></tr>
        </table>
        <h2>Diagnosis</h2>
        <table>
            <tr><th>Severity: </th> <td>{reportData.severity}</td></tr>
            <tr><th>Visible Symptoms: </th> <td>{reportData.symptoms}</td></tr>
            <tr><th>Summary: </th> <td>{reportData.summary}</td></tr>
            <tr><th>Predicted Illness: </th> <td>{reportData.predicted_illness}</td></tr>
            <tr><th>Other Illness: </th> <td>{reportData.other_illness}</td></tr>
        </table>
        <h2>Verdict</h2>
        <table>
            <tr><th>Stage: </th> <td>{reportData.final_verdict.stage}</td></tr>
            <tr><th>Prescription: </th> <td>{reportData.final_verdict.prescription}</td></tr>
        </table>
        <div style = "display:flex;flex-direction:row;align-items:center;justify-content:space-evenly">
            <button class = "msger-send-btn" on:click={function(){print()}}>Print Report</button>
            {#if userData.is_doctor == true}
            <button class = "msger-send-btn" on:click={function(){goto("/r/edit_reports~"+$page.params.reportID)}}>Edit Report</button>
            {/if}
        </div>
        {/if}
    </div>

</Dashboard>

    <style>
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
        table, th, td
        {
            width: 90%;
            border-color: grey;
            
        }
        table th,td
        {
            padding: 15px;
            text-align: left;
        }
        table th
        {
            width:30%;
        }
        table
        {
            margin: auto;
            border-radius: 5px;
            box-shadow: 5px 5px 5px rgb(244, 222, 255)
        }
        table th, td{
            border-bottom: 0.5px solid black;
        }
        table tr:hover
        {
            transition: 0.2s;
        }
        /* .imgimg
        {width:10%} */
        table tr:hover
        {
           transform: scale(1.02);
           background-color: white;
        }

        .InsideDashboard h2
        {
            padding-top: 4%;
            padding-left: 4%;
            padding-right: 4%;
            padding-bottom: 4%;
            
        }
        .InsideDashboard h1
        {
            text-align: center;
            width: 90%;
        }
        @media screen and (max-width: 600px) {

  table caption {
    font-size: 1.3em;
  }
  
  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  
  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: .625em;
  }
  
  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: .8em;
    text-align: left;
  }
  
  table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }
  
  table td:last-child {
    border-bottom: 0;
  }
}
    </style>

