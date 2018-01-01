<template>
  <ul class="apollo-tab">
    <span>{{tabList.url}}</span>
    <li v-for="(item,index) in tabList.list" :class="{'current': current===index}" @click="tabClick(item,index)">
      <span>{{item}}</span>
    </li>
  </ul>
</template>
<script>
  export default {
    name: 'tab',
    data () {
      return {
        current: 0
      }
    },
    props: ['tabList'],
    methods: {
      tabClick: function (item, index) {
        this.current = index
        this.$http.get(this.tabList.url, {
          params: {
            id: item.id
          }
        }).then((res) => {
          this.$emit('parent', res.data)
        })
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../assets/less/component/tab.less";
</style>
