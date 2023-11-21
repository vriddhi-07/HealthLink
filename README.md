# HealthLink
Live Demo: [healthlink5.netlify.app](https://healthlink5.netlify.app)  
Team Ctrl C, Ctrl V  
Built with ❤️ for ByteSynergy 2.0


 

## Problem Statement
The challenge at hand is to design and develop an advanced tele-health platform that redefines the landscape of remote medical consultations. This platform should cater to the vision of enabling individuals, regardless of their location, to access timely medical assistance seamlessly. The focus is on creating an integrated system that employs chat, audio calls, and video calls to connect patients with the right level of medical expertise based on the severity of their case
## Tech Stack and Architecture
We are using the Svelte, OpenAI ChatGPT 3.5, Firebase Firestore, Firebase Auth, Jitsi Meet as our tech Stack.
## Deployment

To deploy this project locally,   
1. Clone this project to your computer by using the download with Zip button. 
2. Unzip the Files, and then Go to the svelte folder. 
3. Create a new project in Firebase, and then create a new app in Firebase, and then enable Firebase Auth and Firebase Firestore. 
4. Now get the API Credentials, and then store them in the `svelte\src\lib\firebase\firebase.js` file, in the `firebaseConfig` variable. 
5. Go to `platform.openai.com` and generate a new API Key. 
6. Store this API Key at `svelte\src\routes\chat\[chatID]\+page.svelte` under the OpenAI config variable(`openai`)
7. Now install all required dependencies, using `npm install` after running it inside the `svelte` folder using the command line interface.
8. Then type `npm run dev` to run your own local instance of the project. 



## Challenges We Ran Into
As this was our first hackathon, we initially had to learn a few new concepts and languages. We decided to go for Svelte instead of React or Angular, as it had a smaller learning curve as compared to the latter, and used a similar syntax to that of Vanilla JS. 
Firebase provided easy to use API’s for handling Authentication, and Database management, hence we decided to stick with them. Now since it was not feasible for us, to make our own LLM model to perform chat conversations, from scratch, we decided to use ChatGPT 3.5 Turbo provided by OpenAI. 
Later on, we had to work upon the Severity routing part, and luckily ChatGPT now introduced, the Function Calling where, ChatGPT now gives JSON Outputs, and hence predictable responses. 
To ensure security and privacy of user data, we have implemented robust Firebase Security rules, to prevent un-authorized access, to sensitive user information. 
We also 
To offer one-to-one meetings between the doctors and patients, we tried to initially find an Open Source software, to help do the Video communications. Luckily we stumbled upon Jitsi Meet, and we ended up, using one of their Contributor servers, to take care of hosting. 
For future scopes, we can always transition from OpenAI to Azure Cloud, to help scale the service. We can also host the Jitsi Instance ourselves on the cloud, to prevent reliance on external community contributor servers. 
Note: OpenAI recently lowered the No. of requests per minute, to 3, for the free tier in which the public deployment is running in. 
## Future Scope
-	We can add additional services such as Scheduling of Doctor Appointments. 
-	We also plan to add a blog section, and self-help videos to further enhance the experience of our visitors.
-	Implement End-To-End Encryption on our user conversation with the doctors, which could be done using Private-Public key cryptography. 
-	To ensure sustainability of the platform, we can add a subscription based model to further incentivize our doctors, help better our services, and cover operational costs.