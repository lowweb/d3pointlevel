
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

//загрузили точки запомнили первый
//убрал тк сначала точки пустые
  /*  d3.tsv('/data/Reference_Sea_Level.tsv',function(error, dataP) 
    {  
        //dataR.filter(function(d) { return d.idregion == 9 })
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
    */

//$("#hour").val(1);
//point=$("#hour").val();
//point=idPoint;

function loadParam () {
var param = {
        parentSelector: "#pointgraph",
        width: 1000,
        height: 500,
        title: "Прогнозы",
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
d3.tsv("/data/sample2.tsv", function(error, data) {
      if (error) throw error;
      d3sPreParceDann("Date","%d.%m.%Y %H:%M",[idPoint+"-1",idPoint+"-2",idPoint+"-3"],data);
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
    });

//падаем параметры прорисовываем
d3.tsv("/data/sample2.tsv", function(error, data) {
      if (error) throw error;
      d3sPreParceDann("Date","%d.%m.%Y %H:%M",[idPoint+"-1",idPoint+"-2",idPoint+"-3"],data);
      d3sChart(param,data);    
    });




