<template>
  <div class="apollo-vehicle">
    <div class="apollo-wrap">
      <div>
        <ul class="apollo-tab">
          <li :class="{'current': current===0}" @click="current=0"><router-link to="/VehicleManagment">{{this.list[0]}}</router-link></li>
          <li :class="{'current': current===1}" @click="current=1"><router-link to="/VehicleManagment/monitor">{{this.list[1]}}</router-link></li>
          <li :class="{'current': current===2}" @click="current=2"><router-link to="/VehicleManagment/attack">{{this.list[2]}}</router-link></li>
        </ul>
        <div class=""></div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VehicleManagment',
    data () {
      return {
        lang: '',
        language: {},
        en: {
          list: ['Vehicle Information', 'Monitored Vehicles', 'Attacked Vehicles']
        },
        cn: {
          list: ['整体车辆情况', '监控车辆名单', '被攻击车辆名单']
        },
        current: 0,
        index: '',
        list: ['整体车辆情况', '监控车辆名单', '被攻击车辆名单'],

      }
    },
    mounted () {
      this.lang = this.$store.state.lang
      this.language = this.en
      if ('cn' === this.lang) {
        this.language = this.cn
        this.list = this.language.list
      } else {
        this.language = this.en
        this.list = this.language.list
      }
      this.routeChange()
    },
    methods: {
      routeChange () {
        console.log(this.$route.name)
        if (this.$route.name === 'whole') {
          this.current = 0
        }
        if (this.$route.name === 'monitor') {
          this.current = 1
        }
        if (this.$route.name === 'attack') {
          this.current = 2
        }
      }
    },
    watch: {
      getLanguage (newVal, oldVal) {
        this.lang = newVal
        if ('cn' == this.lang) {
          this.language = this.cn
          this.list = this.language.list
        }
        if ('en' == this.lang) {
          this.language = this.en
          this.list = this.language.list
        }
      },
      '$route': 'routeChange'
    },
    computed: {
      getLanguage () {
        return this.$store.state.lang
      }
    }
  }
</script>

<style scoped lang="less">
  @import url('../assets/less/vehicle.less');
  @import url('../assets/less/component/tab.less');
</style>
<style>
  .el-select-dropdown{
    background: #000;
    border: 1px solid #000000;
  }
  .el-popper[x-placement^=top] .popper__arrow, .el-popper[x-placement^=top] .popper__arrow::after{
    border-top-color: #000;
  }
  .el-popper[x-placement^=bottom] .popper__arrow, .el-popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color: #000;
  }
  .el-select__caret{
    display: none;
  }

  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
    background: #3A6098;
    color: #FFFFFF;
  }

  .el-select:hover .el-input__inner{
    border-bottom: 1px solid #3a6089;
  }
</style>
