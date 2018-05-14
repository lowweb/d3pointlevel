
var idRegion,idPoint,param;

//загрузили регионы запомнили первый
d3.tsv('/data/region.tsv',function(error, dataR) 
  {  
    var fields = dataR;
    for (var i = 0; i < fields.length; i++) {
         if (i==0)
         {
          idRegion=fields[i].id;

         }

        d3.select('#region').append("option")
        .attr("value", fields[i].id)
        .text(fields[i].name);
    }
    
});

//$("#hour").val(1);
//point=$("#hour").val();
//point=idPoint;

function loadParam () {
var param = {
        parentSelector: "#pointgraph",
        width: 1000,
        height: 500,
        title: "",
        xColumn: "Date",
        xAxisName: "Период",
        yLeftAxisName: "Величина",
        series: [
          {yColumn: idPoint+"-1", title: "Прилив", color: "#ff6600", yAxis: "left", name: "one"},
          {yColumn: idPoint+"-2", title: "Непериодическая", color: "#0080ff", yAxis: "left", name: "two"},
          {yColumn: idPoint+"-3", title: "Суммарный уровень", color: "#EF3054", yAxis: "left", name: "three"}
        ]
      };
      return param;
};


param=loadParam();
//console.log ("paramt=" + param.title);

//выгружаем в переменную данные за все время
var originaldata;
//сохранили массив в перменную, занесли в комбобокс даты
d3.tsv("/data/pl.tsv", function(error, data) {
      if (error) throw error;
      DataParse ("Date","%d.%m.%Y %H:%M",[idPoint+"-1",idPoint+"-2",idPoint+"-3"],data);
      //d3sChart(param,data);
       originaldata=data;

      dateFormat = d3.timeFormat("%d.%m.%Y");
      var fields = data,tmpDate;
        for (var i = 0; i < fields.length; i++) {
                if (tmpDate!=dateFormat(fields[i].Date))
                {
                  
                d3.select('#datePeriod').append("option")       
                .attr("class", "dynamic-value")
                .attr("value", dateFormat(fields[i].Date))
                .text(dateFormat(fields[i].Date));

              }
              tmpDate=dateFormat(fields[i].Date);
        }  
     //рисуем график
      // пока убрали отрисовку
     //MakeChart(param,data);            
    });


//загрузили периоды
d3.tsv('/data/periods.tsv',function(error, dataR) 
  {  
    var fields = dataR;
    for (var i = 0; i < fields.length; i++) {
         if (i==0)
         {
          period=fields[i].fileName;

         }

        d3.select('#periods').append("option")
        .attr("value", fields[i].fileName)
        .text(fields[i].periodName);
    }
    

//загружае данный по первому из списка файлов
$("#datePeriod").prop('disabled', true);
d3.tsv("/data/"+period+".tsv", function(error, data) {
      if (error) throw error;
      DataParse ("Date","%d.%m.%Y %H:%M",[idPoint+"-1",idPoint+"-2",idPoint+"-3"],data);

      dateFormat = d3.timeFormat("%d.%m.%Y"); 
     //рисуем график

     MakeChart(param,data);            
    });

});

d3.selectAll("#periods").on("change", changePeriod );

function changePeriod () {
  period=this.value;

d3.select("#pointgraph_chart").remove();
d3.select("#needdata-svg").remove();
    //чистим списки
d3.select("#point").selectAll(".dynamic-value").remove();
d3.select('#point').property('value', 'init');
d3.select('#region').property('value', 'init');
param=loadParam();

  d3.tsv("/data/"+ period +".tsv", function(error, data) {
      if (error) throw error;
      DataParse ("Date","%d.%m.%Y %H:%M",[idPoint+"-1",idPoint+"-2",idPoint+"-3"],data);
      dateFormat = d3.timeFormat("%d.%m.%Y");
      var fields = data,tmpDate;
     //рисуем график
     MakeChart(param,data);            
    });
 }





