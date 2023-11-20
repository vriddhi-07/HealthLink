<script>
    import Dashboard from "../../components/Dashboard.svelte";
    import {
        getFirestore,
        doc,
        getDoc,
        updateDoc,
        setDoc,
        serverTimestamp,
    } from "firebase/firestore";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { authStore, dataStore } from "../../store/store";
    const db = getFirestore();
    let reportData = undefined;
    let authStoreVariable, dataStoreVariable;
    $: dataStoreVariable = dataStoreVariable;
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
    async function updateProfile() {
        await updateDoc(doc(db, "users", authStoreVariable.uid), {
            ...dataStoreVariable,
            profile_last_updated: serverTimestamp(),
        });
    }
    function readFile() {
        if (!this.files || !this.files[0]) return;
        const FR = new FileReader();
        FR.addEventListener("load", async function (evt) {
            dataStoreVariable.profile_picture = evt.target.result
        });
        FR.readAsDataURL(this.files[0]);
    }
</script>

<Dashboard>
    <div class="InsideDashboard">
        <h1>Profile</h1>
        {#if dataStoreVariable != undefined}
        <center><div class="img" style="width:150px;height:150px">
            <img
                src={dataStoreVariable.profile_picture}
                alt="profileImg"
            />
        </div></center>
            <table>
                <tr
                    ><th>Name: </th>
                    <td
                        ><input
                            type="text"
                            bind:value={dataStoreVariable.name}
                        /></td
                    ></tr
                >
                <tr
                    ><th>Date of Birth: </th>
                    <td
                        ><input
                            type="date"
                            bind:value={dataStoreVariable.dob}
                        /></td
                    ></tr
                >
                <tr
                    ><th>Gender: </th>
                    <td
                        ><select
                            type="text"
                            bind:value={dataStoreVariable.gender}
                            ><option value="Male">Male</option><option
                                value="Female">Female</option
                            ></select
                        ></td
                    ></tr
                >
                <tr
                    ><th>Past Illnesses: </th>
                    <td
                        ><input
                            type="text"
                            bind:value={dataStoreVariable.past_illness}
                        /></td
                    ></tr
                >
                <tr
                    ><th>Known allergies: </th>
                    <td
                        ><input
                            type="text"
                            bind:value={dataStoreVariable.allergies}
                        /></td
                    ></tr
                >
                <tr
                    ><th>Weight: </th>
                    <td
                        ><input
                            type="number"
                            bind:value={dataStoreVariable.weight}
                        /></td
                    ></tr
                >
                <tr
                    ><th>City: </th>
                    <td
                        ><input
                            type="text"
                            bind:value={dataStoreVariable.city}
                        /></td
                    ></tr
                >
                <tr
                    ><tr
                    ><th>Height: </th>
                    <td
                        ><input
                            type="text"
                            bind:value={dataStoreVariable.height}
                        /></td
                    ></tr
                >
                <tr
                    >
                    <tr
                    ><th>State </th>
                    <td
                        ><input
                            type="text"
                            bind:value={dataStoreVariable.state}
                        /></td
                    ></tr
                >
                <tr
                    >
                    <tr
                    ><th>Phone Number: </th>
                    <td
                        ><input
                            type="number"
                            bind:value={dataStoreVariable.phno}
                        /></td
                    ></tr
                >
                <tr>
                    <th>Profile Picture</th>
                    <td>
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
                    </td>
                </tr>
                <tr
                    >
            </table>
            <center
                ><button
                    class="msger-send-btn"
                    on:click={function () {
                        updateProfile();
                    }}>Update Profile</button
                ></center
            >
        {/if}
    </div>
</Dashboard>

<style>
    table,
    th,
    td {
        width: 90%;
        border-color: grey;
    }
    table th,
    td {
        padding: 15px;
        text-align: left;
    }
    table th {
        width: 30%;
    }
    table {
        margin: auto;
        border-radius: 5px;
        box-shadow: 5px 5px 5px rgb(244, 222, 255);
    }
    table th,
    td {
        border-bottom: 0.5px solid black;
    }
    table tr:hover {
        transition: 0.2s;
    }
    /* .imgimg
        {width:10%} */
    table tr:hover {
        transform: scale(1.02);
        background-color: white;
    }

    .InsideDashboard h2 {
        padding-top: 4%;
        padding-left: 4%;
        padding-right: 4%;
        padding-bottom: 4%;
    }
    .InsideDashboard h1 {
        text-align: center;
        width: 90%;
    }
    input,
    textarea,
    select {
        width: 90%;
        height: 50px;
        border: 2px solid grey;
        border-radius: 5px;
        background: transparent;
        font-size: 17px;
        color: black;
        padding: 14px;
    }
    img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        background-position: center;
    }
    textarea {
        height: max-content;
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
            margin-bottom: 0.625em;
        }

        table td {
            border-bottom: 1px solid #ddd;
            display: block;
            font-size: 0.8em;
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
