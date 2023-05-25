const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");

const selectTag = document.querySelectorAll("select");

const exchageButton = document.querySelector(".exchange");
const featureButtons = document.querySelectorAll(".row i");

const transButton = document.querySelector(".transBtn");
const clearButton = document.querySelector(".clearBtn");

fromText.addEventListener("keyup", () => {

  if (!fromText.value) toText.value = "";
});

selectTag.forEach((tag, id) => {

  for (let code in nations) {

    let selected = (id == 0) ? (code == "en-GB") ? "selected" : ""
      : (code == "hi-IN") ? "selected" : "";

    let option = `<option ${selected} value="${code}">${nations[code]}</option>`;

    tag.insertAdjacentHTML("beforeend", option);
  }
});

exchageButton.addEventListener("click", () => {

  let tempText = fromText.value;
  let tempLang = selectTag[0].value;

  fromText.value = toText.value;
  toText.value = tempText;

  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

featureButtons.forEach(featureButton => {

  featureButton.addEventListener("click", ({ target }) => {

    if (!fromText.value || !toText.value) return;

    if (target.classList.contains("fa-copy")) {

      if (target.id == "from") {

        navigator.clipboard.writeText(fromText.value);

      } else navigator.clipboard.writeText(toText.value);

    } else {

      let utterance;

      if (target.id == "from") {

        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;

      } else {

        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }

      speechSynthesis.speak(utterance);
    }
  });
});

transButton.addEventListener("click", () => {

  let text = fromText.value.trim();

  let langFrom = selectTag[0].value;
  let langTo = selectTag[1].value;

  if (!text) return;

  toText.setAttribute("placeholder", "Translating your text...");

  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${langFrom}|${langTo}`;

  fetch(apiUrl).then(response => response.json()).then(data => {

    toText.value = data.responseData.translatedText;

    data.matches.forEach(data => {

      if (data.id === 0) toText.value = data.translation;
    });

    toText.setAttribute("placeholder", "Translation of your text!");
  });
});

clearButton.addEventListener("click", () => { fromText.value = toText.value = ""; });