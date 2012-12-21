scrollAppend Appends results as you scroll
===============================

This will automatically append the next page of results as you continue to scroll down a page.

Features:

- Define a number of pages to append before pausing with a "Show More" button.
- Float the footer after a single page of results. Reverts back to relative after another page loads.
- Uses localStorage so the user won't lose their place when clicking away and returning.

Usage:
---
```
$(window).scrollAppend({
	url: 'newsfeed.php',
	params: { type: "image", who: "friends" },
	appendTo: "#newsfeed",
	footerClass: "#footer"
});
```

You can style the loading and show more divs with the following tags:
 
```
.scroll_append_more { width: 100%; text-align: center; }
.scroll_append_loading { width: 100%; }
.scroll_append_loading img { display: block; margin-left: auto; margin-right: auto; }
.footer_fixed { position: fixed; bottom: 0px; }
```

When you've reached the last page of results simply have your server-side script return the word "false" in plain text.
