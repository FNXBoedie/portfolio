// Global variables for posts and markers
let posts = [];
let markers = [];
let map;
let currentUserId;
let isAdmin = false;

// Admin password (in a real app, this would be server-side)
const ADMIN_PASSWORD = 'gentleadmin';

// Generate or retrieve user ID
function initializeUser() {
    const storedUserId = localStorage.getItem('gentleUserId');
    if (storedUserId) {
        currentUserId = storedUserId;
    } else {
        currentUserId = 'user_' + Date.now() + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('gentleUserId', currentUserId);
    }
}

// Check if user is admin
function checkAdminStatus() {
    const storedAdminStatus = localStorage.getItem('gentleAdminStatus');
    if (storedAdminStatus === 'true') {
        isAdmin = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize user and admin status
    initializeUser();
    checkAdminStatus();

    // Setup dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-btn');
    dropdowns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Close all other dropdowns
            dropdowns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.parentElement.classList.remove('active');
                }
            });
            // Toggle current dropdown
            this.parentElement.classList.toggle('active');
        });
    });

    // Handle dropdown item selection
    document.querySelectorAll('.dropdown-content a').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const value = this.dataset.value;
            const dropdownBtn = this.closest('.dropdown').querySelector('.dropdown-btn');
            dropdownBtn.textContent = this.textContent;
            
            // Handle specific dropdown actions
            if (this.closest('form')) {
                // Post type dropdown
                document.getElementById('postType').value = value;
            } else {
                // Filter dropdown
                refreshMarkers(value);
            }
            
            // Close the dropdown
            this.closest('.dropdown').classList.remove('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Default posts that should always be present
    const defaultPosts = [
        {
            id: 'default1',
            type: '',
            title: 'CAW Pannestraat',
            description: 'Digipunt in een Centrum Algemeen Welzijnswerk',
            location: { lat: 51.0630314, lng: 3.7038098 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
        {
            id: 'default1',
            type: '',
            title: 'Wijkkantoor Rabot',
            description: 'Digipunt in een Wijkkantoor',
            location: { lat: 51.0601875, lng: 3.711071 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
        {
            id: 'default1',
            type: '',
            title: 'Kringwinkel Vlaamse Kaai',
            description: 'Digipunt in een kringwinkel',
            location: { lat: 51.044070, lng: 3.741510 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
	 {
            id: 'default1',
            type: '',
            title: 'Kringwinkel UCO',
            description: 'Digipunt in een kringwinkel',
            location: { lat: 51.071849, lng: 3.7140459 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
	 {
            id: 'default1',
            type: '',
            title: 'Kringwinkel Brugsesteenweg',
            description: 'Digipunt in een kringwinkel',
            location: { lat: 51.0686483, lng: 3.6858181 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
        {
            id: 'default1',
            type: '',
            title: 'Stadskantoor',
            description: 'Doe-het-samen balie Stadskantoor Stad Gent',
            location: { lat: 51.0472122, lng: 3.73093 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
        {
            id: 'default1',
            type: '',
            title: 'Bibliotheek de Krook',
            description: 'Digipunt in de Stadsbibliotheek',
            location: { lat: 51.049086, lng: 3.7288502 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
       {
            id: 'default1',
            type: '',
            title: 'Wijkbibliotheek Sint-Amandsberg',
            description: 'Digipunt in een wijkbibliotheek',
            location: { lat: 51.0616959, lng: 3.7453856 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
            {
            id: 'default1',
            type: '',
            title: 'Wijkbibliotheek Brugse Poort',
            description: 'Digipunt in een wijkbibliotheek',
            location: { lat: 51.0625967, lng: 3.6971764 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
             {
            id: 'default1',
            type: '',
            title: 'Wijkbibliotheek Watersportbaan',
            description: 'Digipunt in een wijkbibliotheek',
            location: { lat: 51.0437767, lng: 3.7080733 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },

        {
            id: 'default1',
            type: '',
            title: 'De Woonkamer',
            description: 'Digipunt in een sociale wijk',
            location: { lat: 51.02096633618823, lng: 3.718705773353577 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
        {
            id: 'default1',
            type: '',
            title: 'De Serre',
            description: 'Digipunt in een buurtorganisatie en groeiplek',
            location: { lat: 51.0236304, lng: 3.7194702 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
        {
            id: 'default1',
            type: '',
            title: 'Eetcafé Toreke',
            description: 'Digipunt in een sociaal restaurant',
            location: { lat: 51.0633212, lng: 3.7118666 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
     {
            id: 'default1',
            type: '',
            title: 'AMAL',
            description: 'Digipunt in een Agentschap Inburgering & Integratie',
            location: { lat: 51.0606253, lng: 3.7118666 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
     {
            id: 'default1',
            type: '',
            title: 'Scheldeoord',
            description: 'Digipunt in een Gemeenschapsdienst voor gepensioneerden',
            location: { lat: 51.0494794, lng: 3.7459217 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
     {
            id: 'default1',
            type: '',
            title: 'Jobteam',
            description: 'Digipunt in een Werkpunt voor werkzoekenden',
            location: { lat: 51.0544096, lng: 3.7485595 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },
     {
            id: 'default1',
            type: '',
            title: 'WGC Sint-Amandsberg',
            description: 'Digipunt in een Wijkgezondheidscentrum',
            location: { lat: 51.0521143, lng: 3.74279 },
            timestamp: new Date().getTime(),
            userId: 'default',
            image: './images/digipunt.png'
        },






  
        
   
    ];

    // Get stored posts and ensure default posts are included
    let storedPosts = JSON.parse(localStorage.getItem('gentlePosts')) || [];
    posts = [...defaultPosts, ...storedPosts.filter(post => post.id !== 'default1' && post.id !== 'default2' && post.id !== 'default3')];
    localStorage.setItem('gentlePosts', JSON.stringify(posts));
    
    // Initialize map centered on Ghent, Belgium
    map = L.map('map').setView([51.0543, 3.7174], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    // State management
    let selectedLocation = null;
    posts = JSON.parse(localStorage.getItem('gentlePosts')) || [];
    markers = [];

    // DOM Elements
    const modal = document.querySelector('.modal');
    const postForm = document.getElementById('postForm');
    const closeBtn = document.querySelector('.close');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');

    // Load existing posts
    posts.forEach(post => addMarkerToMap(post));

    // Map click handler
    map.on('click', function(e) {
        if (modal.classList.contains('active')) {
            selectedLocation = e.latlng;
            // Show visual feedback
            L.popup()
                .setLatLng(e.latlng)
                .setContent('Location selected!')
                .openOn(map);
        }
    });

    // Image preview functionality
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                imagePreview.classList.add('has-image');
            };
            reader.readAsDataURL(file);
        }
    });

    // Form submission handler
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!selectedLocation) {
            alert('Please click on the map to set a location');
            return;
        }

        // Get the image data if an image was uploaded
        const imageData = imagePreview.querySelector('img')?.src || null;

        const newPost = {
            id: Date.now(),
            userId: currentUserId,
            type: document.getElementById('postType').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            location: selectedLocation,
            image: imageData,
            timestamp: new Date().toISOString()
        };

        posts.push(newPost);
        localStorage.setItem('gentlePosts', JSON.stringify(posts));
        
        addMarkerToMap(newPost);
        modal.classList.remove('active');
        postForm.reset();
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('has-image');
        selectedLocation = null;
    });

    // Add marker to map function
    function addMarkerToMap(post) {
        // Create marker with different colors based on post type
        const markerIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-pin ${post.type === 'request' ? 'red' : 'green'}"></div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        const marker = L.marker(post.location, { icon: markerIcon }).addTo(map);
        
        const canDelete = isAdmin || post.userId === currentUserId;
        const deleteButton = canDelete ? 
            `<button onclick="deletePost(${post.id})" class="delete-btn">Delete Post</button>` : '';
        
        const imageHtml = post.image ? 
            `<img src="${post.image}" alt="Post image">` : '';
        
        const popupContent = `
            <div class="post-popup">
                <div class="post-type">${post.type}</div>
                <h3>${post.title}</h3>
                ${imageHtml}
                <p>${post.description}</p>
                ${deleteButton}
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push({ marker, post });
    }

    // Add admin login button to header
    

    // Modal controls
    const newPostBtn = document.getElementById('newPostBtn');
    newPostBtn.onclick = () => {
        modal.classList.add('active');
        selectedLocation = null;
    };

    closeBtn.onclick = () => {
        modal.classList.remove('active');
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    };

    // Refresh all markers on the map
    function refreshMarkers(filterValue = 'all') {
        // Clear existing markers
        markers.forEach(({ marker }) => marker.remove());
        markers = [];

        // Add filtered markers
        posts.forEach(post => {
            if (filterValue === 'all' || post.type === filterValue) {
                addMarkerToMap(post);
            }
        });
    }

    // Delete post function
    window.deletePost = function(postId) {
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        // Check if user has permission to delete
        if (!isAdmin && post.userId !== currentUserId) {
            alert('You do not have permission to delete this post');
            return;
        }

        // Find the post index
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        // Remove the marker from the map
        const markerIndex = markers.findIndex(m => m.post.id === postId);
        if (markerIndex !== -1) {
            markers[markerIndex].marker.remove();
            markers.splice(markerIndex, 1);
        }

        // Remove the post from the array
        posts.splice(postIndex, 1);

        // Update localStorage
        localStorage.setItem('gentlePosts', JSON.stringify(posts));
    };
});
