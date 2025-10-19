const STORAGE_KEY = "adhdragon_money";
const SITES_KEY = "adhdragon_sites";
const EARN_AMOUNT = 0.10; // € per interval
const EARN_INTERVAL = 10; // seconds per reward

let currentSite = null;
let secondsOnSite = 0;
let WORK_SITES = [];

chrome.storage.local.get([SITES_KEY], (result) => {
	WORK_SITES = result[SITES_KEY] || [
		"docs.google.com",
		"stackoverflow.com",
		"github.com"
	];
});

// Check if URL matches any work site
function isWorkSite(url) {
	if (!url) return false;

	return WORK_SITES.some(site => {
		// Handle chrome:// URLs
		if (site.startsWith("chrome://")) {
			return url.startsWith(site);
		}

		// Remove protocol and www for regular URLs
		const cleanUrl = url.replace(/^https?:\/\/(www\.)?/, "");
		const cleanSite = site.replace(/^https?:\/\/(www\.)?/, "");
		return cleanUrl.includes(cleanSite);
	});
}

// Add money to storage
function addMoney() {
	chrome.storage.local.get([STORAGE_KEY], (result) => {
		let money = result[STORAGE_KEY] !== undefined ? parseFloat(result[STORAGE_KEY]) : 5.00;
		money += EARN_AMOUNT;
		chrome.storage.local.set({ [STORAGE_KEY]: money });
	});
}

// Main interval
setInterval(() => {
	chrome.storage.local.get([SITES_KEY], (result) => {
		WORK_SITES = result[SITES_KEY] || [
			"docs.google.com",
			"stackoverflow.com",
			"github.com"
		];

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0] && tabs[0].url) {
				const url = tabs[0].url;

				if (isWorkSite(url)) {
					// Extract site name for tracking
					const siteName = url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];

					if (currentSite !== siteName) {
						currentSite = siteName;
						secondsOnSite = 0;
					}

					secondsOnSite++;

					// Earn money every EARN_INTERVAL seconds
					if (secondsOnSite % EARN_INTERVAL === 0) {
						addMoney();
					}
				} else {
					// Reset if not on a work site
					currentSite = null;
					secondsOnSite = 0;
				}
			}
		});
	});
}, 1000);

// Listen for storage changes to update WORK_SITES
chrome.storage.onChanged.addListener((changes, namespace) => {
	if (namespace === "local" && changes[SITES_KEY]) {
		WORK_SITES = changes[SITES_KEY].newValue || [];
	}
});
