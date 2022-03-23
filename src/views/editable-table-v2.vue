<template>
  <!-- 可编辑表格V2 -->
  <div id="hello">
    <h2 style="margin:0;text-align:center;">测试表</h2>

    <!-- 表格 -->
    <el-table
      :data="testDatas"
      border
      style="width: 100%;margin-top:10px"
      @row-contextmenu="rightClick"
      @cell-dblclick="cellDblclick"
      @header-contextmenu="(column, event) => rightClick(null, column, event)"
      :row-class-name="tableRowClassName"
    >
      <el-table-column v-if="testCols.length > 0" type="index" :label="'编号'" :width="50"/>
      <el-table-column
        v-for="(col,idx) in testCols"
        :key="col"
        :prop="col"
        :label="col"
        :index="idx"
      />
    </el-table>
    <p style="text-align:left;color:#ccc;">右键菜单，双击编辑</p>

    <!-- 实时数据展示 -->
    <div>
      <label>当前目标：</label>
      <p>{{JSON.stringify(curTarget)}}</p>
      <label>表头：</label>
      <p>{{testCols.toString()}}</p>
      <label>数据：</label>
      <p v-for="(data,idx) in testDatas" :key="idx">{{JSON.stringify(data)}}</p>
    </div>

    <!-- 右键菜单框 -->
    <div v-show="showMenu" id="contextmenu" @mouseleave="showMenu=false">

      <i class="el-icon-circle-close hideContextMenu" @click="showMenu=false"></i>
      <el-button size="mini" type="primary" @click="addColumn()">前方插入一列</el-button>
      <el-button size="mini" type="primary" @click="addColumn(true)">后方插入一列</el-button>
      <el-popconfirm title="确定删除该列吗？" @confirm="delColumn">
		    <template #reference>
          <el-button type="primary" size="mini">删除当前列</el-button>
		    </template>
      </el-popconfirm>

      <div v-show="curTarget.rowIdx !== null">
        <el-button size="mini" type="primary" @click="addRow()">上方插入一行</el-button>
        <el-button size="mini" type="primary" @click="addRow(true)">下方插入一行</el-button>
        <el-popconfirm title="确定删除该行吗？" @confirm="delRow">
		      <template #reference>
          	<el-button type="primary" size="mini">删除当前行</el-button>
		      </template>
        </el-popconfirm>
      </div>

      <el-button size="mini" type="primary" @click="renameCol($event)">更改列名</el-button>

    </div>

    <!-- 单元格/表头内容编辑框 -->
    <div v-show="showEditInput" id="editInput" @mouseleave="showEditInput=false">
      <el-input placeholder="请输入内容" v-model="curTarget.val" clearable @change="updTbCellOrHeader">
        <template #prepend>{{curTarget.tag}}</template>
      </el-input>
    </div>

  </div>
</template>

<script>
export default {
  name: 'demo',
  data(){
    return{
      testCols: ["name", "ageageageage", "city", "tel"],
      testDatas: [
        { name: '张三', ageageageage: 24, city: '广州', tel: '13312345678' },
        { name: '李四', ageageageage: 25, city: '九江', tel: '18899998888' }
      ],
      showMenu: false,             // 显示右键菜单
      showEditInput: false,        // 显示单元格/表头内容编辑输入框

      curTarget: {                 // 当前目标信息
        rowIdx: null,              // 行下标
        colIdx: null,              // 列下标
        tag: null,                 // 名
        val: null,                 // 值
        isHead: undefined          // 当前目标是表头？
      },
      countCol: 0,                 // 新建列计数
    }
  },
  methods: {
    // 单元格双击事件 - 更改单元格数值
    cellDblclick(row, column, cell, event) {
      this.showEditInput = false
      if(column.index == null) return
      this.locateMenuOrEditInput('editInput', 200, event) // 编辑框定位
      // 当前目标
      this.curTarget = {
        rowIdx: row.row_index,
        colIdx: column.index,
        tag: column.label,
        val: row[column.property],
        isHead: false
      }
      this.showEditInput = true
    },
    // 单元格/表头右击事件 - 打开菜单
    rightClick(row, column, event) {
      // 阻止浏览器自带的右键菜单弹出
      event.preventDefault() // window.event.returnValue = false
      this.showMenu = false
      if(column.index == null) return
      this.locateMenuOrEditInput('contextmenu', 140, event) // 菜单定位
      // 当前目标
      this.curTarget = {
        rowIdx: row ? row.row_index : null, // 目标行下标，表头无 row_index
        colIdx: column.index, // 目标项下标
        tag: column.label, // 目标项的名称
        val: row ? row[column.property] : column.label, // 目标值，表头记录名称
        isHead: !row
      }
      this.showMenu = true
    },
    // 去更改列名
    renameCol($event) {
      this.showEditInput = false
      if(this.curTarget.colIdx === null) return
      this.locateMenuOrEditInput('editInput', 200, $event) // 编辑框定位
      this.showEditInput = true
    },

    // 更改单元格内容/列名
    updTbCellOrHeader(val) {
      if(!this.curTarget.isHead)
        this.testDatas[this.curTarget.rowIdx][this.curTarget.tag] = val
      else {
        if(!val || this.curTarget.tag === val) return
        if(this.testCols.includes(val)) {
          this.$message.warning('请勿重名')
          return
        }
        const oldCol = this.curTarget.tag
        this.testDatas.forEach(p => {
          p[val] = p[oldCol]
          delete p[oldCol]
        })
        this.testCols[this.curTarget.colIdx] = val
      }
    },

    // 新增行
    addRow(later) {
      this.showMenu = false
      if(this.curTarget.rowIdx === null) return
      const idx = later ? this.curTarget.rowIdx + 1 : this.curTarget.rowIdx
      let obj = {}
      this.testCols.forEach(p => { obj[p] = '' })
      this.testDatas.splice(idx, 0, obj)
    },
    // 删除行
    delRow() {
      this.showMenu = false
      this.curTarget.rowIdx !== null && this.testDatas.splice(this.curTarget.rowIdx, 1)
    },
    // 新增列
    addColumn(later) {
      console.log(later)
      // debugger
      this.showMenu = false
      if(this.curTarget.colIdx === null) return
      const idx = later ? this.curTarget.colIdx + 1 : this.curTarget.colIdx
      const colStr = 'col_' + ++this.countCol
      this.testCols.splice(idx, 0, colStr)
      this.testDatas.forEach(p => p[colStr] = '')
    },
    // 删除列
    delColumn() {
      this.showMenu = false
      this.testCols.splice(this.curTarget.colIdx, 1)
      this.testDatas.forEach(p => { delete p[this.curTarget.tag] })
    },
    // 添加表格行下标
    tableRowClassName({row, rowIndex}) {
      row.row_index = rowIndex
    },
    // 定位菜单/编辑框
    locateMenuOrEditInput(eleId, eleWidth, event) {
      let ele = document.getElementById(eleId)
      ele.style.top = event.clientY - 25 + 'px'
      ele.style.left = event.clientX - 25 + 'px'
      if(window.innerWidth - eleWidth < event.clientX) {
        ele.style.left = 'unset'
        ele.style.right = 0
      }
    },
    // 生成key
    generateRandomKey() {
      return Math.random().toString(36).slice(2)
    },
  },
}
</script>

<style lang="scss" scoped>
#hello {position: relative;}
#contextmenu {
  position:absolute;
  top: 0;
  left: 0;
  height:auto;
  width:120px;
  border-radius: 3px;
  border: 1px solid #999999;
  background-color: #f4f4f4;
  padding: 10px;
  z-index: 12;
  button {display: block;margin: 0 0 5px;}
}
.hideContextMenu {position: absolute;top: 5px;right: 5px;}
#editInput,#headereditInput {
  position:absolute;
  top: 0;
  left: 0;
  height:auto;
  min-width:200px;
  max-width: 400px;
  padding: 0;
  z-index: 12;
}
#editInput .el-input,#headereditInput .el-input {
  outline: 0;
  border: 1px solid #c0f2f9;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px #c0f2f9;
}
</style>