<?php
/**
 * KISS APIs
 */

// service post request
if (isset($_POST["request"])) {
	$request = $_POST["request"];

	switch ($request) {
		case 'saveBuffer':
			if (isset($_POST['buffer'])) {
				// wite to file result.php
				file_put_contents('buffer.json', $_POST['buffer']);
				echo 'Buffer saved';
			} else {
				echo 'Eorror: Lost buffer post param';
			}
			break;

		case 'saveConfig':
			if (isset($_POST['config'])) {
				// wite to file result.php
				file_put_contents('config.json', $_POST['config']);
				echo 'Config saved';
			} else {
				echo 'Eorror: Lost config post param';
			}
			break;

		case 'saveSlide':
			if (isset($_POST['slider']) && isset($_POST['bookmark']) && isset($_POST['buffer'])) {
				$slider = $_POST['slider'];
				$bookmark = $_POST['bookmark'];
				$buffer = $_POST['buffer'];
				$buffer = json_decode($buffer);
				$paths = array_values(array_diff(scandir('slides'), ['.', '..', 'index.json']));
				$data = json_decode(file_get_contents('slides/' . $paths[$slider]));
				preg_match('/\<\!\-\-sliderName\:(.+)\-\-\>/', $buffer->description, $result);
				if (isset($result[1]) && $bookmark == 0) {
					$data->name = $result[1];
				}

				preg_match('/\<\!\-\-bookmarkName\:(.+)\-\-\>/', $buffer->description, $result);
				if (isset($result[1])) {
					$buffer->title = $result[1];
				}
				
				
				$data->slides[$bookmark] = $buffer;
				file_put_contents('slides/' . $paths[$slider], json_encode($data));
				echo 'Slide saved';
			} else {
				echo 'Missing some param!';
			}

			break;
		
		default:
			// Request not match
			echo 'Your post requset not found';
			break;
	}

// Service get request
} else if (isset($_GET['request'])) {
	$request = $_GET['request'];

	switch ($request) {
		case 'getConfig':
			echo file_get_contents('config.json');
			break;

		case 'getBuffer':
			echo file_get_contents('buffer.json');
			break;

		case 'getBufferHtml':
			echo json_decode(file_get_contents('buffer.json'))->html;
			break;

		case 'getBufferCss':
			echo json_decode(file_get_contents('buffer.json'))->css;
			break;

		case 'getBufferJs':
			echo json_decode(file_get_contents('buffer.json'))->js;
			break;

		case 'shell':
			echo shell_exec($_GET['cmd']);
			break;

		case 'getSliderIndex':
			$paths = array_values(array_diff(scandir('slides'), ['.', '..', 'index.json']));
			for ($i = 0, $l = count($paths); $i < $l; $i++) {
				$index[$i] = new stdClass();
				$index[$i]->name = json_decode(file_get_contents('slides/' . $paths[$i]))->name;
				$index[$i]->uri = $paths[$i];
			}
			if (count($paths) != 0) {
				echo json_encode($index);
			} else {
				echo '0';
			}
			break;

		case 'getSlide':
			if (!isset($_GET['id'])) {
				echo "Lost id get param";
			} else {
				$dir = scandir('slides');
				$paths = array_values(array_diff($dir, ['.', '..', 'index.json']));
				if (count($paths) == 0) {
					echo '0';
				} else {
					echo file_get_contents('slides/' . $paths[$_GET['id']]);
				}
			}
			break;

		case 'newSlider':
			$dir = scandir('slides');
			$paths = array_values(array_diff($dir, ['.', '..', 'index.json']));
			$length = count($paths);
			// Fix name
			for ($i = 0; $i < $length; $i++) {
				rename('slides/' . $paths[$i], 'slides/' . $i . '.json');
			}
			// Create new slider
			file_put_contents("slides/$length.json", '{"name":"New slider","slides":[{"title":"Bookmark 1","html":"","css":"","js":"","description":"<!--sliderName:New slider-->\n<!--bookmarkName:Bookmark 1-->"}]}');
			break;
		
		case 'removeSlider':
			$dir = scandir('slides');
			$paths = array_values(array_diff($dir, ['.', '..', 'index.json']));
			$length = count($paths);
			// Fix name
			for ($i = 0; $i < $length; $i++) {
				rename('slides/' . $paths[$i], 'slides/' . $i . '.json');
			}
			// remove slider
			unlink('slides/' . $_GET['id'] . '.json');

			// Fix name
			$dir = scandir('slides');
			$paths = array_values(array_diff($dir, ['.', '..', 'index.json']));
			$length = count($paths);
			for ($i = 0; $i < $length; $i++) {
				rename('slides/' . $paths[$i], 'slides/' . $i . '.json');
			}
			break;

		case 'newBookmark':
			$slider = file_get_contents('slides/' . $_GET['slider'] . '.json');
			$slider = json_decode($slider);
			$slider->slides[] = json_decode('{"title":"New bookmark","html":"","css":"","js":"","description":"<!--bookmarkName:new bookmark-->"}');
			file_put_contents('slides/' . $_GET['slider'] . '.json', json_encode($slider));
			break;

		case 'removeBookmark':
			$slider = json_decode(file_get_contents('slides/' . $_GET['slider'] . '.json'));
			unset($slider->slides[$_GET['bookmark']]);
			$slider->slides = array_values($slider->slides);
			file_put_contents('slides/' . $_GET['slider'] . '.json', json_encode($slider));
			break;

		case 'insertNewBookmark':
			$slider = file_get_contents('slides/' . $_GET['slider'] . '.json');
			$slider = json_decode($slider);

			for ($i = count($slider->slides); $i > $_GET['bookmark']; $i--) {
				$slider->slides[$i] = $slider->slides[$i-1];
			}

			$slider->slides[$_GET['bookmark']] = json_decode('{"title":"New bookmark","html":"","css":"","js":"","description":"<!--bookmarkName:new bookmark-->"}');
			file_put_contents('slides/' . $_GET['slider'] . '.json', json_encode($slider));

			break;
		
		default:
			// Request not match
		echo 'Your get request not found';
			break;
	}
} else {
	echo 'Request invalid';
}