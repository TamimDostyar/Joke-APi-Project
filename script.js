const BASE_URL = 'http://localhost:5000/api/v1/jokes/';

const LANGUAGES = {
    "cs": "Czech",
    "de": "German",
    "en": "English",
    "es": "Spanish",
    "eu": "Basque",
    "fr": "French",
    "gl": "Galician",
    "hu": "Hungarian",
    "it": "Italian",
    "lt": "Lithuanian",
    "pl": "Polish",
    "sv": "Swedish"
};

const CATEGORIES = ["all", "neutral", "chuck"];

const selLang = document.querySelector('#selLang');
for (const code in LANGUAGES) {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = LANGUAGES[code];
    selLang.appendChild(option);
}

const selCat = document.querySelector('#selCat');
CATEGORIES.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    selCat.appendChild(option);
});

const selNum = document.querySelector('#selNum');
for (let i = 1; i <= 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    selNum.appendChild(option);
}


const allOption = document.createElement('option');
allOption.value = "All";
allOption.textContent = "All";
selNum.appendChild(allOption);


document.querySelector('#jokeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetchJokes();
});
function fetchJokes() {
    const language = document.querySelector('#selLang').value;
    const category = document.querySelector('#selCat').value;
    const numJokes = document.querySelector('#selNum').value;
    const jokeId = document.querySelector('#jokeId').value;

    const errorElement = document.querySelector('#error');

    if (errorElement) {
        errorElement.classList.add('is-hidden');
    }

    clearJokes();

    if (jokeId) {
        let url = `${BASE_URL}${jokeId}`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.jokes) {
                    displayJokes([data.jokes]);
                } else {
                    showError("Joke not found.");
                }
            })
            .catch(error => {
                showError(error.message);
            });
    } else {
        let url = buildUrl(language, category, numJokes);
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.jokes && Array.isArray(data.jokes)) {
                    displayJokes(data.jokes);
                } else {
                    showError("Error fetching jokes.");
                }
            })
            .catch(error => {
                showError(error.message);
            });
    }
}

function showError(message) {
    const errorElement = document.querySelector('#error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('is-hidden');
    }
}

function buildUrl(language, category, numJokes) {
    let url = `${BASE_URL}${language}/${category}`;
    if (numJokes && numJokes !== "All") {
        url += `/${numJokes}`;
    }
    return url;
}

function displayJokes(jokes) {
    const jokesContainer = document.querySelector('#jokes');

    jokes.forEach(joke => {
        const article = document.createElement('article');
        article.classList.add('message', 'is-primary');
        article.innerHTML = `
            <div class="message-body">
                ${joke.joke || joke}
            </div>
        `;
        jokesContainer.appendChild(article);
    });
}

function clearJokes() {
    const jokesContainer = document.querySelector('#jokes');
    jokesContainer.innerHTML = '';
}