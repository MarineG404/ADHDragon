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
				const matchedSite = WORK_SITES.find(site => url.includes(site));
				if (matchedSite) {
					if (currentSite !== matchedSite) {
						currentSite = matchedSite;
						secondsOnSite = 0;
					}
					secondsOnSite++;
					if (secondsOnSite % EARN_INTERVAL === 0) {
						chrome.storage.local.get([STORAGE_KEY], (result) => {
							let money = result[STORAGE_KEY] !== undefined ? parseFloat(result[STORAGE_KEY]) : 5.00;
							money += EARN_AMOUNT;
							chrome.storage.local.set({ [STORAGE_KEY]: money });
						});
					}
				} else {
					currentSite = null;
					secondsOnSite = 0;
				}
			}
		});
	});
}, 1000);
