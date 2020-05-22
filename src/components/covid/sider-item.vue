<template>
  <div class="card item-card">
    <h1 class="numbers text-white">
      {{ formattedNumber }}
    </h1>
    <p class="">{{ label }}</p>
  </div>
</template>

<script>
export default {
  props: {
    number: Number,
    label: String
  },
  computed: {
    formattedNumber() {
      try {
        return Intl.NumberFormat().format(this.number);
      } catch (e) {
        return this.number;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.item-card {
  background: rgba(255, 255, 255, 0.2);
  color: #FF8392;
  font-weight: bolder;
  min-height: 100px;
  margin: 5px 0;
  font-size: 24px;
  display: flex;
  padding: 15px 0;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.5);

  .numbers {
    font-size: 4rem;
    font-weight: bolder !important;
  }

  &.small {
    height: 100px;
    .numbers {
      font-size: 2rem;
      font-weight: bolder !important;
    }
  }
}
</style>
