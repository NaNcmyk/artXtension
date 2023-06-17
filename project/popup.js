document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll('input[type="radio"]');
    const submitBtn = document.querySelector('#submit');
    // store query parameters to variable
    let queryParams = {
        active: true,
        currentWindow: true
    };

    // show last selection in modal
    chrome.storage.local.get('blend mode', (data) => {
        if (!data['blend mode']) return;
        // if there is data in storage
        inputs.forEach(input => {
            if (input.value === data['blend mode']) {
                input.checked = true;
                submitBtn.style.color = '#fff';
                submitBtn.value = 'reset blend mode';
            }
            // when user initializes reset with button click
            submitBtn.onclick = () => {
                submitBtn.value = 'reset successful!';
                submitBtn.style.color = '#000';
            }
            // query active tab
            chrome.tabs.query(queryParams, gotTabs);
            // send user's last selection to active tabs of content script
            function gotTabs(tabs) {
                let previousSelection = {
                    lastBlendmode: data['blend mode']
                }
                chrome.tabs.sendMessage(tabs[0].id, previousSelection);
            }
        });
    });
    
    // listen for change event on radio inputs
    inputs.forEach(input => {
        input.addEventListener('change', e => {
            let selection = e.target.value;
            submitBtn.style.color = '#fff';
            submitBtn.value = 'change blend mode';

            // when user clicks submit button
            submitBtn.onclick = () => {
                // add/update selection in storage
                chrome.storage.local.set({ 'blend mode': selection }, () => {
                    // get selection from storage
                    chrome.storage.local.get('blend mode', (data) => {
                        if (input.value === data['blend mode']) {
                            input.nextElementSibling.style.color = '#000';
                            submitBtn.style.color = '#000';
                            submitBtn.value = 'blend mode set!';
                        }
                        // query active tab
                        chrome.tabs.query(queryParams, gotTabs);
                        // send user's updated selection to active tabs of content script
                        function gotTabs(tabs) {
                            let updatedSelection = {
                                updatedBlendmode: data['blend mode']
                            }
                            chrome.tabs.sendMessage(tabs[0].id, updatedSelection);
                        }
                    });
                });    
            }
            
        });
    });

});



