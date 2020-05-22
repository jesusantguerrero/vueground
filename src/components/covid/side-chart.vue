<template>
  <div class="">
    <h5 class="text-center">
      <span class="text-gray"> Charts</span>
    </h5>
    <div class="chart-div pt-3" ref="chartDiv"></div>
  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import dominicanRepublicMuniHigh from "@amcharts/amcharts4-geodata/dominicanRepublicMuniHigh";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);

export default {
  props: {
    series: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      chart: null,
      seriesData: [],
      isMounted: false
    };
  },

  watch: {
    series: {
      handler() {
        if (this.isMounted) {
          this.initChart();
        }
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    this.isMounted = true;
    this.initChart();
  },

  methods: {
    initChart() {
      const mySeries = {
        deaths: {
          label: "Muertes",
          color: "#024364"
        },
        recovered: {
          color: "#007BFE",
          label: "Recuperados"
        },
        cases: {
          color: "#eb4d6c",
          label: "Casos Confirmados"
        }
      };
      if (this.series && this.series.timeline) {
        let chart = am4core.create(this.$refs.chartDiv, am4charts.XYChart);
        chart.paddingRight = 20;
        this.seriesData = [];

        const keys = Object.keys(this.series.timeline);
        keys.forEach(name => {
          const serie = Object.entries(this.series.timeline[name]).map(item => {
            return {
              [`${name}Date`]: new Date(item[0]),
              [`${name}Original`]: item[0],
              [`${name}Value`]: item[1]
            };
          });

          this.seriesData.push(...serie);
        });

        chart.data = this.seriesData;

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        keys.forEach(name => {
          let series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.dateX = `${name}Date`;
          series.dataFields.valueY = `${name}Value`;
          series.tooltipText = `${mySeries[name].label}: {valueY.value}`;
          series.stroke = am4core.color(mySeries[name].color);
          series.fill = am4core.color(mySeries[name].color);
          series.strokeWidth = 4;
        });
        chart.dateFormatter.dateFormat = "dd MM yyyy";
        chart.cursor = new am4charts.XYCursor();

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
      this.country = chart;
    }
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<style lang="scss" scoped>
.chart-div {
  margin-top: 12px;
  border-radius: 4px;
  max-height: 500px;
  padding-top: 15px;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
}
</style>
