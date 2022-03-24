<template>
  <div id="hello">
    <h2 style="margin:0;text-align:center;">测试表</h2>
	
	  <!-- 表格 -->
  	<el-table
      :data="testDatas"
      border
      style="width: 100%;margin-top:10px"
      @header-contextmenu="(column, event) => rightClick(null, column, event)"
      @row-contextmenu="rightClick"
      :row-class-name="tableRowClassName"
    >
	    <el-table-column v-if="testCols.length > 0" type="index" label="编号" :width="50"/>
	    <el-table-column v-for="(column, idx) in testCols" :key="column.col" :index="idx">
        <!--label-->
        <template #header>
      	  <p v-show="column.show" @dblclick="column.show = false">
          	{{column.txt}} 
          	<i class="el-icon-edit-outline" @click="column.show = false"></i>
      	  </p>
      	  <el-input
          	size="mini"
          	v-show="!column.show"
          	v-model="column.txt"
         	  @blur="column.show=true">
      	  </el-input>
      	</template>
      	<!--prop-->
      	<template #default="scope">
      	  <p v-show="scope.row[column.col].show" @dblclick="scope.row[column.col].show = false">
          	{{scope.row[column.col].content}} 
          	<i class="el-icon-edit-outline" @click="scope.row[column.col].show=false"></i>
      	  </p>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
          	v-show="!scope.row[column.col].show"
          	v-model="scope.row[column.col].content"
         	  @blur="scope.row[column.col].show = true">
      	  </el-input>
      	</template>
      </el-table-column>
  	</el-table>
    <p style="text-align:left;color:#ccc;">右键菜单，双击编辑</p>

    <div>
      <h3 style="text-align:center;">实时数据展示</h3>
      <label>当前目标：</label>
      <p>{{JSON.stringify(curTarget)}}</p>
      <label>表头：</label>
      <p v-for="col in testCols" :key="col.col">{{JSON.stringify(col)}}</p>
      <label>数据：</label>
      <ul>
        <li v-for="(data,idx) in testDatas" :key="idx">
          <p v-for="(key,idx1) in Object.keys(data)" :key="idx1">{{key + ': ' + JSON.stringify(data[key])}}</p>
        </li>
      </ul>
    </div>

	  <!-- 表头右键菜单 -->
    <div v-show="showMenu" id="contextmenu">
      <i class="el-icon-circle-close hideContextMenu" @click="showMenu=false"></i>
      <el-button size="mini" type="primary" @click="addColumn()">前方插入一列</el-button>
      <el-button size="mini" type="primary" @click="addColumn(true)">后方插入一列</el-button>
      <el-popconfirm title="确定删除该列吗？" @confirm="delColumn">
        <template #reference>
          <el-button type="primary" size="mini">删除当前列</el-button>
        </template>
      </el-popconfirm>
      <div v-show="!curTarget.isHead">
        <hr/>
        <el-button size="mini" type="primary" @click="addRow()">上方插入一行</el-button>
        <el-button size="mini" type="primary" @click="addRow(true)">下方插入一行</el-button>
        <el-popconfirm title="确定删除该行吗？" @confirm="delRow">
		      <template #reference>
          	<el-button type="primary" size="mini">删除当前行</el-button>
		      </template>
        </el-popconfirm>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'demo',
  data(){
    return{
      testCols: [
        { col: "name", txt: 'name', show: true },
        { col: "age", txt: 'age', show: true },
        { col: "city", txt: 'city', show: true },
        { col: "tel", txt: 'tel', show: true }
      ],
      testDatas: [{
        name: { content: '张三', show: true },
        age: { content: 24, show: true },
        city: { content: '广州', show: true },
        tel: { content: '13312345678', show: true }
      },{
        name: { content: '李四', show: true },
        age: { content: 25, show: true },
        city: { content: '九江', show: true },
        tel: { content: '18899998888', show: true }
      }],
      count_col: 0,
      showMenu: false,
      curTarget: {                 // 当前目标信息
        rowIdx: null,              // 行下标
        colIdx: null,              // 列下标
        isHead: undefined          // 当前目标是表头？
      },
    }
  },
  methods:{
    rightClick(row, column, event) {
      // 阻止浏览器自带的右键菜单弹出
      event.preventDefault() // window.event.returnValue = false
      if(column.index == null) return
      // 定位菜单
      let ele = document.getElementById('contextmenu')
      ele.style.top = event.clientY - 25 + 'px'
      ele.style.left = event.clientX - 25 + 'px'
      if(window.innerWidth - 140 < event.clientX) {
        ele.style.left = 'unset'
        ele.style.right = 0
      }
      this.showMenu = true
      // 当前目标
      this.curTarget = {
        rowIdx: row ? row.row_index : null,
        colIdx: column.index,
        isHead: !row
      }
    },

    // 新增行
    addRow(later) {
      this.showMenu = false
      if(this.curTarget.rowIdx === null) return
      const idx = later ? this.curTarget.rowIdx + 1 : this.curTarget.rowIdx
      let obj = {}
      this.testCols.forEach(p => {
        obj[p.col] = { content: '', show: true }
      })
      this.testDatas.splice(idx, 0, obj)
    },
    // 删除行
    delRow() {
      this.showMenu = false
      this.curTarget.rowIdx !== null && this.testDatas.splice(this.curTarget.rowIdx, 1)
    },
    // 新增列
    addColumn(later) {
      this.showMenu = false
      const idx = later ? this.curTarget.colIdx + 1 : this.curTarget.colIdx
      let obj = { col: 'col_' + ++this.count_col, txt: '', show: true }
      this.testCols.splice(idx, 0, obj)
      this.testDatas.forEach(p => {
        // vue3无需 this.$set(p, obj.col, { content: '', show: true }) // vue2中, 新增的对象无法被监听到
        p[obj.col] = { content: '', show: true }
      })
    },
    // 删除列
    delColumn() {
      this.showMenu = false
      let colKey = this.testCols[this.curTarget.colIdx].col
      this.testCols.splice(this.curTarget.colIdx, 1)
      this.testDatas.forEach(p => delete p[colKey] )
    },
    // 添加表格行下标
    tableRowClassName({row, rowIndex}) {
      row.row_index = rowIndex
    },
  }
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
  button {display:block;margin:0 0 5px;}
}
.hideContextMenu {position:absolute;top:5px;right:5px;}
</style>
