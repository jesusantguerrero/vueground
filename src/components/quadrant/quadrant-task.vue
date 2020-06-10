<template>
  <div class="item">
    <header class="item-header">
      <div class="form-group">
        <label class="checkbox-label">
          <input
            v-if="item.state != 'backlog' && allowCheck"
            type="checkbox"
            @change="updateDone(item)"
            name=""
            :id="item.id"
            v-model="item.done"
          />
          <span>
            {{ item.title }}
          </span>
        </label>
        <div class="description" v-html="item.text"></div>
      </div>
      <span class="actions">
        <i class="fa fa-pencil action-icon" @click.prevent=""></i>
        <i
          class="fa fa-trash action-icon"
          @click.prevent="deleteItem(item)"
        ></i>
      </span>
    </header>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    allowCheck: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    updateDone(item) {
      item.completedAt = item.done
        ? new Date().toISOString().slice(0, 10)
        : null;
      this.$emit("changed", item);
    },
    deleteItem(item) {
      this.$emit("deleted", item);
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  cursor: move;
  margin: 5px 0;
  color: #666;
  transition: all ease 0.3s;

  .controls {
    display: none !important;
  }

  .item-header {
    display: flex;
  }

  .form-group {
    width: 100%;
  }

  .description {
    display: block;
    border-left: 3px solid #909090;
    padding-left: 10px;
    color: #707070;
  }

  .actions {
    opacity: 0;
    display: inline-flex;
    width: 70px;
    justify-content: flex-end;
    padding-right: 10px;
    transition: all ease 0.3s;
  }

  .action-icon {
    margin-left: 5px;
    height: 25px;
    min-width: 25px;
    width: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      cursor: pointer !important;
    }
  }

  &:hover {
    .actions {
      opacity: 1;
    }
  }

  .checkbox-label {
    display: flex;
    align-items: flex-start;
  }

  input[type="checkbox"] {
    -webkit-appearance: none;
    width: 1.2rem;
    min-width: 1.2rem;
    height: 1.2rem;
    min-height: 1.2rem;
    background: transparent;
    display: block;
    margin: 0 2px;
    border-radius: 3px;
    border: 2px solid #666;
    position: relative;
    margin-right: 10px;
    margin-top: 2px;
    cursor: pointer;
    transition: all ease 0.3s;
    display: inline-block;
    &:focus {
      outline: 0;
    }
  }

  [for^="check"] {
    display: inline-block;
    width: 80%;
    font-size: 18px;
    z-index: 200;
    cursor: text;
    color: #777;
    font-size: 20px;
  }

  [type="checkbox"]:checked {
    background: #655;

    &:before {
      content: "\2718";
      color: #fff;
      left: 5%;
      display: flex;
      bottom: 5px;
      justify-content: center;
      align-items: center;
      font-size: 10px;
    }

    & + [for*=""] {
      text-decoration: line-through;
    }
  }
}
</style>
