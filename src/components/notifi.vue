<template>
  <ul class="apollo-notifi-list">
    <li v-for="item in listData">
      <div class="apollo-notifi-list-head">
        <div class="apollo-notifi-list-head-column">{{item.title}}</div>
        <div class="apollo-notifi-list-head-column">{{item.time}}</div>
      </div>
      <div class="apollo-notifi-list-cont">
        <span v-for="car in item.cars">{{car}}</span>
      </div>
    </li>
  </ul>
</template>
<script>
  export default {
    name: 'notifi',
    props: ['listData']
  }
</script>
<style scoped lang="less">
  @import "../assets/less/component/notifi.less";
</style>
