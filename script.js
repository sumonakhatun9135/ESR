// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpzM7EACh81Dj99bSAB9hXE_I_lMItKD8",
    authDomain: "view-b81bc.firebaseapp.com",
    projectId: "view-b81bc",
    storageBucket: "view-b81bc.appspot.com",
    messagingSenderId: "119614101112",
    appId: "1:119614101112:web:33c0b9e877516bcaaebf8d",
    measurementId: "G-STRSPVQ4GP"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const subscribeBtn = document.getElementById('subscribeBtn');
const watchBtn = document.getElementById('watchBtn');
const statusMessage = document.getElementById('status-message');
const userName = document.getElementById('user-name');
const userBalance = document.getElementById('user-balance');
const channelUrlInput = document.getElementById('channel-url');
const videoUrlInput = document.getElementById('video-url');

// Login function
loginBtn.addEventListener('click', async () => {
    const provider = new firebase.auth.TelegramAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        userName.textContent = `Welcome, ${user.displayName}`;
        getUserBalance(user.uid);
        statusMessage.textContent = 'Logged in successfully';
        document.getElementById('user-info').style.display = 'block';
        loginBtn.style.display = 'none';
    } catch (error) {
        statusMessage.textContent = `Error: ${error.message}`;
    }
});

// Logout function
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        userName.textContent = '';
        userBalance.textContent = 'Balance: 0';
        document.getElementById('user-info').style.display = 'none';
        loginBtn.style.display = 'block';
        statusMessage.textContent = 'Logged out successfully';
    }).catch((error) => {
        statusMessage.textContent = `Error: ${error.message}`;
    });
});

// Subscribe to channel
subscribeBtn.addEventListener('click', () => {
    const channelUrl = channelUrlInput.value;
    const user = auth.currentUser;
    if (user && channelUrl) {
        const userId = user.uid;
        const userRef = db.ref('users/' + userId);
        userRef.child('balance').once('value', (snapshot) => {
            const balance = snapshot.val() || 0;
            if (balance >= 20) {
                // Deduct 20 coins for subscribing
                userRef.child('balance').set(balance - 20);
                showNotification('Subscription Successful', 'You have been subscribed to the channel. 20 coins deducted!');
                statusMessage.textContent = 'Subscribed successfully! 20 coins deducted.';
            } else {
                statusMessage.textContent = 'Insufficient balance to subscribe.';
            }
        });
    } else {
        statusMessage.textContent = 'Please log in and enter a channel URL.';
    }
});

// Watch video
watchBtn.addEventListener('click', () => {
    const videoUrl = videoUrlInput.value;
    const user = auth.currentUser;
    if (user && videoUrl) {
        const userId = user.uid;
        const userRef = db.ref('users/' + userId);
        userRef.child('balance').once('value', (snapshot) => {
            const balance = snapshot.val() || 0;
            if (balance >= 20) {
                // Deduct 20 coins for watching video
                userRef.child('balance').set(balance - 20);
                showNotification('Video Watched', 'You have watched the video. 20 coins deducted!');
                statusMessage.textContent = 'Video watched successfully! 20 coins deducted.';
            } else {
                statusMessage.textContent = 'Insufficient balance to watch video.';
            }
        });
    } else {
        statusMessage.textContent = 'Please log in and enter a video URL.';
    }
});

// Show notification function
function showNotification(title, body) {
    if (Notification.permission === 'granted') {
        new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                new Notification(title, { body });
            }
        });
    }
}

// Get user balance
function getUserBalance(userId) {
    const balanceRef = db.ref('users/' + userId + '/balance');
    balanceRef.once('value', (snapshot) => {
        const balance = snapshot.val() || 0;
        userBalance.textContent = `Balance: ${balance}`;
    });
}
