const quotes = [
  {
    text: "The most difficult thing is the decision to act; the rest is merely tenacity.",
    category: "inspirational"
  },
  {
    text: "If I cannot do great things, I can do small things in a great way.",
    category: "inspirational"
  },
  {
    text: "Be the change that you wish to see in the world.",
    category: "humorous"
  },
  {
    text: "Don't sit down and wait for the opportunities to come. Get up and make them.",
    category: "philosophical"
  }
];


const newQuotebtn = document.getElementById('newQuote');
let value

newQuotebtn.addEventListener('click', function () {
    category()
})

const category = () => {
    const category = document.getElementById('category')
    const categoryList = document.getElementById('category-ls');
    if (categoryList.style.display === "none") {
        categoryList.style.display = "block"
    } else {
        categoryList.style.display = "none"
    }; 

    category.addEventListener('change', function () {
        value = getSelectedValue();
        if (value) {
            showRandomQuotes()
        };
        
    });

    function getSelectedValue() {
        return category.value
    }
}

const showRandomQuotes = () => {
        const quote = document.getElementById('quote')

        function getQuotesByCategory(category) {
            return quotes.filter(function (quote) {
                return quote.category === category;
            })
        }

        const quoteValue = getQuotesByCategory(value);
        const quoteText = quoteValue[1].text;

        quote.innerHTML = `<p>${quoteText}</p>`
}