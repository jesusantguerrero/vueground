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
                <label for=""> {{ item.title }} ({{ item.commitDate }}) </label>
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
          {{ stage }} <span class="small">({{ quadrants[stage].length }})</span>
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
                <label class="checkbox-label">
                  <input
                    v-if="stage != 'backlog'"
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
                <span class="actions">
                  <i class="fa fa-pencil action-icon" @click.prevent=""></i>
                  <i class="fa fa-trash action-icon" @click.prevent=""></i>
                </span>
              </div>
            </header>
          </div>
        </draggable>
      </div>
    </div>

    <el-dialog
      title="Yesterday's Tasks"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <div>
        <span class="title">
          Let's check you did yesterday!
        </span>
        <div class="col state-card card ml-0" :class="`color`">
          <h4 class="title">
            To Do <span class="small">({{ quadrants.do.length }})</span>
          </h4>
          <div class="items-container">
            <div v-for="item in quadrants.do" :key="item.id" class="item">
              <header>
                <div class="form-group">
                  <label class="checkbox-label">
                    <input
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
                  <span class="actions">
                    <i class="fa fa-pencil action-icon" @click.prevent=""></i>
                    <i class="fa fa-trash action-icon" @click.prevent=""></i>
                  </span>
                </div>
              </header>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="completeDay">Start New Day</el-button>
      </span>
    </el-dialog>
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
      dialogVisible: false,
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
      return this.data
        .filter(block => block.state == state && block.commit == false)
        .slice();
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
    },
    openDialog() {
      this.dialogVisible = true;
    },
    completeDay() {
      this.dialogVisible = false;
      this.$emit("complete-day");
    }
  }
};
</script>

<style lang="scss">
.state-card {
  min-width: 270px;
  margin: 10px 15px;
  min-height: 300px;

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
    transition: all ease 0.3s;

    .controls {
      display: none !important;
    }

    .actions {
      display: none;
    }

    &:hover {
      .actions {
        display: inline-flex;
        width: 100%;
        justify-content: flex-end;
        padding-right: 10px;
      }
      .action-icon {
        margin-left: 5px;
        height: 25px;
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
        justify-content: center;
        align-items: center;
        font-size: 14px;
      }

      & + [for*=""] {
        text-decoration: line-through;
      }
    }
  }
}
</style>
