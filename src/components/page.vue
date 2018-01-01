<template>
  <div class="apollo-page">
    <div class="apollo-page-count">{{changeLang.curLang.all}} {{page.count}} {{changeLang.curLang.strip}}</div>
    <div class="apollo-page-perpage">
      <span>{{changeLang.curLang.perpage}}</span>
      <input type="text" ref="perpage" :value="perpage" @change="goPerpage" />{{changeLang.curLang.strip}}
    </div>
    <div class="apollo-page-list">
      <a class="apollo-page-list-first" @click="gotoFirst">{{changeLang.curLang.first}}</a>
      <ul>
        <li @click="goPrevPage" v-show="currentPage !=1">
          <a><</a>
        </li>
        <li v-for="index in showPageBtn" :class="{'current': index === currentPage}" @click="goPage(index)">
          <a v-if="index">{{index}}</a>
          <a v-else>...</a>
        </li>
        <li @click="goNextPage" v-show="currentPage!= totalPage">
          <a>></a>
        </li>
      </ul>
      <a class="apollo-page-list-last" @click="gotoLast">{{changeLang.curLang.last}}</a>
    </div>
    <div class="apollo-page-go">
      <span>{{changeLang.curLang.goto}}</span>
      <input type="text" ref="num" :value="num">
      <a v-on:click="goLinkPage">Go</a>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'page',
    data () {
      return {
        currentPage: this.page.currentPage,
        perpage: this.page.perPage,
        num: 1,
        lang: this.$store.state.lang,
        option: {
          perpage: 10,
          currentPage: this.currentPage,
        },
        changeLang: {
          en: {
            all: 'All',
            strip: 'items',
            perpage: 'one page',
            first: 'First',
            last: 'Last',
            goto: 'Jump To'
          },
          cn: {
            all: '共',
            strip: '条',
            perpage: '每页展示',
            first: '第一页',
            last: '最后一页',
            goto: '跳转到'
          },
          curLang: {}
        }
      }
    },
    props: ['page'],
    computed: {
      langChange () {
        return this.$store.state.lang
      },
      totalPage () {
        return Math.ceil(this.page.count / this.perpage)
      },
      curPage () {
        return this.currentPage = this.page.currentPage
      },
      showPageBtn () {
        let pageNum = this.totalPage
        let index = this.currentPage
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
    mounted () {
      console.log(this.page)
      if ('cn' === this.lang) {
        this.changeLang.curLang = this.changeLang.cn
      } else {
        this.changeLang.curLang = this.changeLang.en
      }
    },
    methods: {
      gotoFirst () {
        this.currentPage = 1
        this.setOpt()
      },
      gotoLast () {
        this.currentPage = this.totalPage
        this.setOpt()
      },
      goPerpage () {
        let perpage = this.$refs.perpage.value
        if (isNaN(perpage) || Number(this.$refs.perpage.value) === 0) {
          console.log('输入错误')
          this.$refs.perpage.value = 10
          this.perpage = 10
        } else {
          if (perpage >= 200) {
            this.$refs.perpage.value = 200
            this.perpage = 200
          } else {
            this.perpage = perpage
          }
        }
        this.setOpt()
      },
      goPage (index) {
        if (index === 0) {
          return
        }
        this.currentPage = index
        this.setOpt()
      },
      goPrevPage () {
        this.currentPage --
        this.setOpt()
      },
      goNextPage () {
        this.currentPage ++
        this.setOpt()
      },
      goLinkPage () {
        let index = Number(this.$refs.num.value)
        if (isNaN(index)) {
          this.$refs.num.value = 1
          index = 1
        }

        if (Number(this.$refs.num.value) === 0 || Number(this.$refs.num.value) > this.totalPage) {
          this.$refs.num.value = 1
          index = 1
        }

        this.goPage(index)
      },
      setOpt () {
        this.option = {
          currentPage: this.currentPage,
          perpage: Number(this.perpage)
        }
        this.$emit('pageOpt', this.option)
      }
    },
    watch: {
      langChange (val, oldVal) {
        this.lang = val
        if ('cn' === this.lang) {
          this.changeLang.curLang = this.changeLang.cn
        } else {
          this.changeLang.curLang = this.changeLang.en
        }
      },
      curPage (val) {
        this.currentPage = val
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../assets/less/component/page.less";
</style>
