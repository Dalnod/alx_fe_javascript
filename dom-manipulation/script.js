// Quote data structure and state management
let quotes = [
    // Default quotes
    { text: "The only way to do great work is to love what you do.", category: "inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "motivation" },
    { text: "Whoever is happy will make others happy too.", category: "happiness" }
];

// DOM Elements
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
    importFile: document.getElementById('importFile')
};

// Initialize the application
function init() {
    loadQuotes();
    setupEventListeners();
    displayRandomQuote();
    populateCategories();
}

// Load quotes from localStorage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        try {
            quotes = JSON.parse(savedQuotes);
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

function categoryFilter()  {
    
};

function filterQuotes () {

};


// Add new quote
function addQuote() {
    const text = elements.newQuoteText.value.trim();
    const category = elements.newQuoteCategory.value.trim();

    if (!text || !category) {
        alert('Please fill in both fields');
        return;
    }

    const newQuote = { text, category };
    console.log(newQuote)
    quotes.push(newQuote);
    saveQuotes();
    
    // Update UI
    elements.newQuoteText.value = '';
    elements.newQuoteCategory.value = '';
    elements.addQuoteForm.classList.add('hidden');
    populateCategories();
    displayQuote(newQuote);
}

// Export quotes to JSON file using Blob
function exportQuotes() {
    try {
        // Create JSON string with pretty formatting
        const jsonString = JSON.stringify(quotes, null, 2);
        
        // Create a Blob with the JSON data
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
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
            
            quotes = importedQuotes;
            saveQuotes();
            populateCategories();
            displayRandomQuote();
            alert(`Successfully imported ${importedQuotes.length} quotes`);
            
            // Reset file input
            elements.importFile.value = '';
        } catch (error) {
            alert('Error importing quotes: ' + error.message);
        }
    };
    reader.readAsText(file);
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

    elements.exportBtn.addEventListener('click', exportQuotes);

    // Show category select by default
    elements.categorySelect.classList.remove('hidden');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);