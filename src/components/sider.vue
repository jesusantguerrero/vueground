<template>
  <div>
    <h5 class="text-center">
      <span class="text-gray">Actualizacion: </span> {{ updated }}
    </h5>
    <div class="row">
      <!-- Cases -->
      <div class="col-md-12">
        <sider-item :number="formData.cases" label="Confirmados" />
      </div>

      <!-- Deaths -->
      <div class="col-md-6">
        <sider-item :number="formData.deaths" label="Muertes" class="small" />
      </div>

      <!-- Deaths per M -->
      <div class="col-md-6">
        <sider-item :number="formData.deathsPerOneMillion" label="Muertes x 1M" class="small" />
      </div>

      <!-- Recovered -->
      <div class="col-md-6">
        <sider-item
          :number="formData.recovered"
          label="Recuperados"
          class="small"
        />
      </div>

      <!-- Active Cases -->
      <div class="col-md-6">
        <sider-item :number="formData.active" label="Activos" class="small" />
      </div>

      <!-- Critical Cases -->
      <div class="col-md-6">
        <sider-item
          :number="formData.critical"
          label="Criticos"
          class="small"
        />
      </div>
      
      <!-- Number of Tests -->
      <div class="col-md-6">
        <sider-item :number="formData.tests" label="Pruebas" class="small" />
      </div>

    </div>
  </div>
</template>

<script>
import SiderItem from "./sider-item.vue";

export default {
  components: {
    SiderItem
  },
  props: {
    formData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    updated() {
      const time  = this.formData ? this.formData.updated : '';
      return new Date().toISOString().slice(0, 10);
    }
  }
};
</script>
