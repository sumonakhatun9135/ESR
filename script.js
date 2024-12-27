// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpzM7EACh81Dj99bSAB9hXE_I_lMItKD8",
    authDomain: "view-b81bc.firebaseapp.com",
    databaseURL: "https://view-b81bc-default-rtdb.firebaseio.com",
    projectId: "view-b81bc",
    storageBucket: "view-b81bc.appspot.com",
    messagingSenderId: "119614101112",
    appId: "1:119614101112:web:33c0b9e877516bcaaebf8d",
    measurementId: "G-STRSPVQ4GP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Telegram WebApp Initialization
const tg = window.Telegram.WebApp;
const user = tg.initDataUnsafe.user;

// Elements
const userBalance = document.getElementById('user-balance');
const channelList = document.getElementById('channel-list');
const videoList = document.getElementById('video-list');
const submitForm = document.getElementById('submit-form');

// Initialize User
const userId = user.id.toString();
initializeUser(userId);
getUserBalance(userId);
loadChannels();
loadVideos();

// Initialize User Data
function initializeUser(uid) {
    const userRef = db.ref(`users/${uid}`);
    userRef.once('value').then(snapshot => {
        if (!snapshot.exists()) {
            userRef.set({ balance: 0 });
        }
    });
}

// Fetch User Balance
function getUserBalance(uid) {
    const balanceRef = db.ref(`users/${uid}/balance`);
    balanceRef.on('value', snapshot => {
        const balance = snapshot.val() || 0;
        userBalance.textContent = `Balance: ${balance} Coins`;
    });
}

// Load Channels
function loadChannels() {
    db.ref('channels').once('value').then(snapshot => {
        const channels = snapshot.val();
        channelList.innerHTML = '';
        for (let key in channels) {
            const channel = channels[key];
            const li = document.createElement('li');
            li.innerHTML = `
                ${channel.name}
                <a href="${channel.url}" target="_blank">Visit</a>
                <button onclick="subscribe('${key}')">Subscribe</button>
            `;
            channelList.appendChild(li);
        }
    });
}

// Load Videos
function loadVideos() {
    db.ref('videos').once('value').then(snapshot => {
        const videos = snapshot.val();
        videoList.innerHTML = '';
        for (let key in videos) {
            const video = videos[key];
            const li = document.createElement('li');
            li.innerHTML = `
                ${video.title}
                <a href="${video.url}" target="_blank">Watch</a>
                <button onclick="watch('${key}')">Earn Coins</button>
            `;
            videoList.appendChild(li);
        }
    });
}

// Submit Channel or Video
submitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;

    const refPath = type === 'channel' ? 'channels' : 'videos';
    const newEntry = {
        name: title,
        url: url,
        userId: userId
    };

    db.ref(refPath).push(newEntry).then(() => {
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} submitted successfully!`);
        submitForm.reset();
        if (type === 'channel') {
            loadChannels();
        } else {
            loadVideos();
        }
    }).catch(error => {
        console.error('Error submitting data:', error);
    });
});

// Subscribe to Channel
function subscribe(channelId) {
    db.ref(`users/${userId}/balance`).transaction(balance => {
        return (balance || 0) + 20;
    }).then(() => {
        alert('Subscribed! You earned 20 Coins.');
        db.ref(`channels/${channelId}`).remove();
        loadChannels();
    });
}

// Watch Video
function watch(videoId) {
    db.ref(`users/${userId}/balance`).transaction(balance => {
        return (balance || 0) + 20;
    }).then(() => {
        alert('Video Watched! You earned 20 Coins.');
        db.ref(`videos/${videoId}`).remove();
        loadVideos();
    });
}
