<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
body {
  background: #024364;
  color: white;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: white;
    &.router-link-exact-active {
      color: #a10056;
    }
  }
}
</style>
