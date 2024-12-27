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
const userName = document.getElementById('user-name');
const userBalance = document.getElementById('user-balance');
const logoutBtn = document.getElementById('logoutBtn');
const channelsList = document.getElementById('channels-list');
const videosList = document.getElementById('videos-list');

// Auto login on page load
auth.onAuthStateChanged(user => {
    if (user) {
        // Show user info and balance
        userName.textContent = `Welcome, ${user.displayName}`;
        getUserBalance(user.uid);
        getUserSubscribedChannels(user.uid);
        getUserWatchedVideos(user.uid);
        document.getElementById('user-info').style.display = 'block';
    } else {
        // Redirect to login page if user is not logged in
        window.location.href = 'login.html';
    }
});

// Logout function
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'login.html';  // Redirect to login page
    }).catch((error) => {
        console.error('Error logging out: ', error);
    });
});

// Get User Balance from Firebase
function getUserBalance(userId) {
    const balanceRef = db.ref('users/' + userId + '/balance');
    balanceRef.once('value', snapshot => {
        const balance = snapshot.val() || 0;
        userBalance.textContent = `Balance: ${balance}`;
    });
}

// Get User Subscribed Channels from Firebase
function getUserSubscribedChannels(userId) {
    const channelsRef = db.ref('users/' + userId + '/channels');
    channelsRef.once('value', snapshot => {
        const channels = snapshot.val() || {};
        channelsList.innerHTML = '';  // Clear previous channels list
        for (let key in channels) {
            const li = document.createElement('li');
            li.textContent = channels[key].channelUrl;
            channelsList.appendChild(li);
        }
    });
}

// Get User Watched Videos from Firebase
function getUserWatchedVideos(userId) {
    const videosRef = db.ref('users/' + userId + '/videos');
    videosRef.once('value', snapshot => {
        const videos = snapshot.val() || {};
        videosList.innerHTML = '';  // Clear previous videos list
        for (let key in videos) {
            const li = document.createElement('li');
            li.textContent = videos[key].videoUrl;
            videosList.appendChild(li);
        }
    });
}
