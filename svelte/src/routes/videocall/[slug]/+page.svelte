<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { browser } from "$app/environment";
    import { onDestroy } from "svelte";
    import { onMount } from 'svelte';
    import Dashboard from "../../../components/Dashboard.svelte";
    onMount(async()=>{
        let parentNode;
        let api;
        function initializeVideoCall(t) {
            const domain = "meet.engagemedia.org/";
            const options = {
                roomName: $page.params.slug,
                width: "100%",
                height: "100%",
                parentNode: document.getElementById("meet"),
            };
            api = new JitsiMeetExternalAPI(domain, options);
            api.on("readyToClose", () => {
                api.dispose();
                document.getElementById("meet").innerText = "Meeting has Ended! You will be redirected soon."
                goto("/r/chat~"+$page.params.slug.substring(0,$page.params.slug.length-6))
                api = null;
            });
        }
        initializeVideoCall()
    })
</script>

<Dashboard>
    <div id="meet" style = "width:100%;height:99vh;margin:0px;padding:0px;"></div>
</Dashboard>
