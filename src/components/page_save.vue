<template>
  <div class="apollo-page">
    <div class="apollo-page-count">共{{page.count}}条</div>
    <div class="apollo-page-perpage">
      <span>每页展示</span>
      <input type="text" :value="perNum"/>条
    </div>
    <div class="apollo-page-list">
      <a class="apollo-page-list-first" @click="current = 1">第一页</a>
      <ul>
        <li @click="goPrePage" v-show="currentPage !=1">
          <a>prev</a>
        </li>
        <li v-for="index in showPageBtn" :class="{'current': index === currentPage}" @click="pageOffset(index)">
          <a v-if="index">{{index}}</a>
          <a v-else>...</a>
        </li>
        <li @click="goNextPage" v-show="currentPage!= totalPage">
          <a>next</a>
        </li>
      </ul>
      <a class="apollo-page-list-last" @click="">最后一页</a>
    </div>
    <div class="apollo-page-go">
      <span>跳转到</span>
      <input type="text" :model="num">
      <a>Go</a>
    </div>
  </div>
</template>
<script>
  let that
  export default {
    name: 'page',
    data () {
      that = this
      return {
        perNum: 5,
        num: 0,
        end_num: 0
      }
    },
    props: ['page'],
    computed: {
      offset () {
        return that.$store.state.offset
      },
      prePage () {
        return that.offset !== 0 && that.page.count
      },
      nextPage () {
        return (that.offset + that.perNum < that.page.count) && that.page.count
      },
      totalPage () {
        return Math.ceil(that.page.count / that.perNum)
      },
      currentPage () {
        return Math.ceil(that.offset / that.perNum) + 1
      },
      showPageBtn () {
        let pageNum = that.totalPage
        let index = that.currentPage
        let arr = []
        if (pageNum <= 5) {
          for (let i = 1; i <= pageNum; i++) {
            arr.push(i)
          }
          return arr
        }
        if (index <= 2) return [1, 2, 3, 0, pageNum]
        if (index >= pageNum - 1) return [1, 0, pageNum - 2, pageNum - 1, pageNum]
        if (index === 3) return [1, 2, 3, 4, 0, pageNum]
        if (index === pageNum - 2) return [1, 0, pageNum - 3, pageNum - 2, pageNum - 1, pageNum]
        return [1, 0, index - 1, index, index + 1, 0, pageNum]
      }
    },
    methods: {
      pageOffset (i) {
        if (i === 0 || i === that.currentPage) return
        that.$store.commit('GO_PAGE', (i - 1) * that.perNum)
        that.$emit('getNew')
      },
      goPrePage () {
        that.$store.commit('PRE_PAGE', that.perNum)
        that.$emit('getNew')
      },
      goNextPage () {
        that.$store.commit('NEXT_PAGE', that.perNum)
        that.$emit('getNew')
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../assets/less/component/page.less";
</style>
