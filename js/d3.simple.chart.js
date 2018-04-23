
function d3sChart (param,data,dataGroup){

  var selectedObj = null;
  selectedObj = d3.select(param.parentSelector);

  if (param.width == 0) {param.width = parseInt(selectedObj.style('width'), 10);};
  if (param.height == 0) {param.height = parseInt(selectedObj.style('height'), 10);};

  var margin = param.margin || {top: 30, right: 40, bottom: 75, left: 50},
      width = param.width - margin.left - margin.right,
      height = param.height - margin.top - margin.bottom;

  //определяем скейл
  var xScale = d3.scaleTime().range([0, width]);

  var xScaleGrid = d3.scaleTime().range([0, width]);
  var yScaleLeft = d3.scaleLinear().range([height, 0]);
  var  yScaleLeftGrid = d3.scaleLinear().range([height, 0]);

  var xMin=d3.min(data, function(d) { return d[param.xColumn]; }),
      xMax=d3.max(data, function(d) { return d[param.xColumn]; }),
      yLeftMax=0, yLeftMin=0;

  //определяем максимум по y, ушли от функции d3 тк были не точности
  for (var j = 0, len1 = param.series.length; j < len1; j += 1) {
    tmpVal = d3.max(data, function(d) { return d[param.series[j].yColumn]; });
    if (param.series[j].yAxis == "left"){
      if (tmpVal>yLeftMax) {yLeftMax = tmpVal};
    };
  };
  //определяем минимум по y
    for (var j = 0, len1 = param.series.length; j < len1; j += 1) {
    tmpVal = d3.min(data, function(d) { return d[param.series[j].yColumn]; });
    if (param.series[j].yAxis == "left"){
      if (tmpVal<yLeftMin) {yLeftMin = tmpVal};
    };
  };

  xScale.domain([xMin,xMax]);
  xScaleGrid.domain([xMin,xMax]);
  yScaleLeft.domain([yLeftMin+(yLeftMin/2),yLeftMax]);
  yScaleLeftGrid.domain([yLeftMin+(yLeftMin/2),yLeftMax]);


    var xAxis = d3.axisBottom(xScale)
                .ticks(d3.timeDay,1).tickFormat(d3.timeFormat("%d.%m.%Y"))
                .tickSize(17);
    //посчитали количество нужных нам тиков исходя из ширины и периода времени
    var tickCount=Math.round(((xMax-xMin)/1000/60/60)/(width/24));
    if (tickCount<1) {tickCount=1};


    var hourNameFormat = d3.timeFormat("%H");
    var xAxis2 = d3.axisBottom(xScale)
                .ticks(d3.timeHour,tickCount).tickFormat(function(d) { var a = hourNameFormat(d); if (a == "00") {a = ""}; return a;})
                .tickSize(3);
    var xAxisGrid = d3.axisBottom(xScaleGrid)
                .ticks(d3.timeHour,tickCount).tickFormat(function(d) { var a = hourNameFormat(d); if (a == "00") {a = ""}; return a;})
                .tickSize(2);

  
  var yAxisLeft = d3.axisLeft(yScaleLeft);
  var yAxisLeftGrid = d3.axisLeft(yScaleLeftGrid);
 

  var svg = selectedObj.append("svg")
      .attr("width", param.width).attr("height", param.height)
      .attr("id", param.parentSelector.substr(1)+"_chart");

  // внешняя рамка
  svg.append("rect").attr("width", param.width).attr("height", param.height)
                    .style("fill", "none").style("stroke", "#ccc");

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                          .attr("class", "mainplain");

  //Заголовок и название осей
  g.append("text").attr("x", margin.left) .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle").style("font-size", "14px") 
        .text(param.title);
  g.append("text").attr("x", width-43).attr("dx", 40) .attr("y", height+30 )
        .attr("text-anchor", "end") 
        .text(param.xAxisName)
        .style("font-weight","bold");
  g.append("text").attr("transform", "rotate(-90)")
        .attr("x", 0) .attr("y", -70).attr("dy", 40)
        .attr("text-anchor", "end") 
        .text(param.yLeftAxisName)
        .style("font-weight","bold");


  //сами оси
  g.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")")
   .call(xAxis);
  g.append("g").attr("class", "x axis2").attr("transform", "translate(0," + height + ")")
   .call(xAxis2);
  g.append("g").attr("class", "y axis")
   .call(yAxisLeft);

//делаем сетку вертикальную
   g.append("g")         
    .attr("class", "gridx")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisGrid
    .tickSize(-height, 0, 0)
    .tickFormat("")); 
    //горизонтальная разметка
    g.append("g")         
     .attr("class", "gridy")
     .call(yAxisLeftGrid
     .tickSize(-width, 0, 0)
     .tickFormat(""));


// подсказки
var tooltipdiv = selectedObj.append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);
var tipTimeFormat = d3.timeFormat("%d.%m.%Y %H:%M"); 




   for (var j = 0, len1 = param.series.length; j < len1; j += 1) {

     var line = d3.line()
                  .curve(d3.curveCardinal)
                  .x(function(data) { return xScale(data[param.xColumn]); })
                  .y(function(data) { return yScaleLeft(data[param.series[j].yColumn]); });

      g.append("path").datum(data)
        .attr("class", "line-" +param.series[j].name)
        .attr("d", line)
        .style("stroke", param.series[j].color);

  // подсказки
      g.selectAll("dot").data(data)
         .enter().append("circle")
         .attr("class", "circle-" +param.series[j].name)
         .attr("r", 3)
         .attr("cx", function(d) { return xScale(d.Date); })
         .attr("cy", function(d) { return yScaleLeft(d[param.series[j].yColumn]); })
          //.style ("fill-opacity","1")
          .style ("fill",function(d) {return param.series[j].color; }) 
          //.style ("stroke-width","2px")
          //.style ("stroke",function(d) {return param.series[j].color; })    
          .on("mouseover", function(d) {
            tooltipdiv.transition()
                      .duration(200)
                      .style("opacity", .9);
            tooltipdiv .html(tipTimeFormat(d.Date) +   "<br/>"  + "0")     
                       .style("left", (d3.event.pageX) + "px")             
                       .style("top", (d3.event.pageY - 28) + "px");
            })       
          .on("mouseout", function(d) {   
            tooltipdiv.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });
};    


  //легенда 
  var legend = svg.append("g").attr("class", "legend").attr("height", 40).attr("width", 200)
    .attr("transform",(param.title == "") ? "translate(20,20)" : "translate("+(param.width/2 - 150)+","+(param.height-10)+")");   
     
  legend.selectAll('rect').data(param.series).enter()
      .append("circle")
       .attr ("class", function(d) {return "legend-" + d.name; })
      .attr("cy", 0 - (margin.bottom / 4))
      .attr("cx", function(d, i){ return i *  130;})
      .attr("r", "7")
      .style ("fill",function(d) {return d.color; })
      .on("mouseover", function(d) {
            //d3.select(this).style("fill", "red"); 
            d3.select(this).style ("fill-opacity","1")
              .attr("r", "5")
              .style ("stroke-width","3%")
              .style ("stroke",function(d) {return d.color; })
              .style ("stroke-opacity","0.3")
               .style ("transition","500ms");  
            })   
          .on("mouseout", function(d) {   
            //d3.select(this).style ("fill","red"); 
            d3.select(this)
            .attr("r", "7")
            .style ("fill-opacity","1")
            .style ("stroke-width","0px");

        });

      //.style ("fill-opacity","0")
      //.style ("stroke-width","5px")
      //.style ("stroke",function(d) {return d.color; });
 
    legend.selectAll('text').data(param.series).enter()
      .append("text").attr("y", 0 - (margin.bottom / 4)+5).attr("x", function(d, i){ return i *  130 + 12;})
      .text(function(d) { return d.title; });

$( ".legend-one" ).click(function() {

  if ($('.line-one').css('display') != 'none'){
  d3.selectAll(".line-one").style ("display","none");
  d3.selectAll(".circle-one").style ("display","none");
}
else
{
  d3.selectAll(".line-one").style ("display","block");
  d3.selectAll(".circle-one").style ("display","block"); 
}
});
     
//обработчик комбобоксов
d3.selectAll("#region").on("change", changeRegion);
d3.selectAll("#point").on("change", changePoint);
d3.selectAll("#datePeriod").on("change", changeDate);



function changePoint() {
  inputPoint  = this.value;
//подменили в параметрах название колнки точки которой выбрали 1-1 1-2 1-
//дабы не вызывать полностью блок параметров
  for (var j = 0, len1 = param.series.length; j < len1; j += 1) {
   param.series[j].yColumn=inputPoint + "-" +(j+1);
  };
  var dynamic = svg.transition().duration(550);
  var dynamictip = g.transition().duration(550);

   //определяем минимум максимум по y
  for (var j = 0, len1 = param.series.length; j < len1; j += 1) {
      var tmpMaxVl, maxVl=data[0][param.series[j].yColumn];
      data.forEach (function(d){
        d[param.series[j].yColumn]=+d[param.series[j].yColumn]
        tmpMaxVl=d[param.series[j].yColumn];
        if (tmpMaxVl > maxVl) {
          maxVl=tmpMaxVl;
        }
     });
      if (j==0) yLeftMax=maxVl;
      if (maxVl>yLeftMax)
        yLeftMax=maxVl;
  };

  //определяем минимум по y
  for (var j = 0, len1 = param.series.length; j < len1; j += 1) {
      var tmpMinvl, minVl=data[0][param.series[j].yColumn];
      data.forEach (function(d){
        d[param.series[j].yColumn]=+d[param.series[j].yColumn]
        tmpMinvl=d[param.series[j].yColumn];
        if (tmpMinvl < minVl) {
          minVl=tmpMinvl;
        }
     });
      if (j==0) yLeftMin=minVl;
      if (minVl<yLeftMin)
        yLeftMin=minVl;
  };

//зануляем максимум минимум когда выбрали регион а список точек пуст, это дает нулевую линию
    if ($("#point").val()==null) {
      yLeftMin=0;
      yLeftMax=0;
    };

    yScaleLeft.domain([yLeftMin+(yLeftMin/2),yLeftMax]);
    yScaleLeftGrid.domain([yLeftMin+(yLeftMin/2),yLeftMax]);

    dynamic.selectAll(".y.axis").call(yAxisLeft); 
    dynamic.selectAll(".gridy").call(yAxisLeftGrid);


    for (var j = 0, len1 = param.series.length; j < len1; j += 1) {
      line = d3.line()
        .curve(d3.curveCardinal)
        .x(function(data) { return xScale(data[param.xColumn]); })
        .y(function(data) { return yScaleLeft(data[param.series[j].yColumn]); });

        dynamic.select(".line-" +param.series[j].name).attr("d", line);
        //вырисовываем точки на графиках
        dynamic.selectAll(".circle-" +param.series[j].name)
               .attr("r", 3)
               .attr("cx", function(d) { return xScale(d.Date); })
               .attr("cy", function(d) { return yScaleLeft(d[param.series[j].yColumn]); })
               //.style ("fill-opacity","0")
               .style ("fill",function(d) {return param.series[j].color; }); 
              //.style ("stroke-width","2px")
              //.style ("stroke",function(d) {return param.series[j].color; }) 

        g.selectAll(".circle-" +param.series[j].name)
         .on("mouseover", function(d) {
         //переменная для определения в какой графике щелнули
         var graphicNum;
         if ($(this).attr("class")=="circle-one") graphicNum="-1";
         if ($(this).attr("class")=="circle-two") graphicNum="-2";
         if ($(this).attr("class")=="circle-three") graphicNum="-3";
         tooltipdiv.transition()
                   .duration(200)
                   .style("opacity", .9);
         tooltipdiv .html(tipTimeFormat(d.Date) +   "<br/>"  + d[inputPoint+graphicNum])     
                    .style("left", (d3.event.pageX) + "px")             
                    .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {   
            tooltipdiv.transition()    
                      .duration(500)    
                      .style("opacity", 0); 
           });
 
     

    };


};//change point


function changeDate() {
  var parse = d3.timeParse('%d.%m.%Y');
  idPoint=$("#point").val();
  mindate =  parse(this.value);
  var delay = function(d, i) { return i * 50; };
  var dynamic = svg.transition().duration(550);
  var transremove = svg.transition().duration(750); 
  var dynamictip = g.transition().duration(550);

//фильтруем датасет от выбраной даты в комбобоксе
  var datafilter = data.filter(function (d) {
      return d.Date >= mindate;
         });
  data=datafilter;

  xMin=d3.min(data, function(d) { return d[param.xColumn]; });
  xMax=d3.max(data, function(d) { return d[param.xColumn]; });

  xScale.domain([xMin,xMax]);
  xScaleGrid.domain([xMin,xMax]);
  

//пересчитали тики
   tickCount=Math.round(((xMax-xMin)/1000/60/60)/(width/24));
   if (tickCount<1) {tickCount=1};
 //пересоздали оси  
   xAxis2 = d3.axisBottom(xScale)
                .ticks(d3.timeHour,tickCount).tickFormat(function(d) { var a = hourNameFormat(d); if (a == "00") {a = ""}; return a;})
                .tickSize(3);
   xAxisGrid = d3.axisBottom(xScaleGrid)
                .ticks(d3.timeHour,tickCount).tickFormat(function(d) { var a = hourNameFormat(d); if (a == "00") {a = ""}; return a;})
                .tickSize(3);

//перерисовываем оси и сетку
  dynamic.selectAll(".x.axis").call(xAxis);
  dynamic.selectAll(".x.axis2").call(xAxis2);
  dynamic.selectAll(".gridx").call(xAxisGrid
                             .tickSize(-height, 0, 0)
                             .tickFormat("")); 
//получили новые точки

//удалили все линии
    for (var j = 0, len1 = param.series.length; j < len1; j += 1) {
      line = d3.line()
         .curve(d3.curveCardinal)
         .x(function(data) { return xScale(data[param.xColumn]); })
         .y(function(data) { return yScaleLeft(data[param.series[j].yColumn]); });

        transremove.selectAll(".line-"+param.series[j].name)
        .style ("opacity","0")
        .remove ()
        delay(delay);

        transremove.selectAll(".circle-" +param.series[j].name)
        .style ("opacity","0")
        .remove ()
        delay(delay);

      //прорисовываем
        g.append("path")
         .datum(data)
         .attr("class", "line-"+param.series[j].name)
         .attr("d", line)
         .style("stroke", param.series[j].color);

         //убрали из за дубляжа выше
        /*dynamic.selectAll(".line-"+param.series[j].name)
          .attr("d", line)
          .style("stroke", param.series[j].color)
          .delay(delay);*/

        //вырисовываем точки на графиках

        //дописать создание точек
        g.selectAll("dot").data(data)
         .enter().append("circle")
         .attr("class", "circle-" +param.series[j].name)
         .attr("r", 3)
         .attr("cx", function(d) { return xScale(d.Date); })
         .attr("cy", function(d) { return yScaleLeft(d[param.series[j].yColumn]); })
          .style ("fill-opacity","0")
          .style ("stroke-width","2px")
          .style ("stroke",function(d) {return param.series[j].color; })    
         .on("mouseover", function(d) {
         //переменная для определения в какой графике щелнули
         var graphicNum;
         if ($(this).attr("class")=="circle-one") graphicNum="-1";
         if ($(this).attr("class")=="circle-two") graphicNum="-2";
         if ($(this).attr("class")=="circle-three") graphicNum="-3";
         tooltipdiv.transition()
                   .duration(200)
                   .style("opacity", .9);
         tooltipdiv .html(tipTimeFormat(d.Date) +   "<br/>"  + d[inputPoint+graphicNum])     
                    .style("left", (d3.event.pageX) + "px")             
                    .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {   
            tooltipdiv.transition()    
                      .duration(500)    
                      .style("opacity", 0); 
           });


    };
  //востановили первоначальный дадасет от самого минимума о максимума
  data=originaldata;


 }//change data


function changeRegion () {

    //чистим списки
    d3.select("#point").selectAll(".dynamic-value").remove();
    d3.select('#point').property('value', 'init');

    idRegion=this.value;
    d3.tsv('/data/Reference_Sea_Level.tsv',function(error, dataP) 
    {  
        var fields = dataP;
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].idregion==idRegion)
            {
              if (i==0)
              {
                idPoint=fields[i].pointid;
              }
                d3.select('#point').append("option")            
                .attr("class", "dynamic-value")
                .attr("value", fields[i].pointid)
                .text(fields[i].name);
            }
        } 

    });
//нужно для зануления графиков    
changePoint();
}

};


//парсим колонки 
function d3sPreParceDann(dateColumn,dateFormat,usedNumColumns,data){
  var parse = d3.timeParse(dateFormat);
  var format = d3.timeFormat (dateFormat);
  data.forEach(function(d) { 
    d[dateColumn] = parse(d[dateColumn]);

    //дописать парсер относительно всех колонок, по сути числа не парсятся
    for (var i = 0, len = usedNumColumns.length; i < len; i += 1) {
      d[usedNumColumns[i]] = +d[usedNumColumns[i]];
    }
  }); 
};


