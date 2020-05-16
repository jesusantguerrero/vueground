<template>
  <div class="pt-5 covid-dashboard p-5">
    <div
      v-if="matches('loading')"
      class="d-flex justify-content-center align-item-center"
    >
      <i class="fa fa-spinner fa-spin bigger"></i>
    </div>

    <div class="row" v-else>
      <!-- stats -->
      <div class="col-md-4">
        <app-sider :form-data="postService.state.context.posts"></app-sider>
      </div>

      <!-- States info -->
      <div class="col-md-8">
        <side-chart
          :series="postService.state.context.posts"
          style="width: 100%; height: 500px"
        />
      </div>


      <!-- Country Graph -->
      <div class="col-md-8 pb-5 mb-5 pt-5 mt-5">
        <h4 class="text-center">
          Casos en {{ selectedProvince || "Todo el territorio" }}
        </h4>
        <rd class="mt-5" @selected="selectedProvince = $event"></rd>
      </div>

      <div class="col-md-4 pb-5 mb-5 pt-5 mt-5">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <td>Porvincia</td>
                <td>Casos</td>
                <td>Fallecidos</td>
                <td>Recuperados</td>
              </tr>
            </thead>
            <tbody>
              <tr
                :class="{
                  selected: isSelectedProvince(province)
                }"
                v-for="province in selectedProvinceData"
                :key="province.TOPONIMIA"
              >
                <td>{{ province.TOPONIMIA }}</td>
                <td>{{ province.NumeroCaso }}</td>
                <td>{{ province.NumeroFall }}</td>
                <td>{{ province.numero_rec }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Caller -->
    </div>
  </div>
</template>

<script>
import { createMachine, interpret, assign } from "xstate";
import SideChart from "./side-chart.vue";
import AppSider from "./sider.vue";
import SiderItem from "./sider-item";
import Rd from "./rd-map.vue";

export default {
  name: "PostsMachine",
  props: {
    msg: String
  },
  components: {
    AppSider,
    SideChart,
    SiderItem,
    Rd
  },
  data() {
    return {
      postService: null,
      state: null,
      selectedProvince: "",
      byStateEndpoint:
        "https://services5.arcgis.com/vzuQ2GBv7eL3S9SR/arcgis/rest/services/capa_p%C3%BAblica_Densidad_poblacional_por_Provincia_(Poligonos)/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=102100&resultOffset=0&resultRecordCount=50&resultType=standard&cacheHint=true",
      historicalEndpoint:
        "https://corona.lmao.ninja/v2/historical/dominican%20republic",
      postApiEndpint:
        "https://corona.lmao.ninja/v2/countries/dominican%20republic?yesterday=true&strict=true"
    };
  },
  created() {
    const postMachine = createMachine({
      id: "goblog",
      initial: "idle",
      context: {
        posts: null,
        series: null
      },
      states: {
        idle: {
          on: { FETCH: "loading" }
        },
        loading: {
          invoke: {
            id: "fetchPosts",
            src: () => this.fetchData(),
            onDone: {
              target: "loaded",
              actions: assign({
                posts: (context, event) => event.data
              })
            },
            onError: "fail"
          },
          on: { CANCEL: "idle" }
        },
        loaded: {
          on: { FETCH: "loading" }
        },
        fail: {
          on: { FETCH: "loading" }
        }
      }
    });

    const postService = interpret(postMachine)
      .onTransition(state => {
        this.state = state.value;
        console.log(this.postService);
      })
      .start();
    this.postService = postService;
    this.send("FETCH");
  },

  computed: {
    selectedProvinceData() {
      if (this.postService.state.context.posts.byState) {
        return Object.values(this.postService.state.context.posts.byState);
      } else {
        return [];
      }
    }
  },
  methods: {
    matches(stateName) {
      return this.postService.state.matches(stateName);
    },

    send(actionName) {
      this.postService.send(actionName);
    },

    async fetchData() {
      const data = await fetch(this.postApiEndpint).then(data => data.json());
      const byState = await fetch(this.byStateEndpoint).then(data =>
        data.json()
      );
      const series = await fetch(this.historicalEndpoint).then(data =>
        data.json()
      );

      const province = {};

      byState.features.forEach(state => {
        province[state.attributes.TOPONIMIA.toLowerCase()] = state.attributes;
      });

      return {
        ...data,
        timeline: series.timeline,
        byState: province
      };
    },

    isSelectedProvince(province) {
      return (
        this.selectedProvince &&
        this.selectedProvince.toLowerCase() == province.TOPONIMIA.toLowerCase()
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.covid-dashboard table {
  color: white;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.selected {
  color: dodgerblue;
}

img {
  width: 100%;
  height: 100%;
}

.land:hover {
  fill: #024364;
  fill-opacity: 1;
  stroke: #eb4d6c;
  stroke-opacity: 1;
  stroke-width: 1;
}

.bigger {
  font-size: 50px;
}
</style>
