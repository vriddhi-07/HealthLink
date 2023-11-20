<script>
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    $: if (browser) {
        console.log($page.params.slug)
        goto("/"+$page.params.slug.replaceAll("~","/"))
    }
</script>