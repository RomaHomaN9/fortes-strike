const logo = document.querySelector("#logo");
const news = document.querySelector("#news");

setTimeout(async () => {
	let response = await fetch("../news.txt");
	let data = await response.text();
	news.innerHTML = data;
}, 0);

if (Math.random() * 3 <= 1) {
	logo.style.backgroundImage = "url('img/fon.png')";
} else {
	logo.style.backgroundImage = "url('img/fon_2.png')";
}

document.querySelector("#play").addEventListener("click", () => {
	document.querySelector("#rule").style.display = "block";
});

document.querySelector("#rule__yes").addEventListener("click", () => {
	document.querySelector("#rule").style.display = "none";
	document.querySelector("#match").style.display = "block";
});

document.querySelector("#developers-button").addEventListener("click", () => {
	document.querySelector("#developers").style.display = "block";
});

document.querySelector(".developers__close").addEventListener("click", () => {
	document.querySelector("#developers").style.display = "none";
});
