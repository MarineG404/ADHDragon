const WORK_SITES = [
	"docs.google.com",
	"stackoverflow.com",
	"github.com",
	"gitmoji.dev",
	"chrome://extensions/",
	"mail.google.com",
	"calendar.google.com",
	"drive.google.com",
];

const STORAGE_KEY = "adhdragon_money";
const EARN_AMOUNT = 0.10; // € per interval
const EARN_INTERVAL = 10; // seconds per reward

let currentSite = null;
let secondsOnSite = 0;

setInterval(() => {
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
}, 1000);
