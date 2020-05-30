<template>
  <div class="container-fluid">
    <div class="about">
      <posts-main></posts-main>
    </div>
  </div>
</template>
<script>
import PostsMain from "@/components/posts/";

export default {
  name: "Post",
  components: {
    PostsMain
  }
};
</script>
