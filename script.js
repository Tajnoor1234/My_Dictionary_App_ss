class DictionaryApp {
    constructor() {
        this.apiURL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        this.currentAudio = null;
        this.recentSearches = this.loadRecentSearches();
        
        this.initializeElements();
        this.setupEventListeners();
        this.displayRecentSearches();
    }
    
    initializeElements() {
        this.wordInput = document.getElementById('wordInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.results = document.getElementById('results');
        this.wordElement = document.getElementById('word');
        this.phoneticElement = document.getElementById('phonetic');
        this.meaningsElement = document.getElementById('meanings');
        this.audioBtn = document.getElementById('audioBtn');
        this.etymologySection = document.getElementById('etymology');
        this.etymologyText = document.getElementById('etymologyText');
        this.recentList = document.getElementById('recentList');
    }
    
    setupEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchWord());
        this.wordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWord();
            }
        });
        this.audioBtn.addEventListener('click', () => this.playAudio());
        
        // Auto-focus on input
        this.wordInput.focus();
    }
    
    async searchWord() {
        const word = this.wordInput.value.trim().toLowerCase();
        
        if (!word) {
            this.showError('Please enter a word to search.');
            return;
        }
        
        this.showLoading();
        
        try {
            const response = await fetch(`${this.apiURL}${encodeURIComponent(word)}`);
            
            if (!response.ok) {
                throw new Error('Word not found');
            }
            
            const data = await response.json();
            this.displayResults(data[0]);
            this.addToRecentSearches(word);
            
        } catch (error) {
            // Try fallback data for common words
            const fallbackData = this.getFallbackData(word);
            if (fallbackData) {
                this.displayResults(fallbackData);
                this.addToRecentSearches(word);
            } else {
                this.showError();
            }
        }
    }
    
    getFallbackData(word) {
        const fallbackWords = {
            'hello': {
                word: 'hello',
                phonetic: '/həˈloʊ/',
                phonetics: [{
                    text: '/həˈloʊ/',
                    audio: ''
                }],
                meanings: [{
                    partOfSpeech: 'exclamation',
                    definitions: [{
                        definition: 'Used as a greeting or to begin a phone conversation.',
                        example: 'Hello there, Katie!'
                    }],
                    synonyms: ['hi', 'hey', 'greetings'],
                    antonyms: ['goodbye', 'farewell']
                }, {
                    partOfSpeech: 'noun',
                    definitions: [{
                        definition: 'An utterance of \'hello\'; a greeting.',
                        example: 'She was getting polite nods and hellos from people.'
                    }],
                    synonyms: ['greeting', 'salutation'],
                    antonyms: []
                }]
            },
            'hi': {
                word: 'hi',
                phonetic: '/haɪ/',
                phonetics: [{
                    text: '/haɪ/',
                    audio: ''
                }],
                meanings: [{
                    partOfSpeech: 'exclamation',
                    definitions: [{
                        definition: 'Used as a friendly greeting.',
                        example: 'Hi there!'
                    }],
                    synonyms: ['hello', 'hey', 'greetings'],
                    antonyms: ['goodbye', 'bye']
                }]
            },
            'world': {
                word: 'world',
                phonetic: '/wɜːld/',
                phonetics: [{
                    text: '/wɜːld/',
                    audio: ''
                }],
                meanings: [{
                    partOfSpeech: 'noun',
                    definitions: [{
                        definition: 'The earth, together with all of its countries and peoples.',
                        example: 'He was doing his bit to save the world.'
                    }, {
                        definition: 'A particular region or group of countries.',
                        example: 'The English-speaking world.'
                    }],
                    synonyms: ['earth', 'globe', 'planet'],
                    antonyms: []
                }]
            },
            'dictionary': {
                word: 'dictionary',
                phonetic: '/ˈdɪkʃəˌnɛri/',
                phonetics: [{
                    text: '/ˈdɪkʃəˌnɛri/',
                    audio: ''
                }],
                meanings: [{
                    partOfSpeech: 'noun',
                    definitions: [{
                        definition: 'A book or electronic resource that lists the words of a language typically in alphabetical order and gives their meaning.',
                        example: 'I looked it up in the dictionary.'
                    }],
                    synonyms: ['lexicon', 'vocabulary', 'glossary'],
                    antonyms: []
                }]
            },
            'computer': {
                word: 'computer',
                phonetic: '/kəmˈpjuːtər/',
                phonetics: [{
                    text: '/kəmˈpjuːtər/',
                    audio: ''
                }],
                meanings: [{
                    partOfSpeech: 'noun',
                    definitions: [{
                        definition: 'An electronic device for storing and processing data according to instructions given to it in a variable program.',
                        example: 'The data was processed by computer.'
                    }],
                    synonyms: ['machine', 'processor', 'laptop'],
                    antonyms: []
                }]
            },
            'language': {
                word: 'language',
                phonetic: '/ˈlæŋɡwɪdʒ/',
                phonetics: [{
                    text: '/ˈlæŋɡwɪdʒ/',
                    audio: ''
                }],
                meanings: [{
                    partOfSpeech: 'noun',
                    definitions: [{
                        definition: 'The method of human communication, either spoken or written, consisting of the use of words in a structured and conventional way.',
                        example: 'A study of the way children learn language.'
                    }],
                    synonyms: ['speech', 'communication', 'tongue'],
                    antonyms: []
                }]
            }
        };
        
        return fallbackWords[word] || null;
    }
    
    showLoading() {
        this.hideAllSections();
        this.loading.classList.remove('hidden');
    }
    
    showError(message = null) {
        this.hideAllSections();
        if (message) {
            this.error.querySelector('p').textContent = message;
        } else {
            this.error.querySelector('p').textContent = 'Please check the spelling and try again.';
        }
        this.error.classList.remove('hidden');
    }
    
    hideAllSections() {
        this.loading.classList.add('hidden');
        this.error.classList.add('hidden');
        this.results.classList.add('hidden');
    }
    
    displayResults(data) {
        this.hideAllSections();
        
        // Display word
        this.wordElement.textContent = data.word;
        
        // Display phonetic
        const phonetic = data.phonetic || (data.phonetics && data.phonetics[0] && data.phonetics[0].text) || '';
        this.phoneticElement.textContent = phonetic;
        
        // Setup audio
        this.setupAudio(data.phonetics);
        
        // Display meanings
        this.displayMeanings(data.meanings);
        
        // Display etymology if available
        this.displayEtymology(data);
        
        this.results.classList.remove('hidden');
    }
    
    setupAudio(phonetics) {
        this.currentAudio = null;
        this.audioBtn.classList.add('hidden');
        
        if (phonetics && phonetics.length > 0) {
            for (const phonetic of phonetics) {
                if (phonetic.audio) {
                    this.currentAudio = new Audio(phonetic.audio);
                    this.audioBtn.classList.remove('hidden');
                    break;
                }
            }
        }
    }
    
    playAudio() {
        if (this.currentAudio) {
            this.currentAudio.play().catch(error => {
                console.log('Audio playback failed:', error);
            });
        }
    }
    
    displayMeanings(meanings) {
        this.meaningsElement.innerHTML = '';
        
        meanings.forEach(meaning => {
            const meaningDiv = document.createElement('div');
            meaningDiv.className = 'meaning';
            
            // Part of speech
            const partOfSpeech = document.createElement('div');
            partOfSpeech.className = 'part-of-speech';
            partOfSpeech.textContent = meaning.partOfSpeech;
            meaningDiv.appendChild(partOfSpeech);
            
            // Definitions
            meaning.definitions.forEach((def, index) => {
                const definitionDiv = document.createElement('div');
                definitionDiv.className = 'definition';
                
                const definitionText = document.createElement('div');
                definitionText.className = 'definition-text';
                definitionText.textContent = `${index + 1}. ${def.definition}`;
                definitionDiv.appendChild(definitionText);
                
                // Example
                if (def.example) {
                    const example = document.createElement('div');
                    example.className = 'example';
                    example.textContent = `Example: "${def.example}"`;
                    definitionDiv.appendChild(example);
                }
                
                meaningDiv.appendChild(definitionDiv);
            });
            
            // Synonyms
            if (meaning.synonyms && meaning.synonyms.length > 0) {
                const synonymsDiv = document.createElement('div');
                synonymsDiv.className = 'synonyms';
                
                const synonymsTitle = document.createElement('h5');
                synonymsTitle.textContent = 'Synonyms:';
                synonymsDiv.appendChild(synonymsTitle);
                
                const synonymsList = document.createElement('div');
                synonymsList.className = 'synonym-list';
                
                meaning.synonyms.slice(0, 8).forEach(synonym => {
                    const synonymSpan = document.createElement('span');
                    synonymSpan.className = 'synonym';
                    synonymSpan.textContent = synonym;
                    synonymSpan.addEventListener('click', () => {
                        this.wordInput.value = synonym;
                        this.searchWord();
                    });
                    synonymsList.appendChild(synonymSpan);
                });
                
                synonymsDiv.appendChild(synonymsList);
                meaningDiv.appendChild(synonymsDiv);
            }
            
            // Antonyms
            if (meaning.antonyms && meaning.antonyms.length > 0) {
                const antonymsDiv = document.createElement('div');
                antonymsDiv.className = 'antonyms';
                
                const antonymsTitle = document.createElement('h5');
                antonymsTitle.textContent = 'Antonyms:';
                antonymsDiv.appendChild(antonymsTitle);
                
                const antonymsList = document.createElement('div');
                antonymsList.className = 'antonym-list';
                
                meaning.antonyms.slice(0, 8).forEach(antonym => {
                    const antonymSpan = document.createElement('span');
                    antonymSpan.className = 'antonym';
                    antonymSpan.textContent = antonym;
                    antonymSpan.addEventListener('click', () => {
                        this.wordInput.value = antonym;
                        this.searchWord();
                    });
                    antonymsList.appendChild(antonymSpan);
                });
                
                antonymsDiv.appendChild(antonymsList);
                meaningDiv.appendChild(antonymsDiv);
            }
            
            this.meaningsElement.appendChild(meaningDiv);
        });
    }
    
    displayEtymology(data) {
        // Hide etymology section by default
        this.etymologySection.classList.add('hidden');
        
        // Check if etymology exists in any meaning
        for (const meaning of data.meanings) {
            if (meaning.etymology && meaning.etymology.length > 0) {
                this.etymologyText.textContent = meaning.etymology[0];
                this.etymologySection.classList.remove('hidden');
                break;
            }
        }
    }
    
    addToRecentSearches(word) {
        // Remove if already exists
        this.recentSearches = this.recentSearches.filter(item => item !== word);
        
        // Add to beginning
        this.recentSearches.unshift(word);
        
        // Keep only last 10 searches
        this.recentSearches = this.recentSearches.slice(0, 10);
        
        // Save to localStorage
        this.saveRecentSearches();
        this.displayRecentSearches();
    }
    
    loadRecentSearches() {
        try {
            const searches = localStorage.getItem('dictionaryRecentSearches');
            return searches ? JSON.parse(searches) : [];
        } catch (error) {
            return [];
        }
    }
    
    saveRecentSearches() {
        try {
            localStorage.setItem('dictionaryRecentSearches', JSON.stringify(this.recentSearches));
        } catch (error) {
            console.log('Could not save recent searches:', error);
        }
    }
    
    displayRecentSearches() {
        this.recentList.innerHTML = '';
        
        if (this.recentSearches.length === 0) {
            this.recentList.innerHTML = '<p style="color: #666; font-style: italic;">No recent searches</p>';
            return;
        }
        
        this.recentSearches.forEach(word => {
            const item = document.createElement('div');
            item.className = 'recent-item';
            item.textContent = word;
            item.addEventListener('click', () => {
                this.wordInput.value = word;
                this.searchWord();
            });
            this.recentList.appendChild(item);
        });
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DictionaryApp();
    
    // Add some sample searches for demonstration
    const sampleWords = ['hello', 'world', 'dictionary', 'language', 'computer'];
    const randomWord = sampleWords[Math.floor(Math.random() * sampleWords.length)];
    
    // Set a random word as placeholder for demo
    document.getElementById('wordInput').placeholder = `Try searching for "${randomWord}"...`;
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}