<?php 
	$buffer = file_get_contents('../buffer.json');
	$buffer = json_decode($buffer);
?>
<!DOCTYPE html>
<html>
<head>
	<title></title>
	<style type="text/css">
		<?php echo $buffer->css ?>
	</style>
</head>
<body>
	<?php echo $buffer->html ?>
	<script>
		<?php echo $buffer->js ?>
	</script>
</body>
</html>