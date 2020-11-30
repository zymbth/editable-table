<template>
	<!-- 可编辑表格V2 -->
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
			@row-contextmenu="cellRightClick"
			@cell-dblclick="cellDblclick"
			@header-contextmenu="headerRightClick"
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

		<!-- 右键菜单框 -->
		<div v-show="showMenu" id="contextmenu" @mouseleave="showMenu=false">

			<i class="el-icon-circle-close hideContextMenu" @click="showMenu=false"></i>
			<el-button size="mini" type="primary" @click="addColumn(curColIndex)">前方插入一列</el-button>
			<el-button size="mini" type="primary" @click="addColumn(curColIndex, true)">后方插入一列</el-button>
			<el-popconfirm title="确定删除该列吗？" @onConfirm="delColumn">
				<el-button slot="reference" type="primary" size="mini">删除当前列</el-button>
			</el-popconfirm>

			<div v-show="curRowIndex != null">
				<el-button size="mini" type="primary" @click="addRow(curRowIndex)">上方插入一行</el-button>
				<el-button size="mini" type="primary" @click="addRow(curRowIndex,true)">下方插入一行</el-button>
				<el-popconfirm title="确定删除该行吗？" @onConfirm="delRow">
					<el-button slot="reference" type="primary" size="mini">删除当前行</el-button>
				</el-popconfirm>
			</div>

			<el-button size="mini" type="primary" @click="renameCol($event)">更改列名</el-button>

		</div>

	<!-- 单元格内容编辑框 -->
	<div v-show="showEditInput" id="editInput" @mouseleave="showEditInput=false">
		<el-input placeholder="请输入内容" v-model="edInput.val" clearable @change="updTbCell">
			<template slot="prepend">{{edInput.tag}}</template>
		</el-input>
	</div>
	<div v-show="showHeaderEditInput" id="headereditInput" @mouseleave="showHeaderEditInput=false">
		<el-input placeholder="请输入内容" v-model="edInput.val" clearable @change="updTbHeader">
			<template slot="prepend">{{edInput.tag}}</template>
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
				{name: '张三',ageageageage: 24,city: '广州',tel: '13312345678'},
				{name: '李四',ageageageage: 25,city: '九江',tel: '18899998888'}
			],
			showMenu: false,             // 显示右键菜单
			showEditInput: false,        // 显示内容编辑输入框
			showHeaderEditInput: false,  // 显示表头内容编辑输入框
			curRowIndex: null,           // 待编辑行下标
			curColIndex: null,           // 待编辑列下标
			curHeaderIndex: null,        // 待编辑表头列下标
			edInput: {                   // 内容编辑数据
				tag: '', // 列名
				val: ''  // 单元格值
			},
			countCol: 0,                 // 新建列计数
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
		renameCol($event) {
			console.log('x', $event.clientX, 'y', $event.clientY)
			this.showHeaderEditInput = false
			if(this.curColIndex == null) return;
			this.curHeaderIndex = this.curColIndex
			let ele = document.getElementById('headereditInput')
			ele.style.top = $event.clientY - 15 + 'px';
			ele.style.left = $event.clientX - 15 + 'px';
			if(window.innerWidth - 200 < $event.clientX) {
				ele.style.left = 'unset'
				ele.style.right = 0
			}
			this.edInput.tag = 'Rename column'
			this.edInput.val = this.testCols[this.curHeaderIndex]
			this.showHeaderEditInput = true
		},
		/* 单元格内容更改 */
		updTbCell(val) {
			this.testDatas[this.curRowIndex][this.edInput.tag] = this.edInput.val
		},
		updTbHeader(val) {
			let oldCol = this.testCols[this.curHeaderIndex]
			let newCol = this.edInput.val
			this.testDatas.forEach(p => { // 新增的对象无法被vue监听到
				this.$set(p, newCol, p[oldCol])
				delete p[oldCol]
			})
			this.testCols[this.curHeaderIndex] = this.edInput.val
		},
		/* 单元格右击 */
		cellRightClick(row, column, event) {
			this.rightClick(row, column, event)
		},
		/* 表头右击 */
		headerRightClick(column, event) {
			this.rightClick(null, column, event)
		},
		rightClick(row, column, event){
			this.showMenu = false
			window.event.returnValue = false; //阻止浏览器自带的右键菜单弹出
			if(column.index == null) return;
			this.curRowIndex = row ? row.row_index : null
			this.curColIndex = column.index
			let ele = document.getElementById('contextmenu')
			ele.style.top = event.clientY - 15 + 'px';
			ele.style.left = event.clientX - 15 + 'px';
			if(window.innerWidth - 140 < event.clientX) {
				ele.style.left = 'unset'
				ele.style.right = 0
			}
			this.showMenu = true
		},

		// 新增行
		addRow(idx, later) {
			this.showMenu = false
			if(idx == null) return;
			if(later) idx++;
			let obj = {}
			this.testCols.forEach(p => { obj[p] = '' })
			this.testDatas.splice(idx, 0, obj)
		},
		// 删除行
		delRow(){
			this.showMenu = false
			if(this.curRowIndex == null) return;
			this.testDatas.splice(this.curRowIndex, 1)
		},
		// 新增列
		addColumn(idx, later) {
			this.showMenu = false
			if(idx == null) return;
			if(later) idx++;
			let colStr = 'col_' + ++this.countCol
			this.testCols.splice(idx, 0, colStr)
			this.testDatas.forEach(p => { // 新增的对象无法被vue监听到
				this.$set(p, colStr, '')
				// p[colStr] = ''
			})
		},
		// 删除列
		delColumn() {
			this.showMenu = false
			let delCol = this.testCols[this.curColIndex]
			this.testCols.splice(this.curColIndex, 1)
			this.testDatas.map(p => { delete p[delCol] })
		},
		/* 打印表格数据 */
		consoleDatas() {
			console.log('表头',this.testCols.toString());
			console.log('数据', JSON.stringify(this.testDatas));
		}
	},
  // watch: {
  //   showMenu(newValue, oldValue) {
  //     if(!newValue) {
  //       this.curRowIndex = null
  //       this.curColIndex = null
  //     }
  //   }
  // },
}
</script>

<style scoped>
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
}
#contextmenu button {display: block;margin: 0 0 5px;}
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
	/* transition: border ease-in-out 0.15s,box-shadow ease-in-out 0.15s;
  -moz-transition:border ease-in-out 0.15s,box-shadow ease-in-out 0.15s;
  -webkit-transition:border ease-in-out 0.15s,box-shadow ease-in-out 0.15s; */
}
/* #editInput:before{
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: #fff;
    z-index: -1;
}

#editInput:after{
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: #fff;
    z-index: -2;
    filter: blur(40px);

}
#editInput:before,#editInput:after{background: linear-gradient(235deg,#89ff00,#060c21,#00bcd4);} */

</style>
