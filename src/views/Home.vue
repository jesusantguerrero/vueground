<template>
  <div class="container-fluid">
    <div class="home">
      <h3 class="text-center">Estado de Republica Dominicana</h3>
      <covid-main></covid-main>
      <footer class="row text-center d-flex justify-content-center p-5">
        <section class="col-md-4">
          <p>API</p>
          <p>Ministerio de Salud Publica</p>
          <p>Inspirado en:</p>
          <p>
            <a href="https://www.coronacurfew.live/">coronacurfew.live</a>
          </p>
          Code and Design by Jesus Guerrero
        </section>
      </footer>
    </div>
  </div>
</template>

<script>
import CovidMain from "@/components/covid";

export default {
  name: "home",
  components: {
    CovidMain
  }
};
</script>

<style lang="scss" scoped>
footer {
  a {
    color: #ff8392;
  }
  color: white;
}
</style>
