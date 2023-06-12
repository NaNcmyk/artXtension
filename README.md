## **Noah's art-X-tension 2.0 🐾🌈**

Have you ever wanted to transform your portal into the World Wide Web into...your very own finger-painting canvas?! And, to clarify, by *finger-painting*, I mean, paw-painting. Because...err...you don't have human fingers 🙃. Allow me to introduce you to this artXtension--you animal, you. It's about time you show the world your portrait of an artist--as a young pup 🎨🐾🐾🖼️

*Side note: This browser extension was created as part of a larger project in 2021. Check out the [Noahs_ARTkives](https://github.com/NaNcmyk/Noahs_ARTkives) repo for more info.*

---

**INSTALLATION**

🖥️ **Chrome Users**: Head over to the below URL. Switch on developer mode to reveal the "load unpacked" button. Click on "load unpacked" to upload the unzipped _artXtension_ folder to install the extension.

    chrome://extensions/

🖥️ **Firefox Users**: Head over to the below URL. Click "Load Temporary Add-on..." to upload the _manifest.json_ file from the unzipped _artXtension_ folder to install the extension.

    about:debugging#/runtime/this-firefox

Once installed, the extension will show up in your browser's extension management UI, and the artXtension icon (hint: looks like scribble) should display on your toolbar.

In addition to official browser-specific docs, [Smashing Magazine has written a helpful article](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/) related to cross-browser extension development, which explains how to manually install extensions in developer mode on other browsers (besides Chrome and Firefox).

---

**USER GUIDE**

*This is the quick  and dirty version of how the extension works. See Technical Guide, below, for a more detailed run-down.*

1. The crosshair cursor indicates that the web page you're currently viewing is ready to be painted on. (E.g., navigate to any Google search results page, the default cursor should now be a crosshair cursor.)
2. While the web page is acting as a canvas (backdrop) for your masterpieces, note that its content will not be able to receive pointer events. E.g., any links on that web page will not be clickable.
3. Paintbrush color is rainbow 🌈 by default. Although this base color is fixed, you can still change the blend modes to manipulate the colors. Open the extension's pop-up to select a new blend mode. ⚠️ *Remember to click the "change blend mode" button to confirm the change.*
4. To activate the paw-stamping functionality, depending on what device you're using, simply double-tap your screen or double-click your mouse.
5. Reload page to erase and start again. Or navigate to a new page to set up a new canvas.

---

**TECHNICAL GUIDE**

This repo consists of 10 files, all within the root directory:

1. **_manifest.json_**
    + This _.json_ file contains the extension's meta data. All extensions are required to have a Manifest. Per Chrome documentation, at minimum, a Manifest must consist of the following three keys:
        + `manifest` - updated to Manifest v3 (2023)
        + `name` - Noah's art-X-tension is the name of the extension
        + `version` - updated to 2.0 (2023)
    + As of 2023, Chrome has migrated to Manifest v3. This extension was originally written for Manifest v2 (in 2021). While v2 continues to work on Firefox, it is no longer supported by Chrome.
    + *manifest.json* has now been updated to reflect [Manifest v3's specs](https://developer.chrome.com/docs/extensions/mv3/mv3-migration-checklist/).
    + In addition to the three boilerplate keys, the Manifest contains these additional six keys:
        + `description` - This is a short blurb that introduces users to the extension. It's used by the Chrome Web Store and in the extension management page.
        + `icons` - This lists all icons provided in the extension's directory. There are three in this extension: _icon16.png_, _icon64.png_, _icon128.png_.
        + `web_accessible_resources` - required for the extension to access any images via the `extension` API's `runtime.getUrl()` method used in _content.js_. Simply using the image file's relative path will not work.
        + `content_scripts` - for all things related to the web page content displayed by the browser... This is where _content.js_ and _content.css_ are referenced. Here, via the `matches` property, is also where we specify which websites we want the extension to run on. The value `<all_urls>` will match all URLs indiscriminately.
        + `permissions` - Permissions for `tabs` and `activeTab` are included for _popup.js_ to access the user's browser tab information using the `tabs` API. This way, _popup.js_ can send tab-specific messages that _content.js_ can pass on to the relevant tab. `storage` permission is included so that _popup.js_ can use the `storage` API to save information about the user's blend mode selections.
        + `action` (formerly `browser-action` for Manifest v2) - for all things related to the pop-up menu... _logo64.png_ is specified as the pop-up button's default logo. _popup.html_ is also referenced here. Text for the optional tooltip that displays when the user hovers over the pop-up button is included here as well.

1. **_content.js_**
    + Much of the code for the extension's painting and stamping features has been adapted from [_paint.js_](https://github.com/NaNcmyk/Noahs_ARTkives/blob/main/scripts/paint.js) of the *Noahs_ARTkives* repo.
    + The height of the canvas has been set to document's full body height to allow users to draw beyond the window's inner height, so they can paint over longer pages that have scrollable content.
    + The `pageX` and `pageY` (instead of `clientX` and `clientY`) `MouseEvent` properties are used to allow users to stamp beyond the window's inner width and inner height. Since the canvas is now the entire page of the document, and not just limited to the window height (which was the case for the main website's canvas), the `MouseEvent` properties that capture the `x` and `y` positions of the pointer event had to be updated accordingly. 
    + The canvas's cursor has been set to crosshair to indicate when web pages can be painted over.
    + This script listens for messages from _popup.js_ regarding which blend mode the user selected in the pop-up menu using the `runtime.onMessage` listener. This data is then used to change the `globalCompositeOperation` of the brush based on the user's selection.
    + ⚠️ Notice, when the canvas is superimposed over the web page, while the content underneath is tabbable, the user cannot not interact with any of it using standard pointer devices such as a mouse. E.g., links are not clickable. This is not ideal. I've experimented with setting `pointer-events` to `none` for the canvas so that focus can break through the canvas surface. This seems to cause the brush to not run as smoothly, so I've opted to omit it. Otherwise, best to turn off the extension if read-only web content is a concern.

1. **_content.css_**
    + This stylesheet contains the style rules for the paw print pulsing animation.
    + In the absence of a related _html_ file, the Manifest is able to link the styles in this file to _content.js_.
    + Since relative paths cannot be used as URLs to link to image files, and `extension.runtime.getURL()` does not work in a _.css_ file, _paw.svg_ was converted to a data URL, using a handy data URL generator tool by [dopiaza.org](https://dopiaza.org/tools/datauri/index.php). This data URL is used as the `url()` value for the `background-image` property of the JavaScript-generated paw `div`.
    + `url(chrome-extension://__MSG_@@extension_id__/paw.svg)` has been commented out since this method of referencing the file path in _CSS_ only works for Chrome.

1. **_popup.html_**
    + This file contains the markup to display the 16 blend mode color options and the submit button of the pop-up menu.
    + Google Fonts is linked to within the `<head>` tags of this document so that the pop-up has access to the [Syne Mono](https://fonts.google.com/specimen/Syne+Mono) font.

1. **_popup.css_**
    + This stylesheet contains the style rules for the extension's pop-up.
    + The `<label>` text color for the "checked" (🐽) radio input is set to white. This serves two purposes (for those who are not visually impaired, that is):
        + to visually match the submit button's white-colored "change blend mode" text as the user toggles through all the different blend mode options. 
        + as an extra indicator (besides the 🐽) of what the current selection is when the pop-up is closed and reopened.

1. **_popup.js_**
    + This script communicates to _content.js_ about which blend mode selection the user made from the pop-up menu by storing and retrieving this data via the `storage` API.
    + `storage.local` was used over `storage.sync` for better browser compatibility. Firefox requires an additional `browser_specific_settings` key in the Manifest to use `storage.sync` which Chrome does not support.
    + The `tabs.query()` function is used to figure out which tab the user is currently active on.
    + The `tabs.sendMessage()` function is used to send data regarding which blend modes the user selected, to the tabs returned by the `tabs.query()` function, every time the submit button is clicked. This data is stored in the `previousSelection` and `updatedSelection` variables.
    + The `previousSelection` object contains data about which blend mode the user last chose so that:
        + when the pop-up is closed and reopened, the user's current selection remains selected.
        + when the page is refreshed, the user's last selection remains "checked" (🐽). 
        + when the user switches to stamping and needs to reset the brush to the previous selection (because the `globalCompositeOperation` returns to `source-over`), that previous selection is remembered.
    + The `updatedSelection` object contains data about the user's new selection and changes the brush color accordingly--after the submit button is clicked.
    + The text content and color of the submit button are programmatically determined based on the user's blend mode selection and interaction with the canvas. The button will display one of the following messages depending on context (helpful for those who can't rely on color as visual cues):
        + _"reset blend mode"_ - when the pop-up is reopened
        + _"reset successful!"_ - when the button is clicked and the previous selection is restored (either after returning to the page post-reload or reopening the pop-up after activating the stamp). The button's text color will change from white to black as an extra form of confirmation.
        + _"change blend mode"_ - as the user toggles a selection different from the current one
        + _"blend mode set!"_ - This confirms that the new selection has been successfully set. Notice, the text color of both the button and the text label of the checked input will change from white to black once the blend mode is set. Simply checking a selection will not change the brush color, the submit button also needs to be clicked. Reopening the pop-up will indicate this, as the checked-but-not-submitted blend mode will not be "checked".

1. **_paw.svg_**
    + Image source: [SVG Repo](https://www.svgrepo.com/svg/24106/pawprints)
    + This file is used  in  _content.js_ (as the image "prototype" for the stamp) and in _content.css_ (as the image mask that is clipped to the dynamically generated background color specified in _content.js_).
    + Double clicking the canvas (namely, whatever web page the user happens to be viewing) will activate the stamping/pulsing animation feature. By associating a `dblclick` event instead of a single click--i.e., a `click` or `pointerdown` event--with stamping, event listeners appended to the document's body can better differentiate between drawing (a `pointerdown` event) and stamping.
    + Once the stamp has been activated, though, the `globalCompositeOperation` reverts to `source-over` when switching to drawing to allow the stamp color to print over the existing content. Resetting the last selected blend mode--if not `source-over`--simply requires hitting the reset button on the pop-up menu. 

1. **_icon64.png_**
    + This is the default "scribble" logo icon used for both the pop-up button and the icon used in the extensions management page. A 48 x 48 icon is the recommended png size for Chrome and Firefox. Other browsers have different requirements. A 64 x 64 icon can be scaled down to meet the requirements of other browsers. 

1. **_icon16.png_**
    + This is the same logo, in a smaller size, which can be used as a tab favicon. This extension does not currently have its own pages. Should there be a need for it in the future, it's available.

1. **_icon128.png_**
    + This is the same logo, in a bigger size. This bigger logo size is used during installation and by the Chrome Web Store.

This extension is 100% functional in both Chrome and Firefox. It was developed in Chrome and tested for compatibility in Firefox. Firefox's [extension compatibility tool](https://www.extensiontest.com/) returns no errors 🥳🎉🎊.