<script>
  import { goto } from "$app/navigation";
</script>

<div class="banner">
  <div class="navbar">
    <img src="healthlink.png" class="logo" />
    <ul>
      <li><a href="./login">Log in</a></li>
      <li><a href="./register">Sign up</a></li>
    </ul>
  </div>
  <div class="content">
    <div><span>Affordable health-care<br />at your Fingertips</span></div>
    <div>
      <button
        type="button"
        on:click={function () {
          goto("/login");
        }}>CHAT NOW</button
      >
    </div>
  </div>
</div>

<div class="pg2">
  <h1>What do we Offer?</h1>
  <div class="feature">
    <div><img src="feat_img1 (2).png" class="feat_img" /></div>
    <div>
      <h2>Chat with Doctors 24x7</h2>
      <span
        >Get access to our specialist team of doctors, instantly with just a few
        clicks on your phone.
      </span>
    </div>
  </div>
  <!-- <img src="arrow-4.png" class="pic2"> -->
  <div class="feature" id = "feature2">
    <div>
      <h2>Instant Reports</h2>
      <span
        >Had a Consulation/Chat? Get an instant report from your doctor
        diagonsing your condition for further references.
      </span>
    </div>
    <div><img src="feat_img2 (2).png" class="feat_img" /></div>
  </div>
  <!-- <img src="arrow-4.png" class="pic3"> -->
  <div class="feature">
    <div><img src="feat_img3 (2).png" class="feat_img" /></div>
    <div>
      <h2>Our Advanced Chatbot</h2>
      <span
        >For lessening the burden on our specialists, our highly trained
        chatbot, will first help us in identifying all your symptoms and medical
        history.
      </span>
    </div>
  </div>
</div>

<div class="pg3">
  <h1>Our Specialists</h1>
  <div class="Testimonials">
    <div class="person">
      <div><img src="doc_1.png" class="test_img" /></div>
      <div><h3>Dr. Kunal</h3></div>
      <div><h4>General Practioner</h4></div>
    </div>

    <div class="person">
      <div><img src="doc_2.png" class="test_img" /></div>
      <div><h3>Dr. Geeta Kumar</h3></div>
      <div><h4>Pediatrician</h4></div>
    </div>

    <div class="person">
      <div><img src="doc_3.png" class="test_img" /></div>
      <div><h3>Dr. John Smith</h3></div>
      <div><h4>Cardiologist</h4></div>
    </div>
  </div>
</div>
<div class="pg4">
  <h1>What do People Say?</h1>
  <div class="Testimonials">
    <div class="person">
      <div><img src="pat_1.png" class="test_img" /></div>
      <div><h3>Julia</h3></div>
      <div>
        <p>
          Moving to a new country can be overwhelming, especially when it comes
          to healthcare. HealthLink bridged the gap for me. I consulted with a
          doctor who not only understood my health concerns but also guided me
          through the local healthcare system. HealthLink truly made me feel at
          home, even miles away.
        </p>
      </div>
    </div>
    <div class="person">
      <div><img src="pat_2.png" class="test_img" /></div>
      <div><h3>Rahul</h3></div>
      <div>
        <p>
          Living in a bustling city, I found it challenging to schedule doctor
          visits. HealthLink made healthcare accessible right from my
          smartphone. The prompt and professional advice I received from an
          Indian doctor online was reassuring. HealthLink has become my go-to
          for medical guidance.
        </p>
      </div>
    </div>

    <div class="person">
      <div><img src="pat_3.png" class="test_img" /></div>
      <div><h3>Aishwariya</h3></div>
      <div>
        <p>
          Being a working professional and a mom, time is a precious commodity.
          HealthLink has been a lifesaver for me. I connected with a wonderful
          gynecologist who provided excellent guidance and support during my
          pregnancy. It's like having a trusted doctor at my fingertips.
        </p>
      </div>
    </div>
  </div>
</div>
<div class="footer">
  <span>Copyright 2023-24 HealthLink</span>
  <span>Built for ByteSynergy 2.0</span>
  <a href = "/terms">Terms of Service & Privacy Policy</a>
</div>

<style>
  .banner {
    width: 100%;
    min-height: 75vh;
    height: fit-content;
    background-image: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
      url("$lib/images/background-image.jpg");
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .footer {
    background-color: #009688;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .navbar {
    width: 85vw;
    /* margin: auto; */
    padding: 35px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100px;
  }

  .logo {
    width: 170px;
    cursor: pointer;
  }

  .navbar ul li {
    list-style: none;
    display: inline-block;
    margin: 0 20px;
    position: relative;
  }
  .navbar ul li a {
    text-decoration: none;
    color: #fff;
    padding: 5px;
  }
  .navbar ul li::after {
    content: "";
    height: 3px;
    width: 0;
    background: rgb(120, 230, 206);
    position: absolute;
    left: 0;
    bottom: -10px;
    transition: 0.5s;
  }
  .navbar ul li:hover::after {
    width: 100%;
  }

  .content {
    width: 100%;
    text-align: center;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: center;
  }
  .content span {
    font-size: min(60px, 10vh);
    margin-top: 80px;
    font-weight: bold;
  }

  button {
    width: 200px;
    padding: 15px 0;
    text-align: center;
    margin: 20px 20px;
    border-radius: 25px;
    font-weight: bold;
    border: 2px solid #009688;
    background: transparent;
    color: #fff;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  /* button:hover span 
    {  
        width: 100%;
    } */
  button:hover {
    border: none;
  }

  .pic1 {
    position: absolute;
    width: 45vw;
    height: 80vh;
    right: 0vw;
    top: 50vh;
  }

  .pg2 {
    width: 100%;
    height: 250vh;
    background-color: rgb(206, 252, 241);
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    color: #96000e;
    background-image: linear-gradient(
        rgba(206, 252, 241, 0.9),
        rgba(244, 222, 255, 0.9)
      ),
      url("$lib/images/bgvev1.png");
    /* background-image: linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75)),url(background-image.jpg); */
  }

  .pg2 h1 {
    font-size: min(60px, 7vh);
    /* margin-left: 25%;
        margin-top: 5%; */
  }
  .feat_img {
    width: 100%;
    height: 100%;
  }

  .feature {
    width: 100%;
    position: relative;
    text-align: center;
    color: #009688;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
  }
  .feature:nth-child(2n+1) {
    flex-direction: column-reverse;
  }

  .feature div {
    width: 45%;
    min-width: 250px;
    transition: 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .feature div h2 {
    font-size: 25px;
  }
  .feature div span {
    max-width: 400px;
  }

  .feature div img:hover {
    transform: scale(1.1);
  }

  .feature div img:hover {
    transform: scale(1.1);
  }
  .pic3 {
    position: relative;
    width: 45vw;
    height: 80vh;
    top: 5vh;
    left: 55vw;
  }
  .pg3 {
    width: 100%;
    height: max-content;
    background-color: rgb(244, 222, 255);
    background-size: cover;
    background-position: center;
    color: #96000e;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
  }

  .pg4 {
    background-size: cover;
    background-position: center;
    color: #96000e;
    background-image: linear-gradient(
      rgba(244, 222, 255, 0.9),
      rgba(206, 252, 241, 0.9)
    );
    width: 100%;
    height: max-content;
    background-color: rgb(244, 222, 255);
    background-size: cover;
    background-position: center;
    color: #96000e;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
  }

  .pg3 h1 {
    font-size: min(40px, 7vh);
    text-align: center;
  }

  .Testimonials {
    margin-top: 8vh;
    width: 100%;
    /* height: 25%; */
    position: relative;
    text-align: center;
    color: #96000e;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    align-content: space-between;
  }

  .person {
    width: 25vw;
    min-width: 300px;
    margin-top: 3vh;
    margin-bottom: 3vh;
    margin-left: 1vw;
    margin-right: 1vw;
    /* margin-left: 5vw; */
    border-radius: 25px;
    font-weight: bold;
    border: 0px solid rgb(244, 222, 255);
    background: transparent;
    box-shadow: 0px 0px 0px rgb(244, 222, 255);
    transition: 0.2s;
  }

  /* .person:hover {
    box-shadow: 10px 5px 5px rgb(244, 222, 255);
    border: 3px solid rgb(244, 222, 255);
  } */
  .person div {
    margin-bottom: 3vh;
    text-align: left;
  }
  .person h4,p {
    text-align: center;
    color: #009688;
    /* margin-left: 3%; */
  }
  .person h3 {
    text-align: center;
    /* margin-left: 3vw; */
  }
  .person p {
    text-align: center;
    /* margin-left: 3vw; */
  }

  .test_img {
    width: 100%;
    height: 90%;
    border-radius: 25px;
  }
</style>
