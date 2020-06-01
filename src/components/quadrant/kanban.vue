<template>
  <div>
    <!-- <kanban-board :stages="stages" :blocks="data"> </kanban-board> -->
    <div class="row d-flex mt-5">
      <div class="col state-card card" :class="`color-yerterday`">
        <h4 class="title">
          committed
        </h4>
        <div class="items-container">
          <div v-for="item in committed" :key="item.id" class="item">
            <header>
              <div class="form-group">
                <label :for="item.id">
                  {{ item.title }} ({{ item.commitDate }})
                </label>
              </div>
            </header>
            <section></section>
            <section class="controls d-flex">
              <div class="flag"><span class="material-icons">flag</span></div>
              <div class="project">
                <span class="material-icons">flag</span>
              </div>
              <div class="status"><span class="material-icons">flag</span></div>
              <div class="archive">
                <span class="material-icons">flag</span>
              </div>
              <div class="more">
                <span class="material-icons">more-vert</span>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div
        class="col state-card card"
        :class="`color-${stage}`"
        v-for="stage in stages"
        :key="stage"
      >
        <h4 class="title">
          {{ stage }}
        </h4>
        <draggable
          v-model="quadrants[stage]"
          group="notes"
          v-bind="dragOptions"
          :id="stage"
          @start="isDragging = true"
          @end="isDragging = false"
          v-if="quadrants[stage]"
          class="items-container"
          @change="onChange($event, stage)"
        >
          <div v-for="item in quadrants[stage]" :key="item.id" class="item">
            <header>
              <div class="form-group">
                <label :for="item.id">
                  <input
                    v-if="stage != 'backlog'"
                    type="checkbox"
                    @change="updateDone(item)"
                    name=""
                    :id="item.id"
                    v-model="item.done"
                  />
                  {{ item.title }}
                </label>
              </div>
            </header>
            <section></section>
            <section class="controls d-flex">
              <div class="flag"><span class="material-icons">flag</span></div>
              <div class="project">
                <span class="material-icons">flag</span>
              </div>
              <div class="status"><span class="material-icons">flag</span></div>
              <div class="archive">
                <span class="material-icons">flag</span>
              </div>
              <div class="more">
                <span class="material-icons">more-vert</span>
              </div>
            </section>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    committed: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      isDragging: false,
      quadrants: {
        backlog: [],
        do: [],
        schedule: [],
        delegate: [],
        delete: []
      },
      stages: ["do", "schedule", "delegate", "delete", "backlog"]
    };
  },

  watch: {
    data: {
      handler() {
        this.stages.forEach(stage => {
          this.quadrants[stage] = this.filterByState(stage);
        });
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    filterByState(state) {
      return this.data.filter(block => block.state == state).slice();
    },
    updateDone(item) {
      item.completedAt = item.done
        ? new Date().toISOString().slice(0, 10)
        : null;
      this.$emit("changed", item);
    },
    onChange({ added }, stage) {
      if (added) {
        added.element.state = stage;
        this.$emit("changed", added.element);
      }
    }
  }
};
</script>

<style lang="scss">
.state-card {
  min-width: 270px;
  margin: 0 15px;

  &.color-delete {
    background: #f28b82;
  }

  &.color-delegate {
    background: #fff475;
  }

  &.color-schedule {
    background: #cbf0f8;
  }

  &.color-do {
    background: #ccff90;
  }

  .title {
    color: #20214e;
    text-transform: capitalize;
    text-align: center;
    padding: 10px;
  }

  .items-container {
    height: 100%;
    width: 100%;
  }

  .item {
    cursor: move;
    margin: 5px 0;
    color: #666;
    font-weight: bold;
    transition: all ease 0.3s;

    .controls {
      display: none !important;
    }

    // &:hover {
    // .controls {
    //     display: flex !important;
    // }
    // }
  }
}
</style>
