document.onload = getQuote(); // when page loads we need to fetch quote

//fecting quote
function getQuote() {
  fetch("https://programming-quotes-api.herokuapp.com/Quotes")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then((data) => {
      const myvalue = new Uint32Array(1);// taking random number for random quote
      let num = crypto.getRandomValues(myvalue);
      document.getElementById("quote").innerHTML =
        '"' +
        data[num[0] % 100].en +
        '"';
      document.getElementById("author").innerHTML = "-"+ data[num[0] % 100].author;
      document.getElementById("quote").value = "en"; //setting quotes language
    })
    .catch((error) => console.error("FETCH ERROR:", error));
}

//Converting div to image and downloading it using html2canvas
// I have included new version js file of html2canvas because this syntex was not working 
document.getElementById("generate").addEventListener("click", getQuote);
console.log(document.getElementById("btndownload").innerHTML);
document.getElementById("btndownload").addEventListener("click", function () {
  const targetDiv = document.getElementById("quoteDiv");
  html2canvas(targetDiv).then((canvas) => {
    const quoteImage = canvas.toDataURL("image/png");
    var anchor = document.createElement("a");
    anchor.setAttribute("href", quoteImage);
    anchor.setAttribute("download", "quote.png");
    anchor.click();
    anchor.remove();
  });
});

//toggling english to serberian using api
const translateBtn = document.getElementById("togglelang");

translateBtn.addEventListener("click", () => {
  let text = document.getElementById("quote").innerHTML,
    translateFrom = document.getElementById("quote").value,
    translateTo;
  console.log(document.getElementById("quote").value);
  if (translateFrom == "en") translateTo = "sr";
  else translateTo = "en";
  if (!text) return;
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.responseData);
      document.getElementById("quote").innerText =
        data.responseData.translatedText;
      document.getElementById("quote").value = translateTo;
    });
});
