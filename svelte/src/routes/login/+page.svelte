<script>
  import { authHandlers } from "../../store/store";
  import { fade,blur } from 'svelte/transition';
  let email = "";
  let password = "";
  let error = false;
  async function handleAuthenticate() {
    if (!email || !password) {
      error = true;
      return;
    }else if (password.length < 8){
      alert("Password should be at least 8 characters long")
      return;
    }
    if (email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
      try{
      await authHandlers.login(email, password);
    }catch(e){
      alert("Something went wrong!"+e)
    }
    }else{
      alert("Incorrect Email")
    }
  }
</script>

<div class="authContainer">
    <h1>Login</h1>
    <br>
    {#if error}
      <p class="error">One of the fields is blank</p>
    {/if}
    <label>
      <input bind:value={email} type="email" placeholder="Email" required />
    </label>
    <br><br>
    <label>
      <input
        bind:value={password}
        type="password"
        placeholder="Password"
        required
      />
    </label>
    <br><br>

  <button  class="button"
    type="button"
    on:click={handleAuthenticate}
    >Login</button
  >
  <br><br>
  <p>
    Dont have an account?
    <a href="../../register"> Sign Up </a>
  </p>
</div>


<style>
  .authContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  .button{
    background-color:rgb(120, 230, 206) ;
    width:10%;
    min-width:120px;
    color: white;
    text-align: center;
    font-size: 30px;
    border-radius:12px;
    border: none;
    cursor: pointer;
  }
  .button:hover{
    filter:grayscale(0.5),
    
  }

   label {
    background-color:aliceblue;
    width: 300px;
    font-size: 30px;
    border-style: solid;

  }

  p{
    color:black;
  }

  div{
    width: 100%;
    height:500%;
    background-image: linear-gradient(
                rgba(206, 252, 241, 0.9),
                rgba(244, 222, 255, 0.9)
            ),
            url("$lib/images/bgvev1.png");
  }

  h1 {
    text-align: center;
    color:#009688;
    border: 1px;
    border-radius: 5px;
    padding: 2px;
    font-family: sans-serif;
    font-size: xx-large;
  }

  label {
    position: relative;
    border: 1px solid Onavy;
    border-radius: 5px;
  }

  input {
    width: 300px;
    height: 50px;
    border: none;
    background: transparent;
    font-size: 17px;
    color: black;
    padding: 14px;
  }
</style>
