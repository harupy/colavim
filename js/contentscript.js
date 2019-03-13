const s = document.createElement('script');
s.setAttribute('type', 'module');
s.src = chrome.extension.getURL('js/main.js');
(document.head || document.documentElement).appendChild(s);