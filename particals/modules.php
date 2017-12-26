<?php
	$config = json_decode(file_get_contents('config.json'));
?>
<!-- CODEMIRROR MODULES -->
<script src="modules/lib/codemirror.js"></script>
<!-- codemirror css -->
<link rel="stylesheet" href="modules/lib/codemirror.css">
<!-- codemirror theme -->
<link rel="stylesheet" href="modules/theme/<?php echo $config->editor->theme ?>.css-hint">
<!-- codermirror mode -->
<script src="modules/mode/xml/xml.js"></script>
<script src="modules/mode/javascript/javascript.js"></script>
<script src="modules/mode/css/css.js"></script>
<script src="modules/mode/vbscript/vbscript.js"></script>
<script src="modules/mode/htmlmixed/htmlmixed.js"></script>
<!-- codemirror addon -->
<link rel="stylesheet" href="modules/addon/hint/show-hint.css">
<script src="modules/addon/hint/show-hint.js"></script>
<script src="modules/addon/hint/css-hint.js"></script>
<script src="modules/addon/hint/javascript-hint.js"></script>
<script src="modules/addon/hint/html-hint.js"></script>


<!-- MY MODULES -->
<link rel="stylesheet" type="text/css" href="css/app.css">
<script src="js/app.js"></script>
<title><?php $config->name ?></title>
