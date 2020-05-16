<template>
  <div class="chart-div" ref="chartDiv">

  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import dominicanRepublicMuniHigh from "@amcharts/amcharts4-geodata/dominicanRepublicMuniHigh"
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
export default {
    props: {
        series: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            chart: null,
            seriesData: [],
            isMounted: false
        }
    },

    watch: {
        series: {
            handler(series) {
                if (this.isMounted) {
                    this.initChart()
                }
            },
            deep: true,
            immediate: true
        }
    },

    mounted() {
        this.isMounted = true 
        this.initChart();
    },

    methods: {
     initChart() {
         if (this.series && this.series.timeline) {
            let chart = am4core.create(this.$refs.chartDiv, am4charts.XYChart)
            chart.paddingRight = 20;
            
            this.seriesData = Object.entries(this.series.timeline.cases).map((item) => { return {
                 date: new Date(item[0]),
                 originalDate: item[0],
                 value: item[1]
            }});

            chart.data = this.seriesData;
    
            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.grid.template.location = 0;
    
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.tooltip.disabled = true;
            valueAxis.renderer.minWidth = 35;
    
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.dateX = "date";
            series.dataFields.valueY = "value";
    
            series.tooltipText = "{valueY.value}";
            chart.cursor = new am4charts.XYCursor();
    
            let scrollbarX = new am4charts.XYChartScrollbar();
            scrollbarX.series.push(series);
            chart.scrollbarX = scrollbarX;
    
            this.chart = chart;
         }
     },

     initCountryChart() {
        var chart = am4core.create(this.$refs.map, am4maps.MapChart);
        chart.geodata = dominicanRepublicMuniHigh;
        chart.projection = new am4maps.projections.Miller();
        var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;
        polygonSeries.mapPolygons.template.events.on("hit", function(ev) {
        chart.zoomToMapObject(ev.target);
        });
        var label = chart.chartContainer.createChild(am4core.Label);
        label.text = "Dominican Republic";
        this.country = chart
     }
    },

    beforeDestroy() {
        if (this.chart) {
            this.chart.dispose();
        }
    }
}
</script>

<style>

</style>