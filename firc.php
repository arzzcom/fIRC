<html lang="ko" xmlns:ext="http://www.extjs.com/docs">
<head>
<meta http-equiv="Content-Type" content="text/html" charset="UTF-8" />
<title>에프IRC</title>
<link rel="shortcut icon" href="./favicon.ico" />
<script type="text/javascript" src="./language/ko.lang.js"></script>
<script type="text/javascript" src="./script/extjs.js"></script>
<script type="text/javascript" src="./script/firc.js"></script>
<link rel="stylesheet" href="./css/extjs.css" type="text/css" title="style" />
<link rel="stylesheet" href="./css/firc.css" type="text/css" title="style" />
</head>
<body>

<div id="FooterLayer"></div>
<script type="text/javascript">
new FIRC({
<?php foreach ($_POST as $name=>$value) { if (preg_match('/^obj-/',$name) == true) { ?>
	<?php echo preg_replace('/^obj-/','',$name); ?>:{<?php echo stripslashes($value); ?>},
<?php } else { ?>
	<?php echo $name; ?>:"<?php echo stripslashes($value); ?>",
<?php }} ?>
	makeBy:"www.firc.kr"
});
</script>
</div>

</body>
</html>