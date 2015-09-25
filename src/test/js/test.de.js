QUnit.test("test dash-connected compound nouns", function(assert) {
	// let the spellchecker run.
	var output = spellchecker.check('Internet-Plattform');
	assert.equal(output, 'Internet-Plattform', "Should not contain any spellcheck spans." );
});
QUnit.test("test compound noun", function(assert) {
	// let the spellchecker run.
	var output = spellchecker.check('Außenministerium');
	assert.equal(output, 'Außenministerium', "Should not contain any spellcheck spans." );
});
QUnit.test("test composit of name and noun", function(assert) {
	// let the spellchecker run.
	var output = spellchecker.check('EU-Kommission');
	assert.equal(output, 'EU-Kommission', "Should not contain any spellcheck spans." );
});
QUnit.test("test composit of abbreviation and adjectiv", function(assert) {
	// let the spellchecker run.
	var output = spellchecker.check('IT-gestützte');
	assert.equal(output, 'IT-gestützte', "Should not contain any spellcheck spans." );
});
QUnit.test("test composit of noun and adjectiv", function(assert) {
	// let the spellchecker run.
	var output = spellchecker.check('menschenunwürdig');
	assert.equal(output, 'menschenunwürdig', "Should not contain any spellcheck spans." );
});
QUnit.test("test composit of noun and adjectiv with hyphen", function(assert) {
	// let the spellchecker run.
	var output = spellchecker.check('Menschen-unwürdig');
	assert.equal(output, 'Menschen-unwürdig', "Should not contain any spellcheck spans." );
});
QUnit.test("test finding the correct compositum", function(assert) {
	// let the spellchecker run.
	var output = spellchecker.check('Trampolinspringen');
	assert.equal(output, 'Trampolinspringen', "Should not contain any spellcheck spans." );
});
QUnit.test("test finding the correct compositum", function(assert) {
	// let the spellchecker run.
	var output = spellchecker.check('Fertigteilen');
	assert.equal(output, 'Fertigteilen', "Should not contain any spellcheck spans." );
});
QUnit.test("test no soft-hyphen are introduced around regular hyphen", function(assert) {
	// let the spellchecker run. replace soft-hyphen back to pipe characters.
	var output = spellchecker.check('IT-Kenntnisse', {hyphenation: true}).replace(/\u00ad/g, '|');
	assert.equal(output, 'IT-Kennt|nis|se', "Should not contain any spellcheck spans." );
});
QUnit.test("test no soft-hyphen are introduced around regular hyphen", function(assert) {
	// let the spellchecker run. replace soft-hyphen back to pipe characters.
	var output = spellchecker.check('Lösungsvorschläge', {hyphenation: true}).replace(/\u00ad/g, '|');
	assert.equal(output, 'Lö|sungs|vor|schlä|ge', "Soft-hyphen should be set correctly." );
});
QUnit.test("test construct is found correctly", function(assert) {
	// let the spellchecker run. replace soft-hyphen back to pipe characters.
	var output = spellchecker.check('Texte/Berichte', {hyphenation: true}).replace(/\u00ad/g, '|');
	assert.equal(output, 'Tex|te/Be|rich|te', "Soft-hyphen should not contain any spellcheck spans. Soft-hyphen should be placed correctly." );
});
QUnit.test("test composit with special characters", function(assert) {
	// let the spellchecker run. replace soft-hyphen back to pipe characters.
	var output = spellchecker.check('"Natur"');
	assert.equal(output, '"Natur"', "Output should not contain any spellcheck spans." );
});