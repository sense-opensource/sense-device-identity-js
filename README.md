<h1>Sense Device Identity JS</h1>

<p width="100%">
    <a href="https://github.com/sense-opensource/sense-device-identity-js/blob/main/LICENSE">
        <img width="9%" src="https://custom-icon-badges.demolab.com/github/license/denvercoder1/custom-icon-badges?logo=law">
    </a> 
    <img width="12.6%" src="https://badge-generator.vercel.app/api?icon=Github&label=Last%20Commit&status=May&color=6941C6"/> 
    <a href="https://discord.gg/hzNHTpwt">
        <img width="10%" src="https://badge-generator.vercel.app/api?icon=Discord&label=Discord&status=Live&color=6941C6"> 
    </a>
</p>
<p width="100%">  
<img width="4.5%" src="https://custom-icon-badges.demolab.com/badge/Fork-orange.svg?logo=fork"> 
<img width="4.5%" src="https://custom-icon-badges.demolab.com/badge/Star-yellow.svg?logo=star"> 
<img width="6.5%" src="https://custom-icon-badges.demolab.com/badge/Commit-green.svg?logo=git-commit&logoColor=fff"> 
</p>

### 🛡️ Device Identity

![Device](https://img.shields.io/badge/Device_Information-blue)
![Browser](https://img.shields.io/badge/Browser_Information-green)
![Screen](https://img.shields.io/badge/Screen_Information-orange)
![Battery](https://img.shields.io/badge/Battery_Information-yellow)
![Timezone](https://img.shields.io/badge/Timezone_Information-red)
![WebRTC](https://img.shields.io/badge/WebRTC_Information-purple)
![Connection](https://img.shields.io/badge/Connection_Information-brightgreen)


<p> Sense is a client side library that enables you to identify users by pinpointing their hardware and software characteristics. This is done by computing a token that stays consistent in spite of any manipulation.</p>

<h3>Getting started with Sense </h3>

#### Bash
```bash
    # Install all dependencies (including dev dependencies)
    npm install
    # or
    npm i

    # Run the playground locally
    npm run playground

    # Build the project and generate the dist folder
    npm run build
```
### JS Integration
```js
    // Include the Sense library 
    <script src="https://cdn.getsense.co/js/v1/senseos/sense-device-identity-js"></script>

    // 🌎 Setting allowGeoLocation to true prompts the browser to ask for the user's location
    SenseOS.initSDK({ allowGeoLocation: false })
    .then((data) => {
        const { senseId, getSenseDetails, score } = data;

        // ✅ Your code logic here
    })
    .catch((error) => {
        console.error(error.message); // ❌ Handle initialization error
    });
``` 

<h4>Plug and play, in just 4 steps</h3>  

1️⃣ Visit the GitHub Repository</br>
2️⃣ Download or Clone the Repository. Use the GitHub interface to download the ZIP file, or run.</br>
3️⃣ Run the Installer / Setup Script. Follow the setup instructions provided below.</br>
4️⃣ Start Testing. Once installed, begin testing and validating the accuracy of the metrics you're interested in.</br>

#### With Sense, you can  

✅ Predict user intent : Identify the good from the bad visitors with precision  
✅ Create user identities : Tokenise events with a particular user and device  
✅ Custom risk signals : Developer specific scripts that perform unique functions  
✅ Protect against Identity spoofing : Prevent users from impersonation  
✅ Stop device or browser manipulation : Detect user behaviour anomalies 

### Resources 

#### MIT license : 

Sense OS is available under the <a href="https://github.com/sense-opensource/sense-device-identity-js/blob/main/LICENSE"> MIT license </a>

#### Contributors code of conduct : 

Thank you for your interest in contributing to this project! We welcome all contributions and are excited to have you join our community. Please read these <a href="https://github.com/sense-opensource/sense-device-identity-js/blob/main/code_of_conduct.md"> code of conduct </a> to ensure a smooth collaboration.

#### Where you can get support :     
![Gmail](https://img.shields.io/badge/Gmail-D14836?logo=gmail&logoColor=white)       product@getsense.co 

Public Support:

For questions, bug reports, or feature requests, please use the Issues and Discussions sections on our repository. This helps the entire community benefit from shared knowledge and solutions.

Community Chat:

Join our Discord server (link) to connect with other developers, ask questions in real-time, and share your feedback on Sense.

Interested in contributing to Sense?

Please review our <a href="https://github.com/sense-opensource/sense-device-identity-js/blob/main/CONTRIBUTING.md"> Contribution Guidelines </a> to learn how to get started, submit pull requests, or run the project locally. We encourage you to read these guidelines carefully before making any contributions. Your input helps us make Sense better for everyone!
