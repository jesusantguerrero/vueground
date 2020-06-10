<template>
  <div>
    <!-- <kanban-board :stages="stages" :blocks="data"> </kanban-board> -->
    <div class="row d-flex mt-5">
      <div class="col state-card card" :class="`color-yerterday`">
        <h4 class="title">
          committed
        </h4>
        <div class="items-container">
          <quadrant-task
            :item="item"
            v-for="item in committed"
            :key="item.id"
            :allow-check="false"
          >
          </quadrant-task>
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
          <quadrant-task
            v-for="item in quadrants[stage]"
            :item="item"
            :key="item.id"
            @deleted="$emit('deleted', $event)"
            @changed="$emit('changed', $event)"
          >
          </quadrant-task>
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
            <quadrant-task
              :item="item"
              v-for="item in quadrants.do"
              :key="item.id"
            >
            </quadrant-task>
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
import QuadrantTask from "./quadrant-task";

export default {
  components: {
    draggable,
    QuadrantTask
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
}
</style>
