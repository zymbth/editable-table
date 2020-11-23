<template>
  <div id="excel">
  	<h2>Excel数据导入测试</h2>
  	<el-upload
		class="upload-excel"
		action=""
		:multiple="false"
		:show-file-list="false"
		:http-request="httpRequest"
		accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
		<el-button size="small" type="primary">Excel导入数据</el-button>
	</el-upload>

	<!--表一：简单展示数据-->
	<div class="review-list">
		<h4>Excel数据显示</h4>
		<div class="upload-btns">
	  		<el-popconfirm title="确定重置吗？" @onConfirm="clearExcelTable1">
				<el-button slot="reference" type="primary" size="small">重置</el-button>
			</el-popconfirm>
			<el-button type="primary" size="small" @click="printData1">打印数据</el-button>
		</div>
			<el-table :data="tableData1" border style="width: 100%;margin-top:10px">
				<el-table-column v-if="tableData1.length > 0" type="index" :label="'编号'" :width="50"></el-table-column>
			<el-table-column v-for="(col, idx) in tableCols1" :key="idx" :prop="col" :label="col">
			</el-table-column>
		</el-table>
    </div>

		<!--表二：展示并可编辑数据-->
  	<div class="review-list">
	  	<h4>Excel数据显示并编辑</h4>
	  	<div class="upload-btns">
	  		<el-popconfirm title="确定重置吗？" @onConfirm="clearExcelTable">
					<el-button slot="reference" type="primary" size="small">重置</el-button>
				</el-popconfirm>
				<el-button type="primary" size="small" @click="printData">打印数据</el-button>
				<el-button type="primary" size="small" @click="formExcelData">导出Excel</el-button>
	  	</div>
			<!--导入excel数据-->
			<el-table :data="tableData" border style="width: 100%;margin-top:10px">
				<el-table-column v-if="tableData.length > 0" type="index" :label="'编号'" :width="50"></el-table-column>
	      <el-table-column v-for="(col, idx) in tableCols" :key="idx">
	      	<template slot="header" slot-scope="scope1">
	      		<p v-show="tableCols[idx].show" @dblclick="tableCols[idx].show=false">{{col.txt}} 
	      			<i class="el-icon-edit-outline" @click="tableCols[idx].show=false"></i></p><!--tableCols[idx].show=false-->
	      		<el-input size="mini" v-show="!tableCols[idx].show" v-model="tableCols[idx].txt" @blur="tableCols[idx].show=true"></el-input>
		      </template>
	      	<template slot-scope="scope">
	      		<p v-show="scope.row[col.col].show" @dblclick="scope.row[col.col].show=false">{{scope.row[col.col].content}} 
	      			<i class="el-icon-edit-outline" @click="scope.row[col.col].show=false"></i></p>
	      		<el-input type="textarea" :autosize="{minRows:2,maxRows:4}" v-show="!scope.row[col.col].show"
	      			v-model="scope.row[col.col].content" @blur="scope.row[col.col].show=true"></el-input>
	      	</template>
	      </el-table-column>
	    </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    	tableData: [], // excel数据
    	tableCols: [], // excel表头
    	tableData1: [],
    	tableCols1: [],
		}
	},
	methods: {
		/*导入excel*/
		httpRequest(e) {
			this.clearExcelTable();
			var _this = this;
			var rABS = false; //是否将文件读取为二进制字符串
			let f = e.file // 文件信息
			if(!f) return false;
			else if(!/\.(xls|xlsx)$/.test(f.name.toLowerCase())) {
				this.$message.error('上传格式不正确，请上传xls或者xlsx格式')
				return false
			}
		
			var reader = new FileReader();
			FileReader.prototype.readAsBinaryString = function(f) {
				var binary = "";
				var rABS = false; //是否将文件读取为二进制字符串
				var wb; //读取完成的数据
				var outdata;
				var reader = new FileReader();
				reader.onload = function(e) {
					var bytes = new Uint8Array(reader.result);
					var length = bytes.byteLength;
					for(var i = 0; i < length; i++) binary += String.fromCharCode(bytes[i]);
					// var XLSX = require('xlsx');
					var XLSX = _this.$XLSX
					if(rABS) wb = XLSX.read(btoa(fixdata(binary)), {type: 'base64'}); //手动转化
					else wb = XLSX.read(binary, { type: 'binary' });
					outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {defval: ''}); //outdata的格式可打印了自行查看
					// 以下是对outdata的格式化，可按个人需要自行转换
					_this.formDatasWithShow(outdata);
					_this.formDatas(outdata);
				}
				reader.readAsArrayBuffer(f);
			}
			if(rABS) reader.readAsArrayBuffer(f);
			else reader.readAsBinaryString(f);
		},
		/*数据自定义格式化*/
		formDatasWithShow(outdata) {
			var _this = this;
			outdata.map((p, idx)=> {
				var obj = {}
				for(var x in p) {
					if(p.hasOwnProperty(x)) {
						obj[x] = {'content': p[x], 'show': true}
						if(idx == 0) _this.tableCols.push({'col': x, 'txt':x, 'show': true});
					}
				}
				_this.tableData.push(obj)
			})
//			console.log(_this.tableCols);
//			console.log(_this.tableData);
		},
		formDatas(outdata) {
			var _this = this;
			outdata.map((p, idx)=> {
				var obj = {}
				for(var x in p) {
					if(p.hasOwnProperty(x)) {
						obj[x] = p[x];
						if(idx == 0) _this.tableCols1.push(x);
					}
				}
				_this.tableData1.push(obj)
			})
//			console.log(_this.tableCols1);
//			console.log(_this.tableData1);
		},
		/*清楚数据*/
		clearExcelTable() { // 清空Excel表格数据
			this.tableCols = []
			this.tableData = []
		},
		clearExcelTable1() { // 清空Excel表格数据
			this.tableCols1 = []
			this.tableData1 = []
		},
		/*打印数据*/
		printData() {
			console.log('表头', this.tableCols);
			console.log('数据', this.tableData);
		},
		printData1() {
			console.log('表头', this.tableCols1);
			console.log('数据', this.tableData1);
		},
		/*导出excel数据*/
		formExcelData() {
			var tCols = [], tColsTemp = [], tDatas = [];
			this.tableCols.forEach(p => {
				tColsTemp.push(p.col);
				tCols.push(p.txt);
			})
			this.tableData.forEach(p => {
				var temp = [];
				tColsTemp.forEach(p1 => {
					temp.push(p[p1].content);
				})
				tDatas.push(temp);
			})
			this.getExcel(tCols, tDatas);
		},
		getExcel(tCols, tDatas){
      //列标题
      var str = '<tr>';
      tCols.forEach(p => {
      	str += `<td>${p}</td>`;
      })
      str += '</tr>';
      //循环遍历，每行加入tr标签，每个单元格加td标签
      for(let i = 0 ; i < tDatas.length ; i++ ){
        str+='<tr>';
        tDatas[i].forEach(p => {
        	str+=`<td>${p + '\t'}</td>`; //增加\t为了不让表格显示科学计数法或者其他格式
        })
        str+='</tr>';
      }
      //Worksheet名
      var worksheet = 'Sheet1'
      var uri = 'data:application/vnd.ms-excel;base64,';
 
      //下载的表格模板数据
      var template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:x="urn:schemas-microsoft-com:office:excel" 
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`;
      //下载模板
      window.location.href = uri + this.base64(template)
		},
		//输出base64编码
		base64 (s) { return window.btoa(unescape(encodeURIComponent(s))) }
	},
	created() {
	},
}</script>

<style scoped>
#excel h4 {margin: 0 auto;}
#excel h2 {margin: 20px auto 0;}
.review-list {
	position: relative;
	font-size: 16px;
	width: 100%;
	overflow-x: hidden;
	display: inline-block;
	background-color: #c8e5ff;
	margin: 0 0 10px;
	padding: 15px;
	box-sizing: border-box;
	border-radius: 10px;
	text-align: left;
}
.upload-btns {
	position: absolute;
	top: 10px;
	right: 15px;
	width: 300px;
	text-align: right;
}
.upload-btns button {display: inline-block;}
.upload-excel {
	max-width: 130px;
	display: inline-block;
	float: right;
	padding-bottom: 10px;
}
</style>
