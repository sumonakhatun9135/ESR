
// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Global Variables
let username = "";
let balance = 0;
let dailyAdCount = 0;

// Telegram WebApp Integration
if (window.Telegram.WebApp) {
    const webApp = Telegram.WebApp;

    // Get Telegram User Info
    username = webApp.initDataUnsafe.user.username || "Guest";
    document.getElementById("username").textContent = username;

    // Fetch User Balance
    db.ref(`users/${username}`).on("value", (snapshot) => {
        const data = snapshot.val();
        balance = data?.balance || 0;
        document.getElementById("balance").textContent = `${balance} ESR`;
    });

    // Expand WebApp
    webApp.expand();
}

// Verify Task
document.getElementById("verifyTaskBtn").addEventListener("click", () => {
    const inputCode = document.getElementById("verificationCode").value.trim();

    // Verify Code
    db.ref("tasks/verifyCode").once("value", (snapshot) => {
        const validCode = snapshot.val();
        if (inputCode === validCode) {
            alert("Task Verified!");
            balance += 20; // Add Reward
            db.ref(`users/${username}`).update({ balance });
        } else {
            alert("Invalid Code!");
        }
    });
});

// Daily Reward
document.getElementById("dailyRewardBtn").addEventListener("click", () => {
    if (dailyAdCount < 5) {
        // Show Ad
        window.open("https://bid.onclckstr.com/vast?spot_id=6049562", "_blank");

        // Add Reward
        dailyAdCount++;
        balance += 10;
        db.ref(`users/${username}`).update({ balance });
        document.getElementById("rewardLimit").textContent = `You have ${5 - dailyAdCount} ads left today`;
    } else {
        alert("Daily limit reached!");
    }
});
