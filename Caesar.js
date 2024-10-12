
const textInput = document.getElementById('text');
const keyInput = document.getElementById('key');
const encryptButton = document.getElementById('encrypt');
const decryptButton = document.getElementById('decrypt');
const generateButton = document.getElementById('generate');
const hackButton = document.getElementById('hack');
const resultOutput = document.getElementById('result');

//Функция шифрования/дешифрования
function caesarCipher(text, shift, encrypt) {
  let result = '';
  const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  const lowercaseAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    let index;

    if (alphabet.indexOf(char) !== -1) {
      index = alphabet.indexOf(char) + (encrypt ? shift : -shift);
      index = (index % 33 + 33) % 33;
      result += alphabet[index];
    } else if (lowercaseAlphabet.indexOf(char) !== -1) {
      index = lowercaseAlphabet.indexOf(char) + (encrypt ? shift : -shift);
      index = (index % 33 + 33) % 33;
      result += lowercaseAlphabet[index];
    } else {
      result += char;
    }
  }

  return result;
}

encryptButton.addEventListener('click', () => {
  const text = textInput.value;
  const key = parseInt(keyInput.value);
  resultOutput.value = caesarCipher(text, key, true);
});

decryptButton.addEventListener('click', () => {
  const text = textInput.value;
  const key = parseInt(keyInput.value);
  resultOutput.value = caesarCipher(text, key, false);
});

//Геренация ключа
generateButton.addEventListener('click', () => {
  keyInput.value = Math.floor(Math.random() * 32) + 1;
});

//Взлом шифра
//Примерно от 40-50 слов
hackButton.addEventListener('click', () => {
  const text = textInput.value;
  const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  const lowercaseAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';

  // Подсчет частоты букв
  const letterFrequencies = {};
  for (let i = 0; i < alphabet.length; i++) {
    letterFrequencies[alphabet[i]] = 0;
  }
  for (let i = 0; i < lowercaseAlphabet.length; i++) {
    letterFrequencies[lowercaseAlphabet[i]] = 0;
  }
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (letterFrequencies.hasOwnProperty(char)) {
      letterFrequencies[char]++;
    }
  }

  // Поиск буквы с максимальной частотой
  let mostFrequentLetter = '';
  let maxFrequency = 0;
  for (const letter in letterFrequencies) {
    if (letterFrequencies[letter] > maxFrequency) {
      mostFrequentLetter = letter;
      maxFrequency = letterFrequencies[letter];
    }
  }

  // Поиск правильного сдвига
  for (let shift = 0; shift < alphabet.length; shift++) {
    let decryptedText = caesarCipher(text, shift, false);
    let newMostFrequentLetter = '';
    let newMaxFrequency = 0;

    // Подсчет частоты букв в дешифрованном тексте
    for (let i = 0; i < decryptedText.length; i++) {
      const char = decryptedText[i];
      if (letterFrequencies.hasOwnProperty(char)) {
        letterFrequencies[char]++;
      }
    }

    //Поиск буквы с максимальной частотой в дешифрованном тексте
    for (const letter in letterFrequencies) {
      if (letterFrequencies[letter] > newMaxFrequency) {
        newMostFrequentLetter = letter;
        newMaxFrequency = letterFrequencies[letter];
      }
    }

    // Если наиболее частая буква в дешифрованном тексте - "О", то это правильный сдвиг
    if (newMostFrequentLetter === 'О' || newMostFrequentLetter === 'о') {
      resultOutput.value = decryptedText;
      return;
    }

    // Сброс частоты букв
    for (const letter in letterFrequencies) {
      letterFrequencies[letter] = 0;
    }
  }


  resultOutput.value = 'Не удалось расшифровать текст.';
});
