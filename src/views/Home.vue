<template>
  <div style="text-align:center;margin-top:30vh;line-height:2em;">
  	<router-link :to="{ name:'Editable' }">可编辑表格v1</router-link><br />
    <router-link :to="{ name:'EditableV2' }">可编辑表格v2</router-link><br />
  	<router-link :to="{ name:'Excel' }">Excel数据导入</router-link>
  </div>
</template>