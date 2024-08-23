// Load the JSON file with commands and responses
let commands = {};

// Fetch the JSON data
fetch('commands.json')
  .then(response => response.json())
  .then(data => {
    commands = data;
  })
  .catch(error => console.error('Error loading commands:', error));

const startBtn = document.querySelector("#start-btn");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const synth = window.speechSynthesis;

  startBtn.addEventListener("click", () => {
    recognition.start();
  });

  let utter = new SpeechSynthesisUtterance();

  recognition.onresult = (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();

    if (transcript in commands) {
      recognition.stop();
      utter.text = commands[transcript];
      synth.speak(utter);
    } else {
      recognition.stop();
      utter.text = "I didn't catch that. Could you please repeat?";
      synth.speak(utter);
    }
  };

  utter.onend = () => {
    recognition.start();
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error detected: ' + event.error);
  };

  recognition.onnomatch = () => {
    utter.text = "I didn't recognize that. Could you please say it again?";
    synth.speak(utter);
  };
} else {
  console.error("Sorry, your browser does not support speech recognition.");
  alert("Speech recognition is not supported in your browser. Please try using Google Chrome or Microsoft Edge.");
}

