<template>
  <div style="text-align:center;margin-top:30vh;line-height:2em;">
  	<router-link :to="{ name:'Editable' }">可编辑表格-方案一(选项式API)</router-link><br />
    <router-link :to="{ name:'EditableV2' }">可编辑表格-方案二(选项式API)</router-link><br />
    <router-link :to="{ name:'EditableV2Setup' }">可编辑表格-方案二(组合式API)</router-link><br />
  	<router-link :to="{ name:'Excel' }">Excel导入/导出</router-link>
  </div>
</template>