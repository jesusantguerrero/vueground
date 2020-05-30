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
      <!-- <el-menu-item> -->
      <div class="profile-caller" v-if="user">
        <span class="mr-2">
          {{ user.name || user.displayName }}
        </span>
        <el-avatar :size="40" :src="user.picture || user.photoUrl"></el-avatar>
        <button
          class="btn btn-danger ml-2"
          @click="$parent.send('LOGOUT')"
          v-if="user"
        >
          <i class="fa fa-power-off"></i>
        </button>
      </div>
      <!-- </el-menu-item> -->
    </el-menu>
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

<style lang="scss">
.profile-caller {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  padding: 15px 50px;
  align-self: center;
  right: 0px;
  color: rgb(255, 255, 255);
  border-bottom-color: transparent;
  background-color: rgb(84, 92, 100);
  margin-left: auto !important;
}
</style>
