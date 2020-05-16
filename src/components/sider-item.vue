<template>
  <div class="card item-card">
    <h1 class="numbers">
      {{ number }}
    </h1>
    <p class="text-white">{{ label }}</p>
  </div>
</template>

<script>
export default {
  props: {
    number: Number,
    label: String
  }
};
</script>


<style lang="scss" scoped>
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
  border: 1px solid rgba(255, 255, 255, 0.5);

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
