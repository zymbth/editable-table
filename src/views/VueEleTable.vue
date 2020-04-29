<template>
  <div id="hello">	
		<h4 style="display: inline-block;margin:0;">测试表</h4>
		<div style="display: inline-block;float: right;">
			<el-button size="mini" type="primary" @click="consoleDatas">打印数据</el-button>
			<el-button size="mini" type="primary" @click="addRow">增加行</el-button>
			<el-popconfirm title="确定删除最后行吗？" @onConfirm="delLastRow">
				<el-button slot="reference" type="primary" size="mini">删除末行</el-button>
			</el-popconfirm>
		</div>
<el-table :data="testDatas" border style="width: 100%;margin-top:10px" @header-contextmenu="colRightClick">
	<el-table-column v-if="testCols.length > 0" type="index" :label="'编号'" :width="50"></el-table-column>
  <el-table-column v-for="(column, idx) in testCols" :key="idx" :index="idx">
		<!--label-->
  	<template slot="header" slot-scope="scope1">
  		<p v-show="column.show" @dblclick="column.show=false">
  			{{column.txt}} 
  			<i class="el-icon-edit-outline" @click="column.show=false"></i>
  		</p>
  		<el-input
  			size="mini"
  			v-show="!column.show"
  			v-model="column.txt"
  			@blur="column.show=true">
  		</el-input>
    </template>
		<!--prop-->
  	<template slot-scope="scope">
  		<p v-show="scope.row[column.col].show" @dblclick="scope.row[column.col].show=false">
  			{{scope.row[column.col].content}} 
  			<i class="el-icon-edit-outline" @click="scope.row[column.col].show=false"></i>
  		</p>
  		<el-input type="textarea" :autosize="{minRows:2,maxRows:4}"
  			v-show="!scope.row[column.col].show"
  			v-model="scope.row[column.col].content"
  			@blur="scope.row[column.col].show=true">
  		</el-input>
  	</template>
  </el-table-column>
</el-table>

		<div v-show="showMenu" id="contextmenu">
			<i class="el-icon-circle-close hideContextMenu" @click="showMenu=false"></i>
			<el-button size="mini" type="primary" @click="addColumn(curColumn)">前方插入一列</el-button>
			<el-button size="mini" type="primary" @click="addColumn(curColumn+1)">后方插入一列</el-button>
			<el-popconfirm title="确定删除该列吗？" @onConfirm="delColumn">
				<el-button slot="reference" type="primary" size="mini">删除当前列</el-button>
			</el-popconfirm>
		</div>

  </div>
</template>

<script>
export default {
 name: 'demo',
  data(){
	 return{
			testCols: [
				{col: "name", txt: 'name', show: true},
				{col: "age", txt: 'age', show: true},
				{col: "city", txt: 'city', show: true},
				{col: "tel", txt: 'tel', show: true}
			],
			testDatas: [{
					name: {content: '张三', show: true},
					age: {content: 24, show: true},
					city: {content: '广州', show: true},
					tel: {content: '13312345678', show: true}
				},{
					name: {content: '李四', show: true},
					age: {content: 25, show: true},
					city: {content: '九江', show: true},
					tel: {content: '18899998888', show: true}
				}
			],
			count_col: 0,
			showMenu: false,
			curColumn: null,
	 }
  },
	methods:{
		colRightClick(column,event) {
			window.event.returnValue = false; //阻止浏览器自带的右键菜单弹出
			if(!column.index && column.index !== 0) return;
			this.curColumn = column.index
			this.showMenu = true
			var ele = document.getElementById('contextmenu')
			ele.style.top = event.clientY + 'px';
			ele.style.left = event.clientX + 'px';
			if(window.innerWidth - 140 < event.clientX) {
				ele.style.left = 'unset'
				ele.style.right = 0
			}
		},
		addRow() { // 新增行
			this.showMenu = false
			var obj = {}
			this.testCols.map(p => {
				obj[p.col] = {content: '', show: true}
			})
			this.testDatas.push(obj)
		},
		// 当row中存在一“主键”可唯一标识row的下标时（如：编号放在testDatas内），可借此实现行的自由插入与删除
		addColumn(idx) { // 新增列
			this.showMenu = false
			var obj = {col: 'col_' + this.count_col++, txt: '', show: true}
			if(idx || idx === 0) this.testCols.splice(idx, 0, obj);
			else this.testCols.push(obj);
			var _this = this
			this.testDatas.map(p => { // 新增的对象无法被vue监听到
				_this.$set(p, obj.col, {content: '', show: true})
//				p[obj.col] = {content: '', show: true}
			})
		},
		delColumn() { // 删除列
			this.showMenu = false
			var colKey = this.testCols[this.curColumn].col;
			this.testCols.splice(this.curColumn, 1);
			this.testDatas.map(p => {
				delete p[colKey];
			});
		},
		delLastRow() { // 删除行
			this.showMenu = false
			var len = this.testDatas.length;
			if(len > 0) this.testDatas.splice(len - 1, 1);
			else this.$message.error('没有可删除行');
		},
		consoleDatas() {
			console.log('表头',this.testCols);
			console.log('数据',this.testDatas);
		}
	}
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
</style>
