scrollAppend Appends results as you scroll
===============================

This will automatically append the next page of results as you continue to scroll down a page or an element.

Features:

- Define a number of pages to append before pausing with a "Show More" button.
- Float the footer after a single page of results. Reverts back to relative after another page loads.
- Uses localStorage so the user won't lose their place when clicking away and returning.
- New Feature: you can now use it multiple times in a page, and use it on multiple elements, not only in the main document scroll.

Usage:
---
```
$(window).scrollAppend({
	url: 'newsfeed.php',
	params: { type: "image", who: "friends" },
	appendTo: "#newsfeed",
	footerClass: "#footer",
	container: "document"
});
```

Here are CSS classes it uses (.footer_fixed is required for the fixed footer feature):
 
```
.scroll_append_more { width: 100%; text-align: center; }
.scroll_append_loading { width: 100%; }
.scroll_append_loading img { display: block; margin-left: auto; margin-right: auto; }
.footer_fixed { position: fixed; bottom: 0px; }
```

When you've reached the last page of results simply have your server-side script return the word "false" in plain text.

Discuss at Hawkee:
http://www.hawkee.com/snippet/9883/
