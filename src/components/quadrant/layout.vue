<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1">IC Quadrant</el-menu-item>
      <el-submenu index="2" v-if="user">
        <template slot="title">Workspace</template>
        <el-menu-item index="2-1">item one</el-menu-item>
        <el-menu-item index="2-2">item two</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">item four</template>
          <el-menu-item index="2-4-1">item one</el-menu-item>
          <el-menu-item index="2-4-2">item two</el-menu-item>
          <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3" disabled v-if="user">Info</el-menu-item>
      <el-menu-item index="4" v-if="user"
        ><a href="https://www.ele.me" target="_blank">Orders</a></el-menu-item
      >
    </el-menu>

    <button @click="$parent.send('LOGOUT')" v-if="user">Logout</button>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: [Object],
      default: null
    }
  },
  data() {
    return {
      activeIndex: ""
    };
  },
  methods: {
    handleSelect() {}
  }
};
</script>

<style></style>
