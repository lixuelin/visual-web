<template>
  <ul class="apollo-intel-list">
    <li v-for="item in listData">
      <div class="apollo-intel-list-head">
        <div class="apollo-intel-list-head-column"><span>编号</span> {{item.id}}</div>
        <div class="apollo-intel-list-head-column"><span>影响版本</span> {{item.version}}</div>
        <div class="apollo-intel-list-head-column"><span>危害程度</span> {{item.danger}}</div>
        <div class="apollo-intel-list-head-column">{{item.time}}</div>
      </div>
      <div class="apollo-intel-list-cont">
        <p>介绍：</p>
        <p>{{item.detail}}</p>
      </div>
      <div class="apollo-intel-list-cont">
        <p>介预防建议：</p>
        <p>{{item.defend}}</p>
      </div>
    </li>
  </ul>
</template>
<script>
  export default{
    name: 'intel',
    props: ['listData']
  }
</script>
<style scoped lang="less">
  @import url('../assets/less/component/intel.less');
</style>

