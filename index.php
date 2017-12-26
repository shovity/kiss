<?php
include 'particals/modules.php';
include 'particals/menu.php';
echo '<div id="main"><div id="description"></div>';
include 'particals/codeeditor.php';
echo '<div id="result"><iframe id="iresult" src="particals/result.php"></iframe></div></div>';
include 'particals/alert.php';
// Clear buffer
file_put_contents('buffer.json', '{"html":"","css":"","js":""}');
