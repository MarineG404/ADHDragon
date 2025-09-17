document.addEventListener("DOMContentLoaded", () => {
	let money = 5.00;
	const moneyDisplay = document.getElementById("money-display");
	const messageDisplay = document.getElementById("message-display");
	const redbullBtn = document.getElementById("redbull-btn");
	const twixBtn = document.getElementById("twix-btn");

	function updateMoney() {
		moneyDisplay.textContent = `💰 ${money.toFixed(2)} €`;
	}

	function showMessage(msg, type = "info") {
		messageDisplay.textContent = msg;
		messageDisplay.style.color = type === "error" ? "#d32f2f" : "#222";
	}

	redbullBtn.addEventListener("click", () => {
		if (money >= 1.30) {
			money -= 1.30;
			updateMoney();
			showMessage("Le dragon boit un Redbull !");
		} else {
			showMessage("Manque de sous pour le Redbull !", "error");
		}
	});

	twixBtn.addEventListener("click", () => {
		if (money >= 2.10) {
			money -= 2.10;
			updateMoney();
			showMessage("Le dragon mange un Twix !");
		} else {
			showMessage("Manque de sous pour le Twix !", "error");
		}
	});

	updateMoney();
	showMessage("");
});
