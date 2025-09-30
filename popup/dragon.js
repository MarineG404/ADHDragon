// Variables globales
let sites = [];
let money = 0;
let dragonName = "Mon Dragon";

// Éléments DOM
const settingsBtn = document.querySelector('.settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const siteInput = document.getElementById('site-input');
const addSiteBtn = document.getElementById('add-site-btn');
const sitesList = document.getElementById('sites-list');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const moneyDisplay = document.getElementById('money-display');
const messageDisplay = document.getElementById('message-display');
const nameContainer = document.getElementById('name-container');
const nameInput = document.getElementById('name-input');
const nameBtn = document.getElementById('name-btn');
const dragonNameDisplay = document.getElementById('dragon-name');

// Charger les données depuis chrome.storage.local
function loadData() {
	chrome.storage.local.get(['adhdragon_sites', 'adhdragon_money', 'dragonName'], (data) => {
		sites = data.adhdragon_sites || [];
		money = data.adhdragon_money !== undefined ? parseFloat(data.adhdragon_money) : 5.00;
		dragonName = data.dragonName || "Mon Dragon";

		// Afficher le container de nom si pas de nom défini
		if (!data.dragonName) {
			nameContainer.style.display = 'flex';
			dragonNameDisplay.style.display = 'none';
		}

		updateUI();
		renderSites();
	});
}

// Sauvegarder les données dans chrome.storage.local
function saveData() {
	chrome.storage.local.set({
		adhdragon_sites: sites,
		adhdragon_money: money,
		dragonName: dragonName
	});
}

// Valider une URL
function isValidDomain(domain) {
	const cleanDomain = domain.trim().toLowerCase()
		.replace(/^https?:\/\//, '')
		.replace(/^www\./, '')
		.replace(/\/.*$/, '');

	const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
	return domainRegex.test(cleanDomain) && cleanDomain.length > 3;
}

// Nettoyer le domaine
function cleanDomain(domain) {
	return domain.trim().toLowerCase()
		.replace(/^https?:\/\//, '')
		.replace(/^www\./, '')
		.replace(/\/.*$/, '');
}

// Afficher un message temporaire
function showMessage(element, duration = 2000) {
	element.style.display = 'block';
	setTimeout(() => {
		element.style.display = 'none';
	}, duration);
}

// Ajouter un site
function addSite() {
	const domain = siteInput.value;

	if (!domain) return;

	const cleanedDomain = cleanDomain(domain);

	if (!isValidDomain(cleanedDomain)) {
		errorMessage.textContent = '❌ URL invalide';
		showMessage(errorMessage);
		return;
	}

	if (sites.includes(cleanedDomain)) {
		errorMessage.textContent = '❌ Site déjà ajouté';
		showMessage(errorMessage);
		return;
	}

	sites.push(cleanedDomain);
	saveData();
	renderSites();
	siteInput.value = '';

	showMessage(successMessage);
}

// Supprimer un site
function removeSite(domain) {
	sites = sites.filter(s => s !== domain);
	saveData();
	renderSites();
}

// Afficher les sites
function renderSites() {
	sitesList.innerHTML = '';

	sites.forEach(site => {
		const tag = document.createElement('div');
		tag.className = 'site-tag';

		const siteText = document.createElement('span');
		siteText.textContent = site;

		const removeBtn = document.createElement('button');
		removeBtn.className = 'remove-site';
		removeBtn.innerHTML = '×';
		removeBtn.onclick = () => removeSite(site);

		tag.appendChild(siteText);
		tag.appendChild(removeBtn);
		sitesList.appendChild(tag);
	});
}

// Mettre à jour l'affichage
function updateUI() {
	moneyDisplay.textContent = money.toFixed(2).replace('.', ',') + ' €';
	dragonNameDisplay.textContent = dragonName;
}

// Afficher un message temporaire
function showTemporaryMessage(message) {
	messageDisplay.textContent = message;
	setTimeout(() => {
		messageDisplay.textContent = '';
	}, 2000);
}

// Events - Settings
settingsBtn.addEventListener("click", () => {
	settingsPanel.classList.add("active");
});

closeSettingsBtn.addEventListener("click", () => {
	settingsPanel.classList.remove("active");
});

settingsPanel.onclick = (e) => {
	if (e.target === settingsPanel) {
		settingsPanel.style.display = 'none';
	}
};

addSiteBtn.onclick = addSite;

siteInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') addSite();
});

// Event - Nom du dragon
nameBtn.onclick = () => {
	const name = nameInput.value.trim();
	if (name) {
		dragonName = name;
		saveData();
		nameContainer.style.display = 'none';
		dragonNameDisplay.style.display = 'block';
		dragonNameDisplay.textContent = dragonName;
	}
};

nameInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') nameBtn.click();
});

// Events - Boutons produits
document.getElementById('redbull-btn').onclick = () => {
	if (money >= 1.30) {
		money -= 1.30;
		saveData();
		updateUI();
		showTemporaryMessage('🥤 Red Bull acheté !');
	} else {
		showTemporaryMessage('❌ Pas assez d\'argent !');
	}
};

document.getElementById('twix-btn').onclick = () => {
	if (money >= 2.10) {
		money -= 2.10;
		saveData();
		updateUI();
		showTemporaryMessage('🍫 Twix acheté !');
	} else {
		showTemporaryMessage('❌ Pas assez d\'argent !');
	}
};

// Initialisation au chargement
loadData();

// Écouter les changements de storage (pour sync entre onglets/popup)
chrome.storage.onChanged.addListener((changes, namespace) => {
	if (namespace === 'local') {
		if (changes.adhdragon_money) {
			money = parseFloat(changes.adhdragon_money.newValue);
			updateUI();
		}
		if (changes.adhdragon_sites) {
			sites = changes.adhdragon_sites.newValue || [];
			renderSites();
		}
		if (changes.dragonName) {
			dragonName = changes.dragonName.newValue;
			updateUI();
		}
	}
});
