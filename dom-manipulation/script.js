// Quote data structure and state management
let quotes = [
    // Default quotes with new id and timestamp fields
    { id: '1', text: "The only way to do great work is to love what you do.", category: "inspiration", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', text: "Life is what happens when you're busy making other plans.", category: "life", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', text: "The future belongs to those who believe in the beauty of their dreams.", category: "motivation", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', text: "Whoever is happy will make others happy too.", category: "happiness", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

// Server simulation constants
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API endpoint
const SYNC_INTERVAL = 30000; // Sync every 30 seconds

// Sync management variables
let lastSyncTime = null;
let isSyncing = false;
let syncIntervalId = null;

// DOM Elements (updated with new sync-related elements)
const elements = {
    quoteDisplay: document.getElementById('quoteDisplay'),
    newQuoteBtn: document.getElementById('newQuote'),
    categorySelect: document.getElementById('categorySelect'),
    toggleFormBtn: document.getElementById('toggleForm'),
    addQuoteForm: document.getElementById('addQuoteForm'),
    newQuoteText: document.getElementById('newQuoteText'),
    newQuoteCategory: document.getElementById('newQuoteCategory'),
    addQuoteBtn: document.getElementById('addQuoteBtn'),
    exportBtn: document.getElementById('exportBtn'),
    importBtn: document.getElementById('importBtn'),
    importFile: document.getElementById('importFile'),
    syncStatus: document.getElementById('syncStatus'),
    lastSyncTime: document.getElementById('lastSyncTime'),
    manualSyncBtn: document.getElementById('manualSyncBtn'),
    resolveConflictBtn: document.getElementById('resolveConflictBtn'),
    conflictModal: document.getElementById('conflictModal'),
    conflictList: document.getElementById('conflictList'),
    useLocalBtn: document.getElementById('useLocalBtn'),
    useServerBtn: document.getElementById('useServerBtn')
};

// Initialize the application
function init() {
    loadQuotes();
    setupEventListeners();
    displayRandomQuote();
    populateCategories();
    initSync(); // Initialize sync functionality
}

// Load quotes from localStorage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        try {
            const parsedQuotes = JSON.parse(savedQuotes);
            // Ensure all quotes have required fields
            quotes = parsedQuotes.map(quote => ({
                id: quote.id || generateId(),
                text: quote.text,
                category: quote.category,
                createdAt: quote.createdAt || new Date().toISOString(),
                updatedAt: quote.updatedAt || new Date().toISOString()
            }));
            console.log('Quotes loaded from localStorage');
        } catch (e) {
            console.error('Error parsing saved quotes:', e);
        }
    }
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    console.log('Quotes saved to localStorage');
}

// Generate unique ID for new quotes
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Display a random quote
function displayRandomQuote() {
    if (quotes.length === 0) {
        elements.quoteDisplay.innerHTML = '<p class="quote-text">No quotes available</p>';
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    displayQuote(quotes[randomIndex]);
}

// Display a quote from specific category
function selectedCategory(category) {
    const categoryQuotes = quotes.filter(quote => quote.category === category);
    if (categoryQuotes.length === 0) {
        elements.quoteDisplay.innerHTML = `<p class="quote-text">No quotes in ${category} category</p>`;
        return;
    }

    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    displayQuote(categoryQuotes[randomIndex]);
}

// Display a specific quote
function displayQuote(quote) {
    elements.quoteDisplay.innerHTML = `
        <p class="quote-text">"${quote.text}"</p>
        <p class="quote-category">— ${quote.category}</p>
        ${quote.updatedAt ? `<p class="quote-updated">Last updated: ${new Date(quote.updatedAt).toLocaleString()}</p>` : ''}
    `;
}

// Populate category select dropdown
function populateCategories() {
    elements.categorySelect.innerHTML = '<option value="all">All Categories</option>';
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        elements.categorySelect.appendChild(option);
    });
}

// Add new quote
function addQuote() {
    const text = elements.newQuoteText.value.trim();
    const category = elements.newQuoteCategory.value.trim();

    if (!text || !category) {
        alert('Please fill in both fields');
        return;
    }

    const newQuote = { 
        id: generateId(),
        text, 
        category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    quotes.push(newQuote);
    saveQuotes();
    
    // Update UI
    elements.newQuoteText.value = '';
    elements.newQuoteCategory.value = '';
    elements.addQuoteForm.classList.add('hidden');
    populateCategories();
    displayQuote(newQuote);
    
    // Trigger sync after local changes
    syncWithServer();
}

// Export quotes to JSON file using Blob
function exportQuotes() {
    try {
        const jsonString = JSON.stringify(quotes, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        console.log('Quotes exported successfully');
    } catch (error) {
        console.error('Error exporting quotes:', error);
        alert('Error exporting quotes. Please try again.');
    }
}

// Import quotes from JSON file
function importQuotes(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (!Array.isArray(importedQuotes)) {
                throw new Error('Invalid format: Expected an array of quotes');
            }
            
            // Add required fields to imported quotes
            quotes = importedQuotes.map(quote => ({
                id: quote.id || generateId(),
                text: quote.text,
                category: quote.category,
                createdAt: quote.createdAt || new Date().toISOString(),
                updatedAt: quote.updatedAt || new Date().toISOString()
            }));
            
            saveQuotes();
            populateCategories();
            displayRandomQuote();
            alert(`Successfully imported ${importedQuotes.length} quotes`);
            
            elements.importFile.value = '';
            
            // Sync after import
            syncWithServer();
        } catch (error) {
            alert('Error importing quotes: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// ==================== Sync Functionality ====================

// Initialize sync functionality
function initSync() {
    // Load last sync time
    lastSyncTime = localStorage.getItem('lastSyncTime');
    
    // Set up periodic sync
    syncIntervalId = setInterval(syncWithServer, SYNC_INTERVAL);
    
    // Also sync when window gains focus
    window.addEventListener('focus', syncWithServer);
    
    // Initial sync
    syncWithServer();
}

// Function to simulate server fetch
async function fetchFromServer() {
    try {
        // In a real app, this would be your actual API endpoint
        const response = await fetch(API_URL);
        const serverData = await response.json();
        
        // Transform mock data to our quote format
        return serverData.slice(0, 5).map((post, index) => ({
            id: `server-${post.id}`,
            text: post.title,
            category: 'server',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            source: 'server'
        }));
    } catch (error) {
        console.error('Error fetching from server:', error);
        return null;
    }
}

// Function to sync with server
async function syncWithServer() {
    if (isSyncing) return;
    
    isSyncing = true;
    updateSyncStatus('Syncing...');
    
    try {
        const serverQuotes = await fetchFromServer();
        if (!serverQuotes) {
            updateSyncStatus('Sync failed', 'error');
            return;
        }
        
        // Merge quotes with conflict resolution
        const mergedQuotes = mergeQuotes(quotes, serverQuotes);
        const conflicts = detectConflicts(quotes, mergedQuotes);
        
        // Update local quotes if no conflicts
        if (conflicts.length === 0) {
            quotes = mergedQuotes;
            saveQuotes();
            lastSyncTime = new Date().toISOString();
            localStorage.setItem('lastSyncTime', lastSyncTime);
            updateSyncStatus('Synced successfully', 'success');
            
            // Update UI if needed
            if (elements.categorySelect.value === 'all') {
                displayRandomQuote();
            } else {
                selectedCategory(elements.categorySelect.value);
            }
        } else {
            // Show conflicts to user
            showConflicts(conflicts);
            updateSyncStatus('Conflicts detected', 'warning');
        }
    } catch (error) {
        console.error('Sync failed:', error);
        updateSyncStatus('Sync failed', 'error');
    } finally {
        isSyncing = false;
    }
}

// Merge quotes with conflict resolution
function mergeQuotes(localQuotes, serverQuotes) {
    if (!serverQuotes) return localQuotes;
    if (!localQuotes.length) return serverQuotes;
    
    const quoteMap = new Map();
    
    // Add all local quotes first
    localQuotes.forEach(quote => {
        quoteMap.set(quote.id, { ...quote, source: 'local' });
    });
    
    // Merge server quotes
    serverQuotes.forEach(serverQuote => {
        const localQuote = quoteMap.get(serverQuote.id);
        
        if (localQuote) {
            // Conflict resolution - newer update wins
            const localDate = new Date(localQuote.updatedAt);
            const serverDate = new Date(serverQuote.updatedAt);
            
            if (serverDate > localDate) {
                quoteMap.set(serverQuote.id, { 
                    ...serverQuote, 
                    source: 'server', 
                    wasConflict: true 
                });
            }
        } else {
            quoteMap.set(serverQuote.id, { ...serverQuote, source: 'server' });
        }
    });
    
    return Array.from(quoteMap.values());
}

// Detect conflicts between old and new quotes
function detectConflicts(oldQuotes, newQuotes) {
    const conflicts = [];
    
    oldQuotes.forEach(oldQuote => {
        const newQuote = newQuotes.find(q => q.id === oldQuote.id);
        if (newQuote && newQuote.wasConflict) {
            conflicts.push({
                id: oldQuote.id,
                local: oldQuote,
                server: newQuote
            });
        }
    });
    
    return conflicts;
}

// Show conflicts to user
function showConflicts(conflicts) {
    elements.conflictList.innerHTML = '';
    
    conflicts.forEach(conflict => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h4>Quote ID: ${conflict.id}</h4>
            <div class="conflict-option">
                <h5>Local Version</h5>
                <p>"${conflict.local.text}"</p>
                <p>Category: ${conflict.local.category}</p>
                <p>Updated: ${new Date(conflict.local.updatedAt).toLocaleString()}</p>
            </div>
            <div class="conflict-option">
                <h5>Server Version</h5>
                <p>"${conflict.server.text}"</p>
                <p>Category: ${conflict.server.category}</p>
                <p>Updated: ${new Date(conflict.server.updatedAt).toLocaleString()}</p>
            </div>
        `;
        
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'conflict-buttons';
        
        const useLocalBtn = document.createElement('button');
        useLocalBtn.textContent = 'Use Local';
        useLocalBtn.addEventListener('click', () => resolveConflict(conflict.id, 'local'));
        
        const useServerBtn = document.createElement('button');
        useServerBtn.textContent = 'Use Server';
        useServerBtn.addEventListener('click', () => resolveConflict(conflict.id, 'server'));
        
        buttonGroup.appendChild(useLocalBtn);
        buttonGroup.appendChild(useServerBtn);
        li.appendChild(buttonGroup);
        
        elements.conflictList.appendChild(li);
    });
    
    elements.conflictModal.classList.remove('hidden');
}

// Resolve a conflict
function resolveConflict(quoteId, resolution) {
    const conflictIndex = quotes.findIndex(q => q.id === quoteId);
    if (conflictIndex === -1) return;
    
    if (resolution === 'server') {
        // Keep the server version (already in quotes from merge)
    } else {
        // Revert to local version
        const localVersion = JSON.parse(localStorage.getItem('quotes')).find(q => q.id === quoteId);
        if (localVersion) {
            quotes[conflictIndex] = localVersion;
        }
    }
    
    // Remove conflict flag
    if (quotes[conflictIndex].wasConflict) {
        delete quotes[conflictIndex].wasConflict;
    }
    
    saveQuotes();
    
    // Close modal if no more conflicts
    const remainingConflicts = quotes.filter(q => q.wasConflict);
    if (remainingConflicts.length === 0) {
        elements.conflictModal.classList.add('hidden');
        updateSyncStatus('Synced successfully', 'success');
    }
    
    // Refresh display
    if (elements.categorySelect.value === 'all') {
        displayRandomQuote();
    } else {
        selectedCategory(elements.categorySelect.value);
    }
}

// Update sync status UI
function updateSyncStatus(message, type = 'info') {
    if (!elements.syncStatus) return;
    
    elements.syncStatus.textContent = message;
    elements.syncStatus.className = `sync-status ${type}`;
    
    if (lastSyncTime) {
        elements.lastSyncTime.textContent = `Last sync: ${new Date(lastSyncTime).toLocaleString()}`;
    }
}

// Set up event listeners
function setupEventListeners() {
    elements.newQuoteBtn.addEventListener('click', () => {
        if (elements.categorySelect.value === 'all') {
            displayRandomQuote();
        } else {
            selectedCategory(elements.categorySelect.value);
        }
    });

    elements.toggleFormBtn.addEventListener('click', () => {
        elements.addQuoteForm.classList.toggle('hidden');
    });

    elements.addQuoteBtn.addEventListener('click', addQuote);

    elements.categorySelect.addEventListener('change', () => {
        if (elements.categorySelect.value === 'all') {
            displayRandomQuote();
        } else {
            selectedCategory(elements.categorySelect.value);
        }
    });

    elements.exportBtn.addEventListener('click', exportQuotes);

    elements.importBtn.addEventListener('click', () => {
        elements.importFile.click();
    });

    elements.importFile.addEventListener('change', importQuotes);

    // Manual sync button
    if (elements.manualSyncBtn) {
        elements.manualSyncBtn.addEventListener('click', syncWithServer);
    }

    // Conflict resolution buttons
    if (elements.useLocalBtn) {
        elements.useLocalBtn.addEventListener('click', () => {
            const conflicts = Array.from(elements.conflictList.children);
            conflicts.forEach(() => resolveConflict(conflicts[0].id, 'local'));
        });
    }

    if (elements.useServerBtn) {
        elements.useServerBtn.addEventListener('click', () => {
            const conflicts = Array.from(elements.conflictList.children);
            conflicts.forEach(() => resolveConflict(conflicts[0].id, 'server'));
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

function fetchQuotesFromServer(){
    method POST Content-Type headers
}