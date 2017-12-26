/**
 * Client application
 */

// Load config
var config = JSON.parse(httpGet('superMan.php?request=getConfig'));

// When DOM is ready
document.addEventListener('DOMContentLoaded', function () {
	var result = document.getElementById('result');
	var style = document.getElementById('style');
	var script = document.getElementById('script');
	var description = document.getElementById('description');
	var iresult = document.getElementById('iresult');

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
    	lineWrapping: config.editor.lineWrapping,
		theme: config.editor.theme,
		tabSize: config.editor.tabSize,
		indentUnit: config.editor.tabSize,
		lineNumbers: config.editor.lineNumbers,
		firstLineNumber: config.editor.firstLineNumber,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	})

	// CSS mirror
	editor.css = CodeMirror(editor.div[1], {
		mode: 'css',
		lineWrapping: config.editor.lineWrapping,
		theme: config.editor.theme,
		tabSize: config.editor.tabSize,
		indentUnit: config.editor.tabSize,
		lineNumbers: config.editor.lineNumbers,
		firstLineNumber: config.editor.firstLineNumber,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	})

	// JS mirror
	editor.js = CodeMirror(editor.div[2], {
		mode: 'javascript',
		lineWrapping: config.editor.lineWrapping,
		theme: config.editor.theme,
		tabSize: config.editor.tabSize,
		indentUnit: config.editor.tabSize,
		lineNumbers: config.editor.lineNumbers,
		firstLineNumber: config.editor.firstLineNumber,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	})

	// DES mirror
	editor.des = CodeMirror(editor.div[3], {
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
    	lineWrapping: config.editor.lineWrapping,
		theme: config.editor.theme,
		tabSize: config.editor.tabSize,
		indentUnit: config.editor.tabSize,
		lineNumbers: config.editor.lineNumbers,
		firstLineNumber: config.editor.firstLineNumber,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	})

	/**
	 * Handler all controls
	 */
	var controler = {}

	// Run code
	controler.runCode = function () {
		var buffer = {};
		buffer.html = editor.html.getValue();
		buffer.css = editor.css.getValue();
		buffer.js = editor.js.getValue();
		httpPost('superMan.php', 'request=saveBuffer&buffer=' + encodeURIComponent(JSON.stringify(buffer)));
		iresult.contentWindow.location.reload();

		if (mode.isDev) {
			buffer.description = editor.des.getValue();
			var param = 'request=saveSlide'
			+'&slider='
			+ slider.current
			+ '&bookmark='
			+ bookmark.current
			+ '&buffer='
			+ encodeURIComponent(JSON.stringify(buffer));
			httpPost('superMan.php', param);

			// Refresh slider
			slider.refresh();
		}
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
	];

	/**
	 * Slider
	 */
	var slider = {}
	slider.current = 0;
	slider.index = [];
	slider.ul = document.querySelector('#slider + label + ul');
	slider.lis = [];

	// Select slider
	slider.selectSlider = function (x) {
		slider.current = x;
		bookmark.slide = JSON.parse(httpGet('superMan.php?request=getSlide&id=' + x));
		// Clear active li
		for (var i = 0; i < slider.lis.length; i++) slider.lis[i].className = '';
		// Active li
		slider.lis[x].className = 'active';
		bookmark.init();
		document.getElementById('bookmark').checked = true;
		
	}

	slider.init = function () {
		// Clear ul
		slider.ul.innerHTML = '';
		// add list li tags
		var index = httpGet('superMan.php?request=getSliderIndex');
		if (index != '0') {
			slider.index = JSON.parse(index);
		} else return;
		for (var i = 0; i < slider.index.length; i++) {
			slider.ul.innerHTML += '<li slide="' + i + '"">' + slider.index[i].name + '</li>';
		}
		// DOM list li tags
		slider.lis = slider.ul.getElementsByTagName('li');
		// add event list li tags
		for (var i = 0; i < slider.lis.length; i++) {
			slider.lis[i].addEventListener('click', function () {
				slider.selectSlider(this.getAttribute('slide'));
			});
		}
		slider.selectSlider(0);
	}

	slider.refresh = function () {
		var bc = bookmark.current;
		var sc = slider.current;
		slider.init();
		slider.selectSlider(sc);
		bookmark.selectBookmark(bc);
	}

	/**
	 * Bookmark
	 */
	var bookmark = {}
	bookmark.current = 0;
	bookmark.slide = JSON.parse(httpGet('superMan.php?request=getSlide&id=0'));
	bookmark.ul = document.querySelector('#bookmark + label + ul');
	bookmark.lis = [];
	bookmark.init = function () {
		// Clear ul
		bookmark.ul.innerHTML = '';
		// add slide name
		bookmark.ul.innerHTML = '<div class="title">' + bookmark.slide.name + '</div>';
		// add list li tags
		for (var i = 0; i < bookmark.slide.slides.length; i++) {
			bookmark.ul.innerHTML += '<li slide="' + i + '"">' + bookmark.slide.slides[i].title + '</li>';
		}
		// DOM list li tags
		bookmark.lis = bookmark.ul.getElementsByTagName('li');
		// add event list li tags
		for (var i = 0; i < bookmark.lis.length; i++) {
			bookmark.lis[i].addEventListener('click', function () {
				bookmark.selectBookmark(this.getAttribute('slide'));
			});
		}
		// Select bookmark 0
		if (bookmark.slide.slides.length != 0) bookmark.selectBookmark(0);
	}

	// Select boomark
	bookmark.selectBookmark = function (x) {
		bookmark.current = x;
		// Clear active li
		for (var i = 0; i < bookmark.lis.length; i++) bookmark.lis[i].className = '';
		// Active li
		bookmark.lis[x].className = 'active';
		// Set description
		description.innerHTML = bookmark.slide.slides[x].description;
		// Set code
		controler.selectMode(0);
		editor.html.getDoc().setValue(bookmark.slide.slides[x].html);
		controler.selectMode(1);
		editor.css.getDoc().setValue(bookmark.slide.slides[x].css);
		controler.selectMode(2);
		editor.js.getDoc().setValue(bookmark.slide.slides[x].js);
		controler.selectMode(3);
		editor.des.getDoc().setValue(bookmark.slide.slides[x].description);
		controler.selectMode(0);
	}

	/**
	 * Mode
	 */
	var mode = {}
	mode.isDev = false;
	mode.btnUse = document.getElementById('use-mode');
	mode.btnDev = document.getElementById('dev-mode');
	mode.event = [
		mode.btnDev.addEventListener('click', function () {
			mode.btnDev.className = 'active';
			mode.btnUse.className = '';
			mode.isDev = true;
			controler.btn[3].style.visibility = 'visible';
			controler.play.style.background = '#b91515';
		}),

		mode.btnUse.addEventListener('click', function () {
			mode.btnDev.className = '';
			mode.btnUse.className = 'active';
			mode.isDev = false;
			controler.btn[3].style.visibility = 'hidden';
			controler.play.style.background = '#15b915';
		})
	]

	/**
	 * Edit
	 */
	var edit = {}
	edit.event = [
		// new slider
		document.getElementById('edit-new-slider').addEventListener('click', function () {
			httpGet('superMan.php?request=newSlider');
			slider.refresh();
			document.getElementById('slider').checked = 'true';
		}),

		// new bookmark
		document.getElementById('edit-new-bookmark').addEventListener('click', function () {
			httpGet('superMan.php?request=newBookmark&slider=' + slider.current);
			slider.refresh();
		}),

		// insert new bookmark
		document.getElementById('edit-insert-new-bookmark').addEventListener('click', function () {
			httpGet('superMan.php?request=insertNewBookmark&slider=' + slider.current + '&bookmark=' + bookmark.current);
			slider.refresh();
		}),

		// remove slider
		document.getElementById('edit-delete-slider').addEventListener('click', function () {
			malert.show('Delete slider: ' + slider.index[slider.current].name, function () {
				httpGet('superMan.php?request=removeSlider&id=' + slider.current);
				location.reload();
			});
		}),

		// remove bookmark
		document.getElementById('edit-delete-bookmark').addEventListener('click', function () {
			if (bookmark.slide.slides.length == 1) {
				malert.show('Can\'t delete this bookmark', function () {
					// do nothing
				}, 1);
			} else {
				malert.show('Delete bookmark: ' + bookmark.slide.slides[bookmark.current].title + ' (' + slider.index[slider.current].name + ')', function () {
					httpGet('superMan.php?request=removeBookmark&slider=' + slider.current + '&bookmark=' + bookmark.current);
					location.reload();
				});
			}
		})
	]

	/**
	 * Alert
	 *
	 */
	var malert = {}
	malert.div = document.getElementById('alert');
	malert.btnOk = document.getElementById('alert-ok');
	malert.btnCancel = document.getElementById('alert-cancel');
	malert.message = document.getElementById('alert-message');

	malert.show = function (message, callback, hiddenCancel) {
		if (hiddenCancel === 1) {
			malert.btnCancel.style.visibility = 'hidden';
		} else {
			malert.btnCancel.style.visibility = 'visible';
		}

		malert.message.innerHTML = message;
		malert.div.className = '';
		malert.btnCancel.addEventListener('click', function () {
			malert.div.className = 'hidden';
		});

		malert.btnOk.addEventListener('click', function () {
			malert.div.className = 'hidden';
			callback();
		});
	}

	// Change layout
	var isLayout2 = false;
	document.getElementById('layout').addEventListener('click', function () {
		if (isLayout2) {
			document.getElementById('main').className = '';
			isLayout2 = false;
			document.getElementById('layout').className = '';
		} else {
			document.getElementById('main').className = 'layout-2';
			isLayout2 = true;
			document.getElementById('layout').className = 'changed';
		}
	});

	// INIT
	slider.init();
	controler.selectMode(0);
	// Hidden DES button
	controler.btn[3].style.visibility = 'hidden';
	// Open menu
	menu.open();
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
});

/**
 * Function Defining...
 */

// Send http GET request, blocking, retyrn text response
function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;

}

// Send http POST request, blocking, return text response
function httpPost(url, data)
{
    var http = new XMLHttpRequest();
	http.open("POST", url, false);
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send(data);
	return http.responseText;
}