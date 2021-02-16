
function start() {

    getAlphabet();
    //textinput.setAttribute("readonly", true);
    selector("char");

    testar();
}


function getAlphabet() {
    alphabet = 'abcdefghijklmnopqrstuvwxyzåäö'.split('');
    numbers = '1234567890'.split('');
}


function getChar() {


    const rand = Math.floor(Math.random() * alphabet.length);

    selectedChar = alphabet[rand];

    span = document.createElement("span");
    if (checkBox.checked == true) {
        span.textContent = selectedChar.toUpperCase();
    }
    else { span.textContent = selectedChar; }
    span.classList.add("letter");
    span.classList.add("hidden");
    var text = span.textContent;

    if (spanCount == null) {
        spanCount = 0;
    }
    else {
        spanCount++;
        breakCount++;
    }

    charArea.innerHTML = text;
    textarea.appendChild(span);
}

function createJSON() {

    fetch('/dick.txt')
        .then(response => response.text())
        .then((data) => {

            var fullstring = data;
            words = fullstring.split("\n");
            getWord(words);
        })
}

function getWord(words) {

    var newArray = new Array();
    for (let i = 0; i < words.length; i++) {
        const element = words[i];
        if (element.length < 7) {
            newArray.push(element);
        }
    }
    if (wordCount == null) {
        wordCount = 0;
    }
    else {
        wordCount++;
        breakWord++;

    }

    const rand = Math.floor(Math.random() * newArray.length);

    selectedWord = newArray[rand];

    span = document.createElement("span");
   
    span.classList.add("word");
    span.classList.add("hidden");

    span.textContent = selectedWord;
    charArea.innerHTML = selectedWord;

    textarea.appendChild(span);

}


function selector(value) {


    if (value == "char") {
        getChar();
    }
    else if (value == "word") {

        createJSON();

    }


}
var textarea = document.getElementById("textarea");
var texttitle = document.getElementById("title");
var charArea = document.getElementById("char");
var textpicker = document.getElementById("textpicker");
var textinput = document.getElementById("textinput");

var gameBtn = document.getElementById("startbutton");
var checkBox = document.getElementById("casing");
var checkChar = document.getElementById("checkChar");
var checkWord = document.getElementById("checkWord");
var radioBtns = document.getElementsByName("radio");
var mute = document.getElementById("mute");
var test = document.getElementById("test");
var right = document.getElementById("right");
var total = document.getElementById("total");

var alphabet = new Array();
var correct = new Array();
var selectedChar;
var spanCount;
var span;
var br;
var breakCount = 0;
var correctCount = 0;
var words = new Array();
var wordCount;
var breakWord = 0;




function setSpeech() {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

    var grammar = '#JSGF V1.0;'

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'sv-SE';
    //recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = function (event) {
        var last = event.results.length - 1;
        var command = event.results[last][0].transcript;

        var selected = document.querySelectorAll(".letter");
        var selectedWords = document.querySelectorAll(".word");
        var selectedWord = selectedWords[wordCount];

        var char = selected[spanCount];

       

        if (checkChar.checked == true) {
            if (char.textContent == command.slice(-1).toUpperCase()) {
                char.classList.add("correct");
                char.classList.remove("hidden");
                correctCount++;
                getChar();
        
            }
            else {
                char.classList.add("incorrect");
                char.classList.remove("hidden");
                playSound();
                getChar();
            }
            addBreak();
        }
        else{
            console.log(command);

            if (selectedWord.textContent.toUpperCase() == command.toUpperCase()) {
                getWord(words);
                selectedWord.classList.add("correct");
                selectedWord.classList.remove("hidden");
    
            }
            else {
 
                selectedWord.classList.add("incorrect");
                selectedWord.classList.remove("hidden");
                playSound();
                getWord(words);
            }
            addBreakWord();
        }


        clearInput();
        clearSpan();
        setStats();

    };

}


var otherurl = "https://en.wiktionary.org/wiki/Special:RandomInCategory/Swedish_lemmas#Swedish";

function addBreakWord() {

    if (breakWord == 8) {
        br = document.createElement("br")
        textarea.appendChild(br);
        breakWord = 0;
    }
}

function addBreak() {

    if (breakCount == 32) {
        br = document.createElement("br")
        textarea.appendChild(br);
        breakCount = 0;
    }
}


function resetPlayBtn() {

    textinput.setAttribute("readonly", true);
    gameBtn.classList.remove("stopbutton");
    gameBtn.classList.add("playbutton");

}



function playSound() {

    if (mute.checked == true) {
        errorSound = new Audio("audio/no.mp3");
        errorSound.play();
    }
}

function changePicker() {

    const selectElement = document.querySelector('#textpicker');

    selectElement.addEventListener('change', (event) => {
        setText(selectElement.value);
    })
}

function setStats() {

    const chars = document.querySelectorAll(".correct");
    const totalCount = spanCount + 1;

    const percent = (chars.length) * 100 / totalCount;


    test.innerHTML = Math.round(percent) + " %";

    right.innerHTML = "Antal rätt: " + correctCount;
    total.innerHTML = "Av totalt: " + totalCount;

}


function clearInput() {

    textinput.value = "";
}

function clearSpan() {
    const span = document.querySelectorAll(".letter");
    console.log(span)

}


textinput.addEventListener('input', (event) => {

    const input = event.data;

    var selected = document.querySelectorAll(".letter");
    console.log(selected);
    var char = selected[spanCount];

    var text = input;

    if (checkBox.checked == true) {
        var text = input.toUpperCase();
    }


    if (char.textContent == text) {
        char.classList.add("correct");
        char.classList.remove("hidden");
        correctCount++;

    }
    else {
        char.classList.add("incorrect");
        char.classList.remove("hidden");
        playSound();
    }

    clearInput();
    clearSpan();
    addBreak();
    setStats();
    getChar();

})


checkChar.addEventListener('change', function () {
    selector("char");

});


checkWord.addEventListener('change', function () {
    selector("word");
});


gameBtn.addEventListener('click', function () {
    setSpeech();
});

window.addEventListener("load", start(), false);