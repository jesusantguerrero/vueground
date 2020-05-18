<template>
  <form action="" @submit.prevent="" v-if="!machine.state.matches('closed')">
    <div class="form-group">
      <label for="title"> Title </label>
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
    <div class="d-flex justify-content-end">
      <button
        class="btn btn-secondary mr-2"
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
    </div>
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

<style lang="scss">
.form-control {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0 0 0 0;
  color: white;

  &:focus {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
}
</style>
