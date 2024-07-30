<template>
  <!-- 可编辑表格V2 -->
  <div class="tb-container" ref="tbContainerRef">
    <h2 style="margin: 0; text-align: center">测试表 - 可编辑表格</h2>

    <!-- 表格 -->
    <el-table
      :data="testDatas"
      border
      style="width: 100%; margin-top: 10px"
      @cell-dblclick="cellDblclick"
      @header-contextmenu="(column, $event) => rightClick(null, column, $event)"
      @row-contextmenu="rightClick"
      :row-class-name="tableRowClassName">
      <el-table-column v-if="columnList.length > 0" type="index" :label="'编号'" :width="50" />
      <el-table-column
        v-for="(col, idx) in columnList"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :index="idx" />
    </el-table>
    <p style="text-align: left; color: #ccc">右键菜单，双击编辑</p>

    <div>
      <h3 style="text-align: center">实时数据展示</h3>
      <label>当前目标：</label>
      <p>{{ JSON.stringify(curTarget) }}</p>
      <label>表头：</label>
      <p v-for="col in columnList" :key="col.prop">{{ JSON.stringify(col) }}</p>
      <label>数据：</label>
      <p v-for="(data, idx) in testDatas" :key="idx">{{ JSON.stringify(data) }}</p>
    </div>

    <!-- 右键菜单框 -->
    <div v-show="showMenu" id="contextmenu" @mouseleave="showMenu = false">
      <i class="el-icon-circle-close hideContextMenu" @click="showMenu = false"></i>
      <el-button size="mini" type="primary" @click="addColumn()">前方插入一列</el-button>
      <el-button size="mini" type="primary" @click="addColumn(true)">后方插入一列</el-button>
      <el-popconfirm title="确定删除该列吗？" @confirm="delColumn">
        <template #reference>
          <el-button type="primary" size="mini">删除当前列</el-button>
        </template>
      </el-popconfirm>
      <el-button size="mini" type="primary" @click="renameCol($event)">更改列名</el-button>
      <div v-show="!curTarget.isHead">
        <hr />
        <el-button size="mini" type="primary" @click="addRow()">上方插入一行</el-button>
        <el-button size="mini" type="primary" @click="addRow(true)">下方插入一行</el-button>
        <el-popconfirm title="确定删除该行吗？" @confirm="delRow">
          <template #reference>
            <el-button type="primary" size="mini">删除当前行</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <!-- 单元格/表头内容编辑框 -->
    <div v-show="showEditInput" id="editInput" @mouseleave="showEditInput = false">
      <el-input
        placeholder="请输入内容"
        v-model="curTarget.val"
        clearable
        @change="updTbCellOrHeader">
        <template #prepend>{{ curColumn.label || curColumn.prop }}</template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// 定义数据
const columnList = ref([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'city', label: '城市' },
  { prop: 'tel', label: '电话' },
])
const testDatas = ref([
  { name: '张三', age: 24, city: '广州', tel: '13312345678' },
  { name: '李四', age: 25, city: '九江', tel: '18899998888' },
])
const showMenu = ref(false)
const showEditInput = ref(false)
const curTarget = reactive({
  rowIdx: null,
  colIdx: null,
  val: null,
  isHead: undefined,
})
const countCol = ref(0)

// 计算属性
const curColumn = computed(() => columnList.value[curTarget.colIdx] ?? {})

// 方法
function cellDblclick(row, column, cell, $event) {
  showEditInput.value = false
  if (column.index == null) return
  locateMenuOrEditInput('editInput', 200, $event)
  showEditInput.value = true
  Object.assign(curTarget, {
    rowIdx: row.row_index,
    colIdx: column.index,
    val: row[column.property],
    isHead: false,
  })
}

function rightClick(row, column, $event) {
  $event.preventDefault()
  showMenu.value = false
  if (column.index == null) return
  locateMenuOrEditInput('contextmenu', 140, $event)
  showMenu.value = true
  Object.assign(curTarget, {
    rowIdx: row ? row.row_index : null,
    colIdx: column.index,
    val: row ? row[column.property] : column.label,
    isHead: !row,
  })
}

function renameCol($event) {
  showEditInput.value = false
  if (curTarget.colIdx === null) return
  locateMenuOrEditInput('editInput', 200, $event)
  showEditInput.value = true
}

function updTbCellOrHeader(val) {
  if (!curTarget.isHead) testDatas.value[curTarget.rowIdx][curColumn.value.prop] = val
  else {
    if (!val) return
    columnList.value[curTarget.colIdx].label = val
  }
}

function addRow(later) {
  showMenu.value = false
  const idx = later ? curTarget.rowIdx + 1 : curTarget.rowIdx
  let obj = {}
  columnList.value.forEach(p => (obj[p.prop] = ''))
  testDatas.value.splice(idx, 0, obj)
}

function delRow() {
  showMenu.value = false
  if (curTarget.rowIdx !== null) testDatas.value.splice(curTarget.rowIdx, 1)
}

function addColumn(later) {
  showMenu.value = false
  const idx = later ? curTarget.colIdx + 1 : curTarget.colIdx
  const colStr = { prop: 'col_' + ++countCol.value, label: '' }
  columnList.value.splice(idx, 0, colStr)
  testDatas.value.forEach(p => (p[colStr.prop] = ''))
}

function delColumn() {
  showMenu.value = false
  testDatas.value.forEach(p => {
    delete p[curColumn.value.prop]
  })
  columnList.value.splice(curTarget.colIdx, 1)
}

function tableRowClassName({ row, rowIndex }) {
  row.row_index = rowIndex
}

const tbContainerRef = ref()

function locateMenuOrEditInput(eleId, eleWidth, $event) {
  // 表格容器的位置
  const { x: tbX, y: tbY } = tbContainerRef.value.getBoundingClientRect()
  // 当前鼠标位置
  const { x: pX, y: pY } = $event
  const ele = document.getElementById(eleId)
  ele.style.top = pY - tbY - 6 + 'px'
  ele.style.left = pX - tbX - 6 + 'px'
  if (window.innerWidth - eleWidth < pX - tbX) {
    ele.style.left = 'unset'
    ele.style.right = 0
  }
}
</script>

<style lang="scss" scoped>
.tb-container {
  position: relative;
}
#contextmenu {
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  width: 120px;
  border-radius: 3px;
  border: 1px solid #999999;
  background-color: #f4f4f4;
  padding: 10px;
  z-index: 12;
  button {
    display: block;
    margin: 0 0 5px;
  }
}
.hideContextMenu {
  position: absolute;
  top: 5px;
  right: 5px;
}
#editInput,
#headereditInput {
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  min-width: 200px;
  max-width: 400px;
  padding: 0;
  z-index: 12;
}
#editInput .el-input,
#headereditInput .el-input {
  outline: 0;
  border: 1px solid #c0f2f9;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px #c0f2f9;
}
</style>
