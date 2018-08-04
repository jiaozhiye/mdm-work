<template>
  <div class="z-drr-container"
    @mousedown.stop="elmDown"
    :style="style"
    :class="{
      'z-draggable': draggable,
      'z-resizable': resizable,
      'z-rotatable': rotatable,
      'z-active': enabled,
      'z-dragging': dragging,
      'z-resizing': resizing,
      'z-rotating': rotating
    }">
    <slot></slot>
    <div class="z-rotateable-handle"
      v-if="rotatable"
      :style="{ display: enabled ? 'block' : 'none'}"
      @mousedown.stop.prevent="rotating = true"></div>
    <div class="z-resizeable-handle"
      v-if="resizable"
      v-for="handle in handles"
      :key="handle"
      :class="'z-handle-' + handle"
      :style="{ display: enabled ? 'block' : 'none'}"
      @mousedown.stop.prevent="handleResizeStart(handle, $event)"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "vue-drr",
  props: {
    active: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: true
    },
    resizable: {
      type: Boolean,
      default: true
    },
    rotatable: {
      type: Boolean,
      default: true
    },
    w: {
      type: Number,
      default: 200,
      validator(val) {
        return val > 0;
      }
    },
    h: {
      type: Number,
      default: 200,
      validator(val) {
        return val > 0;
      }
    },
    minw: {
      type: Number,
      default: 50,
      validator(val) {
        return val > 0;
      }
    },
    minh: {
      type: Number,
      default: 36,
      validator(val) {
        return val > 0;
      }
    },
    angle: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === "number";
      }
    },
    x: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === "number";
      }
    },
    y: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === "number";
      }
    },
    z: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === "number";
      }
    },
    handles: {
      type: Array,
      default() {
        return ["n", "e", "s", "w", "nw", "ne", "se", "sw"];
      }
    },
    axis: {
      type: String,
      default: "both",
      validator(val) {
        return ["x", "y", "both"].indexOf(val) !== -1;
      }
    },
    grid: {
      type: Array,
      default() {
        return [1, 1];
      }
    },
    parent: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.parentW = 9999;
    this.parentH = 9999;

    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.mouseOffX = 0;
    this.mouseOffY = 0;

    this.elmX = 0;
    this.elmY = 0;

    this.elmW = 0;
    this.elmH = 0;
  },
  mounted() {
    document.documentElement.addEventListener("mousedown", this.deselect, true);
    document.documentElement.addEventListener(
      "mousemove",
      this.handleMove,
      true
    );
    document.documentElement.addEventListener("mouseup", this.handleUp, true);

    this.initial();
  },
  beforeDestroy() {
    document.documentElement.removeEventListener(
      "mousedown",
      this.deselect,
      true
    );
    document.documentElement.removeEventListener(
      "mousemove",
      this.handleMove,
      true
    );
    document.documentElement.removeEventListener(
      "mouseup",
      this.handleUp,
      true
    );
  },
  data() {
    return {
      top: this.y,
      left: this.x,
      width: this.w,
      height: this.h,
      zIndex: this.z,
      rotateAngle: this.angle,
      resizing: false,
      dragging: false,
      rotating: false,
      enabled: this.active,
      handle: null
    };
  },
  methods: {
    initial() {
      this.elmX = this.x;
      this.elmY = this.y;
      this.elmW = this.w;
      this.elmH = this.h;

      this.reviewDimensions();
    },
    reviewDimensions() {
      if (this.minw > this.w) {
        this.width = this.minw;
      }

      if (this.minh > this.h) {
        this.height = this.minh;
      }

      if (this.parent) {
        const parentW = parseInt(this.$el.parentNode.clientWidth, 10);
        const parentH = parseInt(this.$el.parentNode.clientHeight, 10);

        this.parentW = parentW;
        this.parentH = parentH;

        if (this.w > parentW) {
          this.width = parentW;
        }

        if (this.h > parentH) {
          this.height = parentH;
        }

        if (this.x + this.w > parentW) {
          this.width = parentW - this.x;
        }

        if (this.y + this.h > parentH) {
          this.height = parentH - this.y;
        }

        this.elmW = this.width;
        this.elmH = this.height;
      }

      // this.$emit('resizing', this.left, this.top, this.width, this.height)
    },
    elmDown(e) {
      const target = e.target || e.srcElement;
      if (this.$el.contains(target)) {
        this.reviewDimensions();

        if (!this.enabled) {
          this.enabled = true;

          this.$emit("activated");
          this.$emit("update:active", true);
        }
        if (this.draggable) {
          this.dragging = true;
        }
      }
    },
    deselect(e) {
      if (this.$el.contains(e.target)) {
        e.preventDefault(); // 防止拖动时文字被选中
      }
      this.lastMouseX =
        e.pageX || e.clientX + document.documentElement.scrollLeft;
      this.lastMouseY =
        e.pageY || e.clientY + document.documentElement.scrollTop;

      const target = e.target || e.srcElement;
      const regex = new RegExp("z-handle-([nesw]{1, 2})", "");

      // 点击在当前组件外，取消active状态
      if (!this.$el.contains(target) && !regex.test(target.className)) {
        if (this.enabled) {
          // this.enabled = false
          this.$emit("deactivated", target);
          this.$emit("update:active", false);
        }
      }
    },
    handleResizeStart(handle, e) {
      this.handle = handle;

      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();

      this.resizing = true;
    },
    getOrigin() {
      const rect = this.$el.getBoundingClientRect();
      return {
        x: (rect.left + rect.right) / 2,
        y: (rect.bottom + rect.top) / 2
      };
    },
    handleMove(e) {
      const lastMouseX = this.lastMouseX;
      const lastMouseY = this.lastMouseY;
      // 鼠标移动后pageX值
      const mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft;
      const mouseY = e.pageY || e.clientY + document.documentElement.scrollTop;

      // 得出鼠标移动变化的位置值
      let diffX = mouseX - this.lastMouseX + this.mouseOffX;
      // let diffX = mouseX - this.lastMouseX
      let diffY = mouseY - this.lastMouseY + this.mouseOffY;

      this.mouseOffX = this.mouseOffY = 0;

      // 新的pageX值
      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;

      const dX = diffX;
      const dY = diffY;

      if (this.resizing) {
        if (this.handle.indexOf("n") >= 0) {
          if (this.elmH - dY < this.minh) {
            diffY = this.elmH - this.minh;
          } else if (this.elmY + dY < 0) {
            diffY = -this.elmY;
          }
          this.mouseOffY = dY - diffY;
          this.elmY += diffY;
          this.elmH -= diffY;
        }

        if (this.handle.indexOf("s") >= 0) {
          if (this.elmH + dY < this.minh) {
            diffY = this.minh - this.elmH;
          } else if (this.elmY + this.elmH + dY > this.parentH) {
            diffY = this.parentH - this.elmY - this.elmH;
          }
          this.mouseOffY = dY - diffY;
          this.elmH += diffY;
        }

        if (this.handle.indexOf("w") >= 0) {
          if (this.elmW - dX < this.minw) {
            diffX = this.elmW - this.minw;
          } else if (this.elmX + dX < 0) {
            diffX = -this.elmX;
          }
          this.mouseOffX = dX - diffX;
          this.elmX += diffX;
          this.elmW -= diffX;
        }

        if (this.handle.indexOf("e") >= 0) {
          if (this.elmW + dX < this.minw) {
            diffX = this.minw - this.elmW;
          } else if (this.elmX + this.elmW + dX > this.parentW) {
            diffX = this.parentW - this.elmX - this.elmW;
          }
          this.mouseOffX = dX - diffX;
          this.elmW += diffX;
        }

        this.left = Math.round(this.elmX / this.grid[0]) * this.grid[0];
        this.top = Math.round(this.elmY / this.grid[1]) * this.grid[1];

        this.width = Math.round(this.elmW / this.grid[0]) * this.grid[0];
        this.height = Math.round(this.elmH / this.grid[1]) * this.grid[1];

        this.$emit(
          "resizing",
          this.zIndex,
          this.left,
          this.top,
          this.width,
          this.height
        );
      } else if (this.dragging) {
        if (this.parent) {
          if (this.elmX + dX < 0) {
            // 判断元素是否将移出左侧
            diffX = -this.elmX;
          } else if (this.elmX + this.elmW + dX > this.parentW) {
            // 判断元素是否将移出右侧
            diffX = this.parentW - this.elmX - this.elmW;
          }
          if (this.elmY + dY < 0) {
            diffY = -this.elmY;
          } else if (this.elmY + this.elmH + dY > this.parentH) {
            diffY = this.parentH - this.elmY - this.elmH;
          }
          this.mouseOffX = dX - diffX;
          this.mouseOffY = dY - diffY;
        }

        this.elmX += diffX;
        this.elmY += diffY;

        if (this.axis === "x" || this.axis === "both") {
          // 四舍五入取得当前所在格子数 * 每个格子的单位像素，保证每一个点子在格子上
          this.left = Math.round(this.elmX / this.grid[0]) * this.grid[0];
        }
        if (this.axis === "y" || this.axis === "both") {
          this.top = Math.round(this.elmY / this.grid[1]) * this.grid[1];
        }

        this.$emit("dragging", this.zIndex, this.left, this.top);
      } else if (this.rotating) {
        const origin = this.getOrigin();
        const lastAngle = Math.atan2(
          lastMouseY - origin.y,
          lastMouseX - origin.x
        );
        const currentAngle = Math.atan2(mouseY - origin.y, mouseX - origin.x);
        this.rotateAngle += Math.round(
          (currentAngle - lastAngle) * 180 / Math.PI
        );

        this.$emit("rotating", this.zIndex, this.rotateAngle);
      }
    },
    handleUp(e) {
      this.handle = null;
      if (this.resizing) {
        this.resizing = false;
        this.$emit(
          "resizestop",
          this.zIndex,
          this.left,
          this.top,
          this.width,
          this.height
        );
      }
      if (this.dragging) {
        this.dragging = false;
        this.$emit("dragstop", this.zIndex, this.left, this.top);
      }

      if (this.rotating) {
        this.rotating = false;
        this.$emit("rotatestop", this.zIndex, this.rotateAngle);
      }

      this.elmX = this.left;
      this.elmY = this.top;
    }
  },
  computed: {
    ...mapState("editer", ["poster"]),
    scale() {
      return this.poster.scale;
    },
    style() {
      this.top = this.y;
      this.left = this.x;
      this.width = this.w;
      this.height = this.h;
      this.zIndex = this.z;
      this.rotateAngle = this.angle;

      return {
        top: this.y + "px",
        left: this.x + "px",
        width: this.w + "px",
        height: this.h + "px",
        zIndex: this.z,
        transform: "rotate(" + this.angle + "deg)"
      };
    }
  },
  watch: {
    active(val) {
      this.enabled = val;
    },
    scale(val) {
      if (this.$el) {
        this.initial();
      }
    }
  }
};
</script>

<style scoped>
.z-drr-container {
  position: absolute;
}
.z-drr-container *,
.z-drr-container *:before,
.z-drr-container *:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}
.z-rotateable-handle {
  position: absolute;
  left: 50%;
  top: -36px;
  width: 1px;
  height: 36px;
  margin-left: -0.5px;
  background-color: #32a6d0;
  cursor: url(../../assets/img/mouserotate.ico) 10 10, default;
}
.z-rotateable-handle:after {
  content: " ";
  top: 0;
  left: 0;
  margin-left: -5.5px;
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid #32a6d0;
  border-radius: 50%;
  background: #fff;
}
.z-resizeable-handle {
  display: none;
  position: absolute;
}
.z-handle-nw,
.z-handle-ne,
.z-handle-sw,
.z-handle-se {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid #32a6d0;
  border-radius: 50%;
  background: #fff;
}
.z-handle-nw {
  top: -6px;
  left: -6px;
  cursor: nw-resize;
}
.z-handle-ne {
  top: -6px;
  right: -6px;
  cursor: ne-resize;
}
.z-handle-sw {
  bottom: -6px;
  left: -6px;
  cursor: sw-resize;
}
.z-handle-se {
  bottom: -6px;
  right: -6px;
  cursor: se-resize;
}
.z-handle-n:after,
.z-handle-w:after,
.z-handle-e:after,
.z-handle-s:after {
  content: " ";
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid #32a6d0;
  border-radius: 50%;
  background: #fff;
}
.z-handle-n {
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  border-top: 1px solid #32a6d0;
  cursor: n-resize;
}
.z-handle-n:after {
  bottom: 0;
  left: 50%;
  margin-left: -6px;
}
.z-handle-w {
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  border-left: 1px solid #32a6d0;
  cursor: w-resize;
}
.z-handle-w:after {
  top: 50%;
  right: 0;
  margin-top: -6px;
}
.z-handle-e {
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  border-right: 1px solid #32a6d0;
  cursor: e-resize;
}
.z-handle-e:after {
  top: 50%;
  left: 0;
  margin-top: -6px;
}
.z-handle-s {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6px;
  border-bottom: 1px solid #32a6d0;
  cursor: s-resize;
}
.z-handle-s:after {
  top: 0;
  left: 50%;
  margin-left: -6px;
}
.z-active {
  z-index: 999;
}
</style>