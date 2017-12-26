/**
 * Client application
 */

// When DOM is ready
document.addEventListener('DOMContentLoaded', function () {
	var result = document.getElementById('result');
	var style = document.getElementById('style');

	/**
	 * Data holder
	 */
	var holder = {
		html: document.getElementById('html-holder'),
		css: document.getElementById('css-holder'),
		js: document.getElementById('js-holder'),
		des: document.getElementById('des-holder'),
		config: document.getElementById('config-holder'),
		getData: function () {
			this.html.value = editor.html.getValue();
			this.css.value = editor.css.getValue();
			this.js.value = editor.js.getValue();
			this.des.value = editor.des.getValue();
		}
	}

	/**
	 * Handler all editor
	 * HTML CSS JS DES
	 */
	var editor = {};
	// Array list of div editor
	editor.div = [
		document.getElementById('codeeditor_html'),
		document.getElementById('codeeditor_css'),
		document.getElementById('codeeditor_js'),
		document.getElementById('codeeditor_des')
	]

    // HTML mirror
	editor.html = CodeMirror(editor.div[0], {
		value: holder.html.value,
		mode: {
			name: "htmlmixed",
			scriptTypes: [
				{
					matches: /\/x-handlebars-template|\/x-mustache/i,
                    mode: null
                },
                {
                	matches: /(text|application)\/(x-)?vb(a|script)/i,
                    mode: "vbscript"
                }
            ]
    	},
    	lineWrapping: true,
		theme: 'eclipse',
		tabSize: 4,
		indentUnit: 4,
		lineNumbers: true,
		firstLineNumber: 1,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	})

	// CSS mirror
	editor.css = CodeMirror(editor.div[1], {
		value: holder.css.value,
		mode: 'css',
		lineWrapping: true,
		theme: 'eclipse',
		tabSize: 4,
		indentUnit: 4,
		lineNumbers: true,
		firstLineNumber: 1,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	})

	// JS mirror
	editor.js = CodeMirror(editor.div[2], {
		value: holder.js.value,
		mode: 'javascript',
		lineWrapping: true,
		theme: 'eclipse',
		tabSize: 4,
		indentUnit: 4,
		lineNumbers: true,
		firstLineNumber: 1,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	})

	// DES mirror
	editor.des = CodeMirror(editor.div[3], {
		value: holder.des.value,
		mode: {
			name: "htmlmixed",
			scriptTypes: [
				{
					matches: /\/x-handlebars-template|\/x-mustache/i,
                    mode: null
                },
                {
                	matches: /(text|application)\/(x-)?vb(a|script)/i,
                    mode: "vbscript"
                }
            ]
    	},
    	lineWrapping: true,
		theme: 'eclipse',
		tabSize: 4,
		indentUnit: 4,
		lineNumbers: true,
		firstLineNumber: 1,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	})

	/**
	 * Handler all controls
	 */
	var controler = {}

	// Run code
	controler.runCode = function () {
		holder.getData();
		holder.config.value = JSON.stringify({
			resultWidth: result.offsetWidth,
			resutlHeight: result.offsetHeight,
			currentBookmark: bookmark.current,
			isLayout2: layout.isLayout2
		});

		location.reload();
	}

	// List of buttons
	controler.btn = document.getElementById('controls').getElementsByTagName('button');

	// Play button
	controler.play =  document.getElementById('play');

	// Select editor mode html/css/js
	controler.selectMode =  function (m) {
		for (i = 0; i < this.btn.length; i++) {
			controler.btn[i].className = '';
			editor.div[i].style.display = 'none';
		}
		controler.btn[m].className = 'active';
		editor.div[m].style.display = 'block';
	}

	controler.event = [
		// run code
		controler.play.addEventListener('click', controler.runCode),
		
		controler.btn[0].addEventListener('click', function () {
			controler.selectMode(0);
		}),
		controler.btn[1].addEventListener('click', function () {
			controler.selectMode(1);
			editor.css.focus();
		}),
		controler.btn[2].addEventListener('click', function () {
			controler.selectMode(2);
		}),
		controler.btn[3].addEventListener('click', function () {
			controler.selectMode(3);
		}),

		// Exports code
		document.getElementById('export-code').addEventListener('click', function () {
			var code = JSON.stringify({
				html: editor.html.getValue(),
				css: editor.css.getValue(),
				js: editor.js.getValue(),
				des: editor.des.getValue()
			});
			alert(code);
		})
	]

	/**
	 * Menu
	 */
	var menu = {}
	menu.anchor = document.getElementById('anchor');
	menu.menu = document.getElementById('menu');
	menu.overlay = document.getElementById('overlay');

	menu.close = function () {
		menu.menu.className = '';
		menu.isOpen = false;
	}

	menu.open = function () {
		menu.menu.className = 'open';
		menu.isOpen = true;
	}

	menu.isOpen = false;

	menu.event = [
		// Open or close menu
		menu.anchor.addEventListener('click', function () {
			if (menu.isOpen) {
				menu.close();
			} else {
				menu.open();
			}
		}),

		// Click to overlay to close
		menu.overlay.addEventListener('click', function () {
			menu.close();
		})
	]

	/**
	 * Change layout
	 */
	var layout = {}

	layout.isLayout2 = false;

	layout.onLayout1 = function () {
		document.getElementById('main').className = '';
		layout.isLayout2 = false;
		document.getElementById('layout').className = '';
	}

	layout.onLayout2 = function () {
		document.getElementById('main').className = 'layout-2';
		layout.isLayout2 = true;
		document.getElementById('layout').className = 'changed';
	}

	document.getElementById('layout').addEventListener('click', function () {
		if (layout.isLayout2) {
			layout.onLayout1();
		} else {
			layout.onLayout2();
		}
	});

	/**
	 * Bookmark
	 */
	var bookmark = {}
	bookmark.ul = document.querySelector('#bookmark + label + ul');
	bookmark.current = 0;
	bookmark.lis = [];
	bookmark.init = function () {
		// Clear ul
		bookmark.ul.innerHTML = '';
		// add slide name
		bookmark.ul.innerHTML = '<div class="title">' + sliderName + '</div>';
		// add list li tags
		for (var i = 0; i < data.length; i++) {
			bookmark.ul.innerHTML += '<li slide="' + i + '"">' + data[i].name + '</li>';
		}
		// DOM list li tags
		bookmark.lis = bookmark.ul.getElementsByTagName('li');
		// add event list li tags
		for (var i = 0; i < bookmark.lis.length; i++) {
			bookmark.lis[i].addEventListener('click', function () {
				bookmark.selectBookmark(this.getAttribute('slide'));
			});
		}
	}

	// Select boomark
	bookmark.selectBookmark = function (x) {
		x = eval(x);
		bookmark.current = x;
		// Clear active li
		for (var i = 0; i < bookmark.lis.length; i++) bookmark.lis[i].className = '';
		// Active li
		bookmark.lis[x].className = 'active';
		// Set description
		description.innerHTML = data[x].code.des;
		// Set code
		controler.selectMode(0);
		editor.html.getDoc().setValue(data[x].code.html);
		controler.selectMode(1);
		editor.css.getDoc().setValue(data[x].code.css);
		controler.selectMode(2);
		editor.js.getDoc().setValue(data[x].code.js);
		controler.selectMode(3);
		editor.des.getDoc().setValue(data[x].code.des);
		controler.selectMode(0);
	}

	// Hot key
	document.addEventListener('keyup', function (event) {
		// ESC key
		if (event.keyCode == 27) {
			if (menu.isOpen) {
				menu.close();
			} else {
				menu.open();
			}
		}
	})

	bookmark.init();

	var configHolder = JSON.parse(holder.config.value);
	console.log(configHolder);
	// Fix size result
	result.style.width = '' + configHolder.resultWidth + 'px';
	result.style.height = '' + configHolder.resutlHeight + 'px';
	bookmark.current = configHolder.currentBookmark;
	for (var i = 0; i < bookmark.lis.length; i++) bookmark.lis[i].className = '';
	if (configHolder.currentBookmark > -1) bookmark.lis[configHolder.currentBookmark].className = 'active';

	// Layout
	layout.isLayout2 = configHolder.isLayout2;
	if (layout.isLayout2) {
		layout.onLayout2();
	} else {
		layout.onLayout1();
	}
	

	// Add editor html
	result.innerHTML = holder.html.value;
	// Add editor css
	style.innerHTML = holder.css.value;
	// Add description
	description.innerHTML = holder.des.value;
})