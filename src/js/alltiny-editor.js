/**
 * This method will return the first leaf of the given node.
 * If the node itself is a leaf then the node is returned.
 */
(function($) {
	$.fn.firstLeaf = function() {
		var node = jQuery(this)[0];
		// find the very first child of the current node.
		while (node && node.firstChild) {
			node = node.firstChild;
		}
		return jQuery(node);
	};
})(jQuery);

/**
 * This method will return the last leaf of the given node.
 * If the node itself is a leaf then the node is returned.
 */
(function($) {
	$.fn.lastLeaf = function() {
		var node = jQuery(this)[0];
		// find the very last child of the current node.
		while (node && node.lastChild) {
			node = node.lastChild;
		}
		return jQuery(node);
	};
})(jQuery);

var alltiny = alltiny || {};
alltiny.Editor = function(targetSelector, options) {
	var thisObj = this;
	this.targetSelector = targetSelector;
	this.$target = jQuery(targetSelector);
	this.options = jQuery.extend(true, {
		spellchecker : null,
		cursorCharacter : '\u2038',
		assumeStartOfSentenceWithElements : ['div','p'],
		beforeCheck : null, /*fuction(target) {}*/ // a call-back function which is being called before a check.
		afterCheck : null, /*fuction(target) {}*/ // a call-back function call after a check was done.
		language : null
	}, options);
	// ensure that given target is a content-editable.
	jQuery(targetSelector).attr('contenteditable', 'true');
	// hook a change listener onto the element.
	jQuery(targetSelector).keyup(function(e) {
		thisObj.check();
	});
};

alltiny.Editor.prototype.check = function() {
	if (typeof this.options.beforeCheck == 'function') {
		this.options.beforeCheck.call(this, this.$target);
	}
	// store current cursor postion.
	var selection = this.saveSelection(this.targetSelector);
	// start checking.
	this.performSpellcheck();
	// restore cursor postion.
	this.restoreSelection(selection);
	// call call-back
	if (typeof this.options.afterCheck == 'function') {
		this.options.afterCheck.call(this, this.$target);
	}
};

alltiny.Editor.prototype.setLanguage = function(language) {
	this.options.language = language;
};

/**
 * This method will steore the current selection in a selection object.
 * Method {@link alltiny.Editor.prototype.restoreSelection} can restore this selection.
 */
alltiny.Editor.prototype.saveSelection = function(target) {
	var thisObj = this;
	var selection = rangy.saveSelection();
	// store the target in the seelction object. Used in {@link alltiny.Editor.prototype.restoreSelection}
	selection.target = target || document.body;
	// replace all span.rangySelectionBoundary by CARETs. store the original span in the selection to be able to restore them later.
	selection.spans = [];
	jQuery(selection.target).find('span.rangySelectionBoundary').each(function(index, span) {
		selection.spans[index] = span.outerHTML; // store the spans HTML.
		// replace the span.
		jQuery(span).replaceWith(thisObj.options.cursorCharacter);
	});
	return selection;
};

/**
 * This method can restore a selection which was made by {@link alltiny.Editor.prototype.saveSelection}.
 */
alltiny.Editor.prototype.restoreSelection = function(selection) {
	// restore the spans stored in the selection object.
	var index = 0;
	var content = jQuery(selection.target).html().replace(new RegExp(this.options.cursorCharacter, 'g'), function() {
		return selection.spans[index++];
	});
	jQuery(selection.target).html(content);
	return rangy.restoreSelection(selection);
};

alltiny.Editor.prototype.removeMarkers = function() {
	return rangy.removeMarkers();
};

alltiny.Editor.prototype.performSpellcheck = function() {
	// remove any previously done checking highlights.
	this.options.spellchecker.removeAnyHighlights(this.$target);
	// to get as few text nodes as possible we need to rejoin them.
	this.rejoinTextNodes(this.$target);
	// perform our spellcheck.
	this.options.spellchecker.reset();
	this.options.spellchecker.setAssumeStartOfSentence(true);
	this.checkNode(this.$target, {language: this.options.language});
	// trigger the higher level analysis.
	this.options.spellchecker.analyze();
	// let the spellchecker highlight all findings.
	this.options.spellchecker.applyFindings();
};

alltiny.Editor.prototype.checkNode = function(node, customOptions) {
	var thisObj = this;
	var options = jQuery.extend(true, {}, customOptions); // make a deep copy.

	jQuery.each(jQuery(node).contents().get(), function(index, element) {
		if (jQuery(element).is('br')) {
			options.node = element;
			thisObj.options.spellchecker.check('\n', options);
		} else if (element.nodeType === 1) { // if this is a node again.
			if (jQuery(element).is('li')) { // if this node is an list item then activate the set the spellchecker to be case-insensitive for the next coming word.
				thisObj.options.spellchecker.setCaseInsensitiveForNextWord(true);
			}
			// assume a start of sentence if this element is one of those.
			if (jQuery(element).is(thisObj.options.assumeStartOfSentenceWithElements.join(', '))) {
				thisObj.options.spellchecker.setAssumeStartOfSentence(true);
			}
			thisObj.checkNode(element, options);
		} else if (element.nodeType === 3) { // if this is a text node then check it with the spellChecker.
			options.node = element;
			var $blockParent = jQuery(element).closest('li,h1,h2,h3,h4,h5,p,div');
			// don't check for white space at begin if this is the first node of an li-element.
			options.checkWhitespaceAtBegin = !($blockParent.length > 0 && $blockParent.firstLeaf()[0] === element);
			// don't check for white space at end if this is the last node of an li-element.
			options.checkWhitespaceAtEnd = !($blockParent.length > 0 && $blockParent.lastLeaf()[0] === element);
			thisObj.options.spellchecker.check(element.nodeValue, options);
		}
	});
};

/**
 * Inserting and removing spans in the editor content will create split textNodes.
 * This method will rejoin all the textNodes.
 */
alltiny.Editor.prototype.rejoinTextNodes = function($target) {
	jQuery($target)[0].normalize();
};