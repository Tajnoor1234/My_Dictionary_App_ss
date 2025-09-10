# Demo Instructions for My Dictionary App

This file contains instructions for testing the dictionary app functionality.

## Available Demo Words

The app includes fallback data for the following words (useful when API is not accessible):

- **hello** - greeting, multiple meanings with examples
- **hi** - simple greeting
- **world** - earth, planet, multiple definitions
- **dictionary** - reference book for words
- **computer** - electronic device for processing data
- **language** - method of human communication

## How to Test the App

1. **Open** `index.html` in your web browser
2. **Search** for any of the demo words above
3. **Click** on synonyms/antonyms to search for related words
4. **Use** recent searches to quickly access previously searched words
5. **Try** searching for words not in the fallback list to see error handling

## Features to Test

- ✅ Search functionality
- ✅ Phonetic transcription display
- ✅ Multiple meanings and parts of speech
- ✅ Example sentences
- ✅ Synonyms and antonyms (clickable)
- ✅ Recent searches (clickable)
- ✅ Responsive design (try on mobile)
- ✅ Error handling for unknown words
- ✅ Clean, modern UI with animations

## Expected Behavior

- When API is available: Uses real dictionary data
- When API is blocked/unavailable: Uses fallback demo data
- Unknown words show "Word not found" error
- Recent searches are saved locally and persist between sessions