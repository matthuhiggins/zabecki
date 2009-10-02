// Image utilities
var rootPortfolioSrc = "images/portfolio/";

function alphaOnly(val) {
	return val.replace(/[^A-Z]/ig,"").toLowerCase();
}

var getContentImgSrc = function(caption) {
	return rootPortfolioSrc + alphaOnly(caption) + ".jpg";
}
var getDescriptionImgSrc = function(caption) {
	return rootPortfolioSrc + alphaOnly(caption) + "_desc.gif";
}
var getNotesImgSrc = function(caption) {
	return rootPortfolioSrc + alphaOnly(caption) + "_notes.gif";
}

function getPortfolioLinks() {
	return $('portfolioLinks').getElementsByTagName('span');
}

function getSelectedIndex() {
	var portfolioLinks = getPortfolioLinks();
	for (var i = 0; i < portfolioLinks.length; i++) { 
		if (Element.hasClassName(portfolioLinks[i], "selected"))
			return i;
	}
	return -1;
}

function getCurrentSelection() {
	var portfolioLinks = getPortfolioLinks();
	return getSelectedIndex() < 0 ? null : portfolioLinks[ getSelectedIndex() ];
}

function getNextContent() {
	var portfolioLinks = getPortfolioLinks();
	return getSelectedIndex() + 1 == portfolioLinks.length ? portfolioLinks[0] :
			portfolioLinks[ getSelectedIndex() + 1 ];
}

function getPrevContent() {
	var portfolioLinks = getPortfolioLinks();
	return getSelectedIndex() - 1 < 0 ? portfolioLinks[portfolioLinks.length-1] :
			portfolioLinks[ getSelectedIndex() - 1 ]
}

function getSelectionAsId(selection, notes) {
	if (!selection) return null;
	return alphaOnly(selection.innerHTML) + (notes ? "notes" : "image");
}

function getCurrentSelectionAsId() {
	if (!(currentSelection = getCurrentSelection())) return null;
	return getSelectionAsId(currentSelection, 
			Element.hasClassName(currentSelection, "notesOnly") ||
			Element.hasClassName($('contentOptionNotes'), "selected"));
}

function sendEmail(e) {
	parent.location="mailto:shawn@layervisual.com";
}

function prepareEmailContact(linkElement) {
	$(linkElement).style.cursor = "pointer";
	Event.observe(linkElement, "click", sendEmail, false)
}


// replace current portfolio image with new one
function replacePrimaryImage(newContent, notes) {
	if (getCurrentSelection()  != null) {
		currentSelectionId = getCurrentSelectionAsId();
		new Effect.Fade($(currentSelectionId), {duration: 0.5, queue: {position: 'end', scope: currentSelectionId} } );
	}
	
	// Images in Safari do not have style attributes,
	// so a wrapping div is required.
	wrappingDiv = document.createElement('div');
	wrappingDiv.style.display = 'none';
	wrappingDiv.style.position = 'absolute';
	wrappingDiv.style.left = '0px';
	wrappingDiv.style.top = '0px';
	$('contentImage').appendChild(wrappingDiv);
	wrappingDiv.id = getSelectionAsId(newContent, notes);
	
	img = new Image();
	wrappingDiv.appendChild(img);
	img.onload = function () {
		new Effect.Appear(wrappingDiv.id, {queue: {position: 'end', scope: wrappingDiv.id} } );
	}
	img.src = notes ? getNotesImgSrc(newContent.innerHTML) : getContentImgSrc(newContent.innerHTML);
	
	$('contentOptionImage').className = (notes ?  "" : "selected");
	$('contentOptionNotes').className = (notes ?  "selected" : "");

	return wrappingDiv;
}

function selectNewContent(newContent) {
	var newImage = replacePrimaryImage(newContent, Element.hasClassName(newContent, 'notesOnly'));

	// Select portfolio link
	Element.removeClassName(getCurrentSelection(), "selected");
	Element.addClassName(newContent, "selected");
	
  if (getCurrentSelection().id == "contactEmailLink") {
		prepareEmailContact(newImage);
	}

	// Show description image
	$('descriptionImage').innerHTML = "";
	img = new Image();
	img.src =  getDescriptionImgSrc(newContent.innerHTML);
	$('descriptionImage').appendChild(img);

	// Show image/notes section if necessary
	$('contentOptionNotes').className = "";
	$('contentOptionImage').className = "selected";
	$("contentOptions").style.display = Element.hasClassName(newContent, 'notesOnly') ?
			"none" : "";
}

function keyHandler(e) {
	if (e.keyCode == Event.KEY_DOWN) {
		selectNewContent(getNextContent());

	} else if (e.keyCode == Event.KEY_UP) {
		selectNewContent(getPrevContent());

	} else if ($('contentOptions').style.display == "") {
		if (e.keyCode == Event.KEY_LEFT)
			replacePrimaryImage(getCurrentSelection(), false);
		else if (e.keyCode == Event.KEY_RIGHT)
			replacePrimaryImage(getCurrentSelection(), true);
	}
}

function showSite(e) {
	Effect.Appear('content', { queue: {position: 'end', scope: 'pageLoad'} } );
	Effect.Appear('portfolioItems', { queue: {position: 'end', scope: 'pageLoad'} } );
	Effect.Appear('scrollArrows', { queue: {position: 'end', scope: 'pageLoad'} } );
}

Event.observe(window, "keydown", keyHandler, false)
Event.observe(window, 'load', showSite, true);

var portfolioBehaviours = {
	'#contentOptionImage' : function(el){
		el.onclick = function(){
			replacePrimaryImage(getCurrentSelection(), false);
		}
	},
	
	'#contentOptionNotes' : function(el){
		el.onclick = function(){
			replacePrimaryImage(getCurrentSelection(), true);
		}
	},

	'#portfolioLinks img' : function(el){
		el.onclick = function(){
			album.startup();
		}
	},

	'#portfolioLinks li span' : function(el){
		el.onclick = function(){
			selectNewContent(this);
		};
	},
	
	'#scrollArrowDown' : function (el){
		el.onclick = function(){
			selectNewContent(getNextContent());
		}
	},

	'#scrollArrowUp' : function (el){
		el.onclick = function(){
			selectNewContent(getPrevContent());
		}
	}
};

Behaviour.register(portfolioBehaviours);
