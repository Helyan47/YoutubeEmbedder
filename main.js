var loaded = false;

let iframeContainer = document.createElement('div');
iframeContainer.id = 'iframeContainer';
iframeContainer.style.display = 'flex';
iframeContainer.style.position = 'absolute';
iframeContainer.style.top = '0';
iframeContainer.style.left = '0';
iframeContainer.style.width = '100%';
iframeContainer.style.height = '100%';
iframeContainer.style.zIndex = '10000';
let iframe = document.createElement('iframe');
iframe.id = 'iframeNewVideo';
iframe.style.width = '100%';
iframe.style.height = '100%';
iframe.style.display = 'flex';
iframe.style.border = 'none';

const baseUrls = [
	{
		urlTemplate: 'playlist?list=', // playlist
		baseUrl: 'https://www.youtube.com/embed?listType=playlist&amp;list=',
		validator: (url) => {
			return url.includes('playlist?list=');
		},
		replacer: (url) => {
			return url.split('playlist?list=')[1];
		},
	},
	{
		urlTemplate: 'watch?v=', // video
		baseUrl: 'https://www.youtube.com/embed/',
		validator: (url) => {
			return url.includes('watch?v=');
		},
		replacer: (url) => {
			return url.split('watch?v=')[1];
		},
	},
];

iframe.onload = function () {
	iframe.contentWindow?.document?.body?.querySelector('#movie_player video').play();
	iframe.contentWindow?.document?.body?.querySelector('#movie_player video').focus();
};
iframeContainer.appendChild(iframe);
var onHome = false;
currentUrl = window.location.href;

function parseUrl(url) {
	if (!url) {
		return '';
	}
	const urlResult = baseUrls
		.map((baseUrl) => {
			if (baseUrl.validator(url)) {
				return `${baseUrl.baseUrl}${baseUrl.replacer(url)}?autoplay=1`;
			}
		})
		.filter((url) => url !== undefined);
	if (urlResult.length > 0) {
		return urlResult[0];
	}
	// if (url.includes('list=')) {
	// 	return `https://www.youtube.com/embed?listType=playlist&amp;list=${
	// 		url.split('list=')[1]
	// 	}?autoplay=1`;
	// }
	// const videoId = url.split('v=')[1];
	// return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

function appendIframe() {
	if (!document.getElementById('iframeContainer')) {
		document.getElementById('movie_player').appendChild(iframeContainer);
	}
}

function resetIframe() {
	iframe.src = '';
	iframe.style.display = 'none';
	loaded = false;
}

function validateCurrentUrl() {
	var currentWatch = false;
	var pastWatch = false;
	baseUrls.forEach((baseUrl) => {
		if (baseUrl.validator(window.location.href)) {
			currentWatch = true;
		}
		if (baseUrl.validator(currentUrl)) {
			pastWatch = true;
		}
		if (
			currentWatch &&
			pastWatch &&
			window.location.href.includes(currentUrl.split('youtube.com/')[1])
		) {
			return;
		} else if (currentWatch && pastWatch) {
			resetIframe();
		}
	});
	if (!currentWatch) {
		onHome = true;
	} else {
		onHome = false;
	}
	if (currentUrl !== window.location.href) {
		currentUrl = window.location.href;
		resetIframe();
	}
}

function stopPlayer() {
	appendIframe();
	validateCurrentUrl();
	if (!document.querySelector('#movie_player video').paused) {
		document.querySelector('#movie_player video').pause();
		if (!loaded && document.querySelector('#movie_player video').paused) {
			loaded = true;
			iframe.src = parseUrl(window.location.href);
			iframe.style.display = 'flex';
		}
	}
}

setInterval(() => {
	stopPlayer();
}, 1000);
