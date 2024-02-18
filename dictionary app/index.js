const wordInput = document.getElementById('word');
const searchButton = document.getElementById('searchButton');
const toggleFontButton = document.getElementById('toggleFontButton');
const toggleModeButton = document.getElementById('toggleModeButton');
const resultDiv = document.getElementById('result');
const audio = document.getElementById('audio');

searchButton.addEventListener('click', searchWord);
toggleFontButton.addEventListener('click', toggleFont);
toggleModeButton.addEventListener('click', toggleMode);

async function searchWord() {
  const word = wordInput.value.trim();

  if (word === '') {
    resultDiv.innerHTML = '<p>Please enter a word</p>';
    return;
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();

    if (response.ok) {            
      displayDefinition(data);
      playAudio(data);
    } else {
      resultDiv.innerHTML = `<p>Word not found</p>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p>Failed to fetch data. Please try again later.</p>`;
  }
}

function displayDefinition(data) {
  const { word, meanings } = data[0];
  const definitionList = meanings.map(meaning => {
    const { partOfSpeech, definitions } = meaning;
    const meaningsList = definitions.map(definition => `<li>${definition.definition}</li>`).join('');
    return `
      <div>
        <h2>${partOfSpeech}</h2>
        <ul>${meaningsList}</ul>
      </div>
    `;
  }).join('');

  resultDiv.innerHTML = `
    <h2>${word}</h2>
    ${definitionList}
  `;
}

function playAudio(data) {
  const { phonetics } = data[0];
  if (phonetics && phonetics.length > 0 && phonetics[0].audio) {
    const audioUrl = phonetics[0].audio;
    audio.src = audioUrl;
    audio.play();
  }
}

function toggleFont() {
  const fonts = ['serif', 'sans-serif', 'monospace'];
  const currentFont = document.body.style.getPropertyValue('--font-family');
  const currentIndex = fonts.indexOf(currentFont);
  const nextIndex = (currentIndex + 1) % fonts.length;
  document.body.style.setProperty('--font-family', fonts[nextIndex]);
}

function toggleMode() {
  const currentMode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  
  const newMode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  
  document.body.classList.toggle('dark-mode');
  // document.body.classList.toggleMode('dark-mode');
}
