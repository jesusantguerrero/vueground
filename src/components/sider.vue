<template>
  <div>
    <h5 class="text-center">
      <span class="text-gray">Actualizacion: </span> {{ updated }}
    </h5>
    <div class="row">
      <div class="col-md-12">
        <div class="card item-card">
          <h1
            class="numbers
          "
          >
            {{ formData.cases }}
          </h1>
          <p class="text-white">Confirmados</p>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card item-card small">
          <h1 class="numbers">
            {{ formData.deaths }}
          </h1>
          <p class="text-white">Muertes</p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card item-card small">
          <h1 class="numbers">
            {{ formData.deathsPerOneMillion }}
          </h1>
          <p class="text-white">Muertes x 1m</p>
        </div>
      </div>
      <div class="col-md-6">
        <sider-item
          :number="formData.recovered"
          label="Recuperados"
          class="small"
        />
      </div>
      <div class="col-md-6">
        <sider-item :number="formData.active" label="Activos" class="small" />
      </div>
      <div class="col-md-6">
        <sider-item
          :number="formData.critical"
          label="Criticos"
          class="small"
        />
      </div>
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

<style lang="scss">
.item-card {
  background: rgba(255, 255, 255, 0.2);
  color: #eb4d6c;
  height: 170px;
  font-size: 20px;
  margin: 5px 0;
  display: flex;
  padding: 15px 0;
  justify-content: center;
  align-items: center;

  .numbers {
    font-size: 6rem;
    font-weight: bolder !important;
  }

  &.small {
    height: 100px;
    .numbers {
      font-size: 3rem;
      font-weight: bolder !important;
    }
  }
}
</style>
