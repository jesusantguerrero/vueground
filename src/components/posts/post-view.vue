<template>
  <form action="" @submit.prevent="" v-if="!machine.state.matches('closed')">
    {{ machine.state.value }}
    <div class="form-group">
      <label for="title"> title </label>
      <input
        type="text"
        name=""
        id=""
        class="form-control"
        v-model="post.title"
      />
    </div>
    <div class="form-group">
      <label for="">Content:</label>
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        class="form-control"
        v-model="post.content"
      ></textarea>
    </div>
    <button
      class="btn btn-secondary"
      :disabled="machine.state.matches('saving')"
      @click.prevent="machine.send('CANCEL')"
    >
      Cancel
    </button>
    <button
      class="btn btn-primary"
      :disabled="machine.state.matches('saving')"
      @click.prevent="machine.send({ type: 'SAVE', payload: post })"
    >
      Save
    </button>
  </form>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    },
    machine: {
      type: Object,
      required: true
    }
  }
};
</script>

<style></style>
