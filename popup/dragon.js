document.addEventListener("DOMContentLoaded", () => {
	const STORAGE_KEY = "adhdragon_money";
	const NAME_KEY = "adhdragon_name";
	let money = parseFloat(localStorage.getItem(STORAGE_KEY)) || 5.00;
	let dragonName = localStorage.getItem(NAME_KEY);

	const moneyDisplay = document.getElementById("money-display");
	const messageDisplay = document.getElementById("message-display");
	const redbullBtn = document.getElementById("redbull-btn");
	const twixBtn = document.getElementById("twix-btn");

	const nameContainer = document.getElementById("name-container");
	const nameInput = document.getElementById("name-input");
	const nameBtn = document.getElementById("name-btn");
	const dragonNameDisplay = document.getElementById("dragon-name");

	function updateMoney() {
		moneyDisplay.textContent = `💰 ${money.toFixed(2)} €`;
		localStorage.setItem(STORAGE_KEY, money.toFixed(2));
	}

	function showMessage(msg, type = "info") {
		if (messageDisplay) {
			messageDisplay.textContent = msg;
			messageDisplay.style.color = type === "error" ? "#d32f2f" : "#222";
		}
	}

	function setDragonName(name) {
		dragonName = name;
		localStorage.setItem(NAME_KEY, dragonName);
		dragonNameDisplay.textContent = `🐉 ${dragonName}`;
		nameContainer.style.display = "none";
	}

	if (!dragonName) {
		nameContainer.style.display = "block";
		dragonNameDisplay.textContent = "";
	} else {
		setDragonName(dragonName);
	}

	nameBtn.addEventListener("click", () => {
		const chosenName = nameInput.value.trim();
		if (chosenName) {
			setDragonName(chosenName);
		} else {
			showMessage("Choisis un nom pour ton dragon !", "error");
		}
	});

	redbullBtn.addEventListener("click", () => {
		if (money >= 1.30) {
			money -= 1.30;
			updateMoney();
			showMessage(`${dragonName} boit un Redbull !`);
		} else {
			showMessage("Manque de sous pour le Redbull !", "error");
		}
	});

	twixBtn.addEventListener("click", () => {
		if (money >= 2.10) {
			money -= 2.10;
			updateMoney();
			showMessage(`${dragonName} mange un Twix !`);
		} else {
			showMessage("Manque de sous pour le Twix !", "error");
		}
	});

	updateMoney();
	showMessage("");
});
