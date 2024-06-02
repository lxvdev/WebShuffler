// ==UserScript==
// @name         WebShuffler
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Shuffles every text on websites
// @author       lxvdev
// @license      MIT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to shuffle all the text on the website
    function shuffleText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent.trim();
            if (text.length > 1) {
                let shuffledText = text.split('').sort(() => Math.random() - 0.5).join('');
                node.textContent = shuffledText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(function(childNode) {
                shuffleText(childNode);
            });
        }
    }

    // Function for shuffling text that changed
    function handleMutations(mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                        shuffleText(node);
                    }
                });
            }
        });
    }

    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });

    // Starts observing for text changes
    function startObserver() {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Starts observing and shuffles text if the tab gets focused again
    window.addEventListener('focus', () => {
        startObserver();
        shuffleText(document.body);
    });

    // Stops observing if the tab isn't focused
    window.addEventListener('blur', () => {
        observer.disconnect();
    });

    // Shuffles text on load
    window.onload = function() {
        shuffleText(document.body);
    };
})();
