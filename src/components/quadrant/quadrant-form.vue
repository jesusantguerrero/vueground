<template>
  <form
    action=""
    class="note-form card"
    @keydown.ctrl.s.prevent="emitSave"
    ref="QuadrantForm"
  >
    <input
      type="text"
      class="form-control"
      v-model="formData.title"
      @focus="listenClickOut"
      placeholder="Keep it short"
    />
    <textarea
      v-if="focused"
      name=""
      id=""
      cols="30"
      class="form-control"
      :class="{ show: focused }"
      placeholder="Add a description"
      rows="5"
      v-model="formData.description"
    ></textarea>
    <i class="fa fa-spinner fa-spin bigger ml-2" v-if="isLoading"></i>
  </form>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      focused: false,
      formData: {},
      defaultState: "backlog"
    };
  },
  mounted() {},
  methods: {
    prepareItem() {
      const id = Math.random()
        .toString(16)
        .replace(".", "");

      return {
        projectId: 1,
        commit: false,
        commitDate: "",
        userId: this.user.id,
        title: this.formData.title,
        text: this.formData.description || "",
        completedAt: "",
        createdAt: new Date().toISOString().slice(0, 10),
        deletedAt: null,
        updatedAt: null,
        state: this.defaultState,
        done: false,
        id: id,
        statusTimeGroup: "week"
      };
    },

    emitSave() {
      this.focused = false;
      if (this.formData.title) {
        this.$emit("save", this.prepareItem());
        this.formData = {};
      }
    },

    listenClickOut() {
      if (!this.focused) {
        this.focused = true;
        const self = this;
        document.addEventListener(
          "click",
          e => {
            if (
              !self.$refs.QuadrantForm ||
              (e.target !== self.$refs.QuadrantForm &&
                !self.$refs.QuadrantForm.contains(e.target) &&
                self.focused)
            ) {
              this.focused = false;
              document.removeEventListener("click", () => {});
              this.disableClickOut();
            }
          },
          true
        );
      }
    },

    disableClickOut() {
      document.removeEventListener("click", () => {});
    }
  }
};
</script>

<style lang="scss">
.note-form {
  width: 100%;
  max-width: 500px;
  border: 1px solid #ccc;
  overflow: hidden;
  margin: 15px 0;
  transition: all ease 0.3s;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);

  .form-control {
    border: none;
    &:focus {
      outline: none;
      box-shadow: none;
    }
  }

  .show {
    animation: ease-in appear 0.3s;
  }

  @keyframes appear {
    0% {
      height: 0;
    }
    100% {
      height: 116px;
    }
  }
}
</style>
