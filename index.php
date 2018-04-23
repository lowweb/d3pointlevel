<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Прогнозы уровня моря</title>
  <link rel="stylesheet" type="text/css" href="css/main.css">
  <script type="text/javascript" src="js/jquery-3.2.1.min.js"> </script>
  <script type="text/javascript" src="js/d3.v4.min.js"></script>
  <!--script type="text/javascript" src="js/main.js"></script--> 
  <script type="text/javascript" src="js/d3.simple.chart.js"></script> 

</head>
<body>

  
<div id="pointlevelblock">
  
<div id="pointgraph"></div>
<div id="legend"> </div>

<p></p>

<select id="region" onchange=""> 
  <option value="init" disabled selected='selected'>Выберите регион</option>
</select>

<select id="point" onchange=""> 
  <option class="init" value="init" disabled selected='selected'>Выберите район</option>
</select>

<select id="datePeriod" onchange=""> 
  <!--option class="init" value="init"></option-->
</select>

</div>

<script type="text/javascript" src="js/main.js"></script>
</body>
</html>
