const s = document.createElement('script');
s.src = chrome.extension.getURL('js/main.js');
(document.head || document.documentElement).appendChild(s);