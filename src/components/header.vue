<template>
  <div class="apollo-header">
    <div class="apollo-header-box">
      <div class="apollo-header-logo">
        <img src="../../static/img/logo.png" alt="">
        <span>Security Center</span>
      </div>
      <div class="apollo-header-nav">
        <nav>
          <ul>
            <li v-for="(item, index) in menus" @click="changePage(item, index)" :class="{current: current ===index}">
              <router-link :to="item.path" active-class="active">
                <span v-if="lang.current === 'en'">{{item.en}}</span>
                <span v-else class="apollo-header-cn">{{item.cn}}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="apollo-header-user">
        <div>
          <img src="../../static/img/headIcon.png" alt="">
          <span>{{userName}}</span>
        </div>
      </div>
      <div class="apollo-header-lang" @click="langChange">
        <div v-if="lang.current === 'cn'">
          <img :src="lang.cn.img" alt="">
          <span>{{lang.cn.name}}</span>
        </div>
        <div v-else>
          <img :src="lang.en.img" alt="">
          <span>{{lang.en.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data () {
      return {
        current: 0,
        curRoute: '',
        userName: 'baidu',
        lang: {
          current: 'en',
          cn: {
            name: 'English',
            img: '../../../static/img/china.png'
          },
          en: {
            name: '中文',
            img: '../../../static/img/china.png'
          }
        },
        menus: [
          {cn: '安全状态', en: 'State', path: '/', name: 'State'},
          {cn: '攻击详情', en: 'Intrusion', path: '/Intrusion', name: 'Intrusion'},
          {cn: '情报中心', en: 'Intelligence', path: '/Intelligence', name: 'Intelligence'},
          {cn: '车辆管理', en: 'VehicleManagment', path: '/VehicleManagment', name: 'VehicleManagment'},
          {cn: '通知记录', en: 'Notification', path: '/Notification', name: 'Notification'}
        ],
        childRouteName: [
          'whole', 'monitor', 'attack'
        ]
      }
    },
    created () {
      this.curRoute = this.$route.name
      let vehicle = this.childRouteName.indexOf(this.$route.name)

      if (vehicle === 0 || vehicle === 1 || vehicle === 2) {
        this.current = 3
      } else {
        this.menus.map((item, index) => {
          if (item.name === this.curRoute) {
            this.current = index
          }
        })
      }
    },
    methods: {
      langChange () {
        if (this.lang.current === 'en') {
          this.lang.current = 'cn'
        } else {
          this.lang.current = 'en'
        }
        this.$store.commit('langChange',this.lang.current)
      },
      changePage (item, index) {
        console.log(item.name)
        this.curRoute = item.name
        this.current = index
        this.$route.query.lang = this.lang.current
      }
    }
  }
</script>


<style scoped>
  @import "../assets/less/common.less";
</style>
