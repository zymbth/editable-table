<template>
  <!-- 可编辑表格V2实现步骤，可通过tag拉去查看 -->
  <div id="hello">
		<h4 style="display: inline-block;margin:0;">测试表</h4>
		<div style="display: inline-block;float: right;">
			<el-button size="mini" type="primary" @click="consoleDatas">打印数据</el-button>
		</div>

    <!-- 表格 -->
		<el-table
      :data="testDatas"
      border
      style="width: 100%;margin-top:10px"
      @cell-dblclick="cellDblclick"
      :row-class-name="tableRowClassName"
    >
			<el-table-column v-if="testCols.length > 0" type="index" :label="'编号'" :width="50"></el-table-column>
			<el-table-column
        v-for="(col, idx) in testCols"
        :key="idx"
        :prop="col"
        :label="col"
        :index="idx">
      </el-table-column>
		</el-table>

    <!-- 单元格内容编辑框 -->
    <div v-show="showEditInput" id="editInput" @mouseleave="showEditInput=false">
      <el-input placeholder="请输入内容" v-model="edInput.val" clearable @change="updTbCell">
        <template slot="prepend">{{edInput.tag}}</template>
      </el-input>
    </div>

  </div>
</template>

<script>
export default {
  name: 'demo2',
  data(){
	 return{
			testCols: ["name", "age", "city", "tel"],
			testDatas: [
        {name: '张三',age: 24,city: '广州',tel: '13312345678'},
        {name: '李四',age: 25,city: '九江',tel: '18899998888'}
			],
      showEditInput: false,  // 显示内容编辑输入框
      curRowIndex: null,     // 待编辑行下标
      curColIndex: null,     // 待编辑列下标
      edInput: {             // 内容编辑数据
        tag: '', // 列名
        val: ''  // 单元格值
      }
	 }
  },
	methods:{
    /* 添加表格行下标 */
    tableRowClassName({row, rowIndex}) {
      row.row_index = rowIndex
    },
    /* 单元格双击 - 更改单元格数值 */
    cellDblclick(row, column, cell, event) {
      this.showEditInput = false
      if(column.index == null) return;
      // 输入框定位
      let ele = document.getElementById('editInput')
      ele.style.top = event.clientY - 15 + 'px';
      ele.style.left = event.clientX - 15 + 'px';
      if(window.innerWidth - 200 < event.clientX) {
        ele.style.left = 'unset'
        ele.style.right = 0
      }
      // 数值绑定
      this.curRowIndex = row.row_index
      this.curColIndex = column.index
      this.edInput.tag = column.label
      this.edInput.val = row[column.label]
      this.showEditInput = true
    },
    /* 单元格内容更改 */
    updTbCell(val) {
      this.testDatas[this.curRowIndex][this.edInput.tag] = this.edInput.val
    },

    /* 打印表格数据 */
		consoleDatas() {
			console.log('表头',this.testCols.toString());
			console.log('数据', JSON.stringify(this.testDatas));
		}
	}
}
</script>

<style scoped>
#hello {position: relative;}
#editInput {
	position:absolute;
	top: 0;
	left: 0;
  height:auto;
  min-width:200px;
  max-width: 400px;
  padding: 0;
	z-index: 12;
}
#editInput .el-input {
  outline: 0;
  border: 1px solid #c0f2f9;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px #c0f2f9;
}

</style>
