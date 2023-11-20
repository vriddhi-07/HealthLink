<script>
    import { page } from "$app/stores";
    import { db } from "../lib/firebase/firebase"
    import { authStore,dataStore,authHandlers,extraStore } from "../store/store";
    import { goto } from "$app/navigation";
    import { get } from "svelte/store"
    import { fade,blur } from 'svelte/transition';
    let dataLocal = null
    const unsubscribe = dataStore.subscribe((value) => {
        dataLocal = value.basicinfo
    });
    let extraLocal = null
    const unsubscribe2 = extraStore.subscribe((value) => {
        extraLocal = value
    });
    
</script>
<div class="container">
    <div class="left_sidebar">
        <div class="menu_items">
            <div class="menu_item" id = "title_logo">HealthLink</div>
            <div class="menu_item" id = "title_logo_small"></div>
            <div class="menu_item"  on:click={function(){goto("/dashboard")}} chosen = {$page.url.pathname.split("/")[1]=="dashboard"? "true":"false"}>
                <i class="bx bxs-dashboard" />
                <p>Dashboard</p>
            </div>
            <div class="menu_item" on:click={function(){goto("/chat")}} chosen = {$page.url.pathname.split("/")[1]=="chat"? "true":"false"}>
                <i class="bx bx-message-rounded-dots" />
                <p>Conversations</p>
                <i class="fa-regular fa-circle-2" />
            </div>
            <div class="menu_item" on:click={function(){goto("/reports")}} chosen = {$page.url.pathname.split("/")[1]=="reports" || $page.url.pathname.split("/")[1]=="edit_reports"? "true":"false"}>
                <i class="bx bx-calendar" />
                <p>Reports</p>
            </div>
            <!-- <div class="menu_item" on:click={function(){goto("/appointments")}}>
                <i class="bx bx-file-blank" />
                <p>Appointments</p>
            </div> -->
            <div class="menu_item" on:click={function(){goto("/profile")}} chosen = {$page.url.pathname.split("/")[1]=="profile"? "true":"false"}>
                <i class="bx bx-user-circle" />
                <p>Profile</p>
            </div>
            <div class="menu_item" on:click={async function(){await authHandlers.logout()}}>
                <i class="bx bx-log-out" />
                <p>Log Out</p>
            </div>
        </div>
    </div>
    <div class="main_content" out:blur={{ duration: 0 }} in:blur={{ duration: 300 }}>
        <slot/>
    </div>
    <div class="right_sidebar">
        <div class="profile">
            <div class="img">
                <img
                    src={dataLocal.profile_picture}
                    alt="studentImg "
                />
            </div>
            <div class="name_and_class">
                <p>{dataLocal.name}</p>
                <span>{#if dataLocal.is_doctor}Doctor{:else}User{/if}</span>
            </div>
        </div>
        <span>Key Statistics</span>
        <div class = "click_btn" style="background-color: #1ebfc4;color:white"><span>No. of Conversations<br>{extraLocal.chatcount}</span></div>
        <div class = "click_btn" style="background-color: #E91E63;color:white"><span>No. of Reports<br>{extraLocal.reportcount}</span></div>
    </div>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Nunito", sans-serif;
        color: black;
    }
    .click_btn {
        width: 80%;
        height: max-content;
        min-height: 50px;
        color: white;
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 10px;
        cursor:pointer;
        margin:10px;
    }
    .click_btn span{
        color:white;
    }
    :root {
        --grey-color: #b1adad;
        --border-color: #e7e8ea;
    }
    #title_logo:hover{
        background-color: transparent;
    }
    #title_logo{
        font-size:26px;
        color:black;
    }
    #title_logo_small{
        display: none;
    }
    .container {
        display: flex;
        height: 100%;
        letter-spacing: 1px;
        width:100vw;
        background-image: linear-gradient(
                rgba(206, 252, 241, 0.9),
                rgba(244, 222, 255, 0.9)
            ),
            url("$lib/images/bgvev1.png");
    }

    /*----- Left SideBar -----*/

    .left_sidebar {
        width: 20vw;
        position: sticky;
        top: 0px;
        align-self: flex-start;
        transition: all 0.3s ease-in-out;
        height:100%;
        border-right:#000 2px solid;
        display:flex;
        flex-direction: column;
        align-items: center;
    }

    .left_sidebar .close_hamburger_btn {
        position: absolute;
        top: 30px;
        left: 30px;
        font-size: 34px;
        cursor: pointer;
        color: #000;
        display: none;
    }

    .logo {
        min-width:50px;
        min-height:50px;
        background-size:contain;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url("$lib/images/favicon.png");
    }
    .left_sidebar .menu_items .menu_item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 17px;
        color: var(--grey-color);
        padding: 20px 30px;
        cursor: pointer;
        width:20vw;
    }

    /*----- Main Content -----*/

    .main_content {
        width: 60vw;
        display: flex;
        flex-direction: column;
        padding: 0 20px;
        transition: all 0.3s ease-in-out;
        overflow-y: scroll;
    }
    /*----- Right SideBar -----*/

    .right_sidebar {
        width:20vw;
        position: sticky;
        top: 0px;
        align-self: flex-start;
        transition: all 0.3s ease-in-out;
        margin:5px;
        margin-top:0px;
        margin-bottom: 0px;
        padding-left: 5px;
        height:100%;
        min-width:200px;
        border-left:#000 2px solid;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .profile {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        margin-bottom: 30px;
        gap: 15px;
    }

    .profile img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        background-position: center;
    }

    .profile .name_and_class {
        text-align: center;
    }

    .profile .name_and_class P {
        font-weight: 600;
    }

    .profile .name_and_class span {
        font-size: 14px;
        color: var(--grey-color);
    }

    .profile .about h4,
    .profile .other_info h4 {
        font-weight: 600;
        font-size: 14px;
    }

    .profile .about p,
    .profile .other_info p {
        font-size: 12px;
        margin-top: 10px;
        color: var(--grey-color);
    }

    .profile .other_info {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
    }

    .profile .student_from_same_class img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        background-position: center;
        margin-left: -8px;
    }

    .profile .student_from_same_class img:nth-child(1) {
        margin-left: 0 !important;
    }
    .menu_item:hover{
        background-color: #5bb9c0;
    }
    .profile .student_from_same_class h4 {
        font-weight: 600;
        font-size: 14px;
        margin: 10px 0;
    }
    .profile .student_same_class_img span {
        color: #5bb9c0;
        font-size: 14px;
        margin-left: 12px;
    }
    @media print {
        .left_sidebar{
            display: none;
        }
        .right_sidebar{
            display: none;
        }
        body {
            height:max-content;
        }
        .main_content{
            height:max-content;
            width:100%;
        }
    }
    .menu_item[chosen="true"]{
        background-color: #5bb9c0;
    }
    @media screen and (max-width:940px){
        .menu_item p{
            display:none;
        }
        .right_sidebar {
            display:none;
        }
        .main_content{
            width:80vw;
        }
        .left_sidebar .menu_items .menu_item{
            width:90px;
        }
        #title_logo_small{
            display:block;
            background-image: url("$lib/images/favicon.png");
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            margin-top:5px;
        }
        #title_logo{
            display:none; 
            background-image: url("$lib/images/favicon.png");
        }
    }
</style>