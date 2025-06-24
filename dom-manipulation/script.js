let quotes = [
  // Humorous Quotes
  {
    text: "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    category: "humorous"
  },
  {
    text: "Why don't scientists trust atoms? Because they make up everything!",
    category: "humorous"
  },
  {
    text: "I used to be a baker, but I couldn't make enough dough.",
    category: "humorous"
  },
  {
    text: "Parallel lines have so much in common... it’s a shame they’ll never meet.",
    category: "humorous"
  },

  // Inspirational Quotes
  {
    text: "The most difficult thing is the decision to act; the rest is merely tenacity.",
    category: "inspirational"
  },
  {
    text: "If I cannot do great things, I can do small things in a great way.",
    category: "inspirational"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    category: "inspirational"
  },
  {
    text: "Believe you can and you're halfway there.",
    category: "inspirational"
  },

  // Philosophical Quotes
  {
    text: "The unexamined life is not worth living.",
    category: "philosophical"
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act but a habit.",
    category: "philosophical"
  },
  {
    text: "Happiness depends upon ourselves.",
    category: "philosophical"
  },
  {
    text: "The only true wisdom is in knowing you know nothing.",
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
        const quoteText = quoteValue[displayRandomQuote(quoteValue)].text;
        console.log(quoteText)

        function displayRandomQuote(arr) {
         return (Math.floor(Math.random() * arr.length));
        }

        quote.innerHTML = `<p>${quoteText}</p>`
}

const addQuote = () => {
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  const newQuoteText = document.getElementById('newQuoteText').value;
  let text = `${newQuoteText}`;
  let category = `${newQuoteCategory}`
  let newQuoteObject = {text, category};

  quotes.push(newQuoteObject)
  console.log(quotes)
}

const createAddQuoteForm = document.getElementById('newQuoteForm');


createAddQuoteForm.addEventListener('click', function () {
  const addForm= document.getElementById('add-quote');
  if (addForm.style.display === "none") {
    return addForm.style.display = "block"
  } else {
    return addForm.style.display = "none"
  }
})