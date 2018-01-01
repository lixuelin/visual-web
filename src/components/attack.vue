<template>
  <div>
    <div  class="apollo-vehicle-search">
      <div class="apollo-vehicle-search-set">
        <button type="button" class="apollo-btn apollo-btn-default" :class="{'apollo-btn-disabled': dataCheckLen === 0}" @click="magcar" :disabled="dataCheckLen===0">{{this.language.top[1]}}</button>
        <button type="button" class="apollo-btn apollo-btn-default" :class="{'apollo-btn-disabled': dataCheckLen === 0}" @click="baidu" :disabled="dataCheckLen===0">{{this.language.top[2]}}</button>
      </div>

      <div>
        <form action="" class="apollo-form">
          <div class="apollo-form-group">
            <label>{{this.language.label[0]}}</label>
            <div class="apollo-form-cont">
              <input type="text" v-model="carId">
            </div>
          </div>
          <div class="apollo-form-group">
            <label>{{this.language.label[1]}}</label>
            <input type="text" :value="values" @focus="focus_two" @blur="blur1">
            <div class="sele">
              <div class="select" v-show="shows">
                <ul class="uls" v-for="time in opt.options">
                  <li @click="val2(time)">{{time.values}}</li>
                </ul>
              </div>
              <b></b>
            </div>
          </div>
          <div class="apollo-form-group">
            <label>{{this.language.label[2]}}</label>
            <input type="text" :value="value" @focus="focus_tre" @blur="blur2">
            <div class="sele">
              <div class="select" v-show="show">
                <ul class="uls" v-for="time in opt.option">
                  <li @click="val3(time)">{{time.value}}</li>
                </ul>
              </div>
              <b></b>
            </div>
          </div>
          <div class="apollo-form-group">
            <div>
              <button class="apollo-btn apollo-btn-default" type="button" @click="chart_qurey_but">{{this.language.but[0]}}</button>
              <button class="apollo-btn apollo-btn-default" type="button" @click="reset_btn">{{this.language.but[1]}}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div>
      <table-view :tableData="intrudata" ref="tableAction" :method="method" :addser="addser" @addver="addver" @mag="mag"></table-view>
      <page-view :page="pageData" @pageOpt="pageOpt"></page-view>
    </div>
    <div class="alert" v-show="setadd">
      <div class="left"><img src="../../static/img/OK.png" alt=""></div>
      <div class="right">{{this.language.success[1]}}</div>
    </div>
    <div class="alert all" v-show="setrem">
      <div class="left"><img src="../../static/img/X.png" alt=""></div>
      <div class="right">{{this.language.fail[1]}}</div>
    </div>
    <div class="notice_car" v-show="altcomment">
      <div class="top">
        {{this.language.top[1]}}
        <span @click="remove"></span>
      </div>
      <div class="bottom">
        <div class="car_text">
          <div class="show">{{this.language.car[0]}}
            <p v-for="(item) in this.dataAll" style="display: inline-block">
              <b style="font-weight: normal">{{item+'、'}}</b>
            </p>{{i}}{{this.language.car[1]}}
          </div>
        </div>
        <div class="check">
          <div class="div_li">
            <div class="i_input">
              <input type="radio" id="t" name="radio" style="display: none" value="1" checked="true">
              <label for="t"><span></span></label>
            </div>
            <div class="i_text">{{this.language.c_radio[0]}}</div>
          </div>
          <div class="div_li">
            <div class="i_input">
              <input type="radio" id="m" name="radio" style="display: none" value="2">
              <label for="m"><span></span></label>
            </div>
            <div class="i_text">{{this.language.c_radio[1]}}</div>
          </div>
          <div class="div_li">
            <div class="i_input">
              <input type="radio" id="b" name="radio" style="display: none" value="3">
              <label for="b"><span></span></label>
            </div>
            <div class="i_text">{{this.language.c_radio[2]}}</div>
          </div>
        </div>
      </div>
      <div class="but" @click="meactrod">
        {{this.language.send[0]}}
      </div>
    </div>
    <div class="notice_car" v-show="altcom">
      <div class="top">
        {{this.language.top[2]}}
        <span @click="remove"></span>
      </div>
      <div class="bottom">
        <div class="show">{{this.language.car[0]}}
          <p v-for="(item) in this.dataAll" style="display: inline-block">
            <b style="font-weight: normal">{{item+'、'}}</b>
          </p>{{i}}{{this.language.car[1]}}
        </div>
        <div class="check">
          <div class="div_li">
            <div class="i_input">
              <input type="radio" id="bt" name="rad" style="display: none" value="1" checked="true">
              <label for="bt"><span></span></label>
            </div>
            <div class="i_text">{{this.language.b_radio[0]}}</div>
          </div>
          <div class="div_li">
            <div class="i_input">
              <input type="radio" id="bm" name="rad" style="display: none" value="2">
              <label for="bm"><span></span></label>
            </div>
            <div class="i_text">{{this.language.b_radio[1]}}</div>
          </div>
          <div class="div_li">
            <div class="i_input">
              <input type="radio" id="bb" name="rad" style="display: none" value="3">
              <label for="bb"><span></span></label>
            </div>
            <div class="i_text">{{this.language.b_radio[2]}}</div>
          </div>
        </div>
      </div>
      <div class="but" @click="meactrodBai">
        {{this.language.send[0]}}
      </div>
    </div>
  </div>

</template>

<script>
  import table from '../components/table'
  import page from '../components/page'
  export default {
    name: 'monitor',
    data () {
      return {
        lang: '',
        language: {},
        en: {
          top: ['Add to Monitored', 'Notify Vehicles', 'Contact Baidu'],
          but: ['Search', 'Reset'],
          label: ['Vehicle ID', 'Vehicle Type', 'Version'],
          success: ['Add to Monitored Vehicles Successfully', 'Send Successfully'],
          fail: ['Fail to add, please retry latter.', 'Fail to send, please retry latter.'],
          car: ['Concerned Vehicles ：', 'Vehicles', 'All'],
          c_radio: ['Sent update notice', 'Forced to update Notice', 'Temporary functionality limited'],
          b_radio: ['Request assistance', 'Request to separate', 'Abnormal data，request verification'],
          send: ['Send'],
          list: ['Vehicle Information', 'Monitored Vehicles', 'Attacked Vehicles'],
          theadData: [
            {
              type: 'check'
            },
            {
              type: '',
              name: 'Vehicle ID'
            },
            {
              type: '',
              name: 'Vehicle Type'
            },
            {
              type: '',
              name: 'Version'
            },
            {
              type: 'sort',
              name: 'Latest Connection Time'
            },
            {
              type: 'safeType',
              name: 'Security Status'
            },
            {
              type: 'isSet',
              name: 'Operation'
            }
          ]
        },
        cn: {
          top: ['加入监控', '通知车辆', '联系百度'],
          but: ['查询', '重置'],
          label: ['车辆ID', '筛选车型', '筛选版本'],
          success: ['已加入监控车辆名单。', '发送成功！'],
          fail: ['加入失败，请稍候再试。', '发送失败，请稍候再试。'],
          car: ['涉及相关车辆：', '辆车', '查看全部'],
          c_radio: ['推送更新提醒', '强制升级系统提醒', '部分功能暂时禁用提醒'],
          b_radio: ['请求援助', '请求隔离处理', '数据异常，等待处理'],
          send: ['发送'],
          theadData: [
            {
              type: 'check'
            },
            {
              type: '',
              name: '车辆ID'
            },
            {
              type: '',
              name: '车型'
            },
            {
              type: '',
              name: '版本'
            },
            {
              type: 'sort',
              name: '最近连接时间'
            },
            {
              type: 'safeType',
              name: '安全状态'
            },
            {
              type: 'isSet',
              name: '操作'
            }
          ]
        },
        dataAll: [],
        shows: false,
        show: false,
        addcomment: false,
        setadd: false,
        remcomment: false,
        setrem: false,
        altcomment: false,
        altcom: false,
        i: '',
        cardata: '',
        tabData: {
          list: [
            '整体车辆情况', '监控车辆名单', '被攻击车辆名单'
          ]
        },
        addser: {
          remurl: 'http://localhost:3000/putDataIntoAssist',
          baiurl: 'http://localhost:3000/putDataIntoRelationbd'
        },
        opt: {
          options: [{
            values: 'BDT0021'
          }, {
            values: 'BDTCX20'
          }, {
            values: 'BDT0A6L'
          }, {
            values: 'BDT00Q5'
          }, {
            values: 'BDT00E5'
          }, {
            values: 'BDT00TX'
          }, {
            values: 'BDT00EQ'
          }, {
            values: 'BDT0EQ1'
          }, {
            values: 'BDT00V5'
          }, {
            values: 'BDT00V3'
          }, {
            values: 'BDTCS35'
          }, {
            values: 'BDTCS55'
          }, {
            values: 'BDTCS75'
          }, {
            values: 'BDTC90EV'
          }, {
            values: 'BDTET400'
          }, {
            values: 'BDT00ES210'
          }],
          option: [{
            value: 'ASEC1.0'
          }, {
            value: 'ASEC1.1'
          }, {
            value: 'ASEC1.2'
          }, {
            value: 'ASEC1.3'
          }, {
            value: 'ASEC1.4'
          }, {
            value: 'ASEC1.5'
          }]
        },
        value: '',
        values: '',
        carId: '',
        carClass: '所有类型',
        carVersion: '所有版本',
        pageData: {
          count: 0,
          perPage: 10,
          currentPage: 1
        },
        intrudata: {
          isCheck: true,
          isSet: true,
          tbodyData: [],
          theadData: [
            {
              type: 'check'
            },
            {
              type: '',
              name: '车辆ID'
            },
            {
              type: '',
              name: '车型'
            },
            {
              type: '',
              name: '版本'
            },
            {
              type: 'sort',
              name: '最近连接时间'
            },
            {
              type: 'safeType',
              name: '安全状态'
            },
            {
              type: 'isSet',
              name: '操作'
            }
          ],
          set: {
            detail: true,
            add: true,
            remove: true
          }
        },
        dataCheckLen: 0,
        r: 1
      }
    },
    mounted () {
      this.lang = this.$store.state.lang
      if (this.lang === 'en') {
        this.language = this.en
        this.intrudata.theadData = this.language.theadData //th替换
      } else {
        this.language = this.cn
        this.intrudata.theadData = this.language.theadData //th替换
      }
      this.getIntrusionCarList()
    },
    watch: {
      getLanguage (newVal, oldVal ) {//监控语言切换  重新请求数据
        this.lang = newVal
        if ('cn' == this.lang) {//请求中文
          this.language = this.cn
          this.intrudata.theadData = this.language.theadData //th替换
        }
        if ('en' == this.lang) {//请求英文
          this.language = this.en
          this.intrudata.theadData = this.language.theadData //th替换
        }
        this.getIntrusionCarList()
      }
    },
    computed: {
      getLanguage () {
        return this.$store.state.lang
      }
    },
    methods: {
      getIntrusionCarList () {
        this.$http.get('http://localhost:3000/getIntrusionCarList?language=' + this.lang, {
          params: {
            perpage: this.pageData.perPage,
            currentPage: this.pageData.currentPage,
            car_id: this.carId,
            vehicle_model: this.values,
            version: this.value,
            order: this.r
          }
        }).then(response => {
          let data = response.data
          this.pageData.count = data.count
          var tr = []
          data.data.forEach(function (val) {
            const trData = {
              time: val.uuid,
              ip: val.vehicle_model,
              level: val.version,
              part: val.lastime,
              status: val.status
            }
            tr.push(trData)
          })
          this.intrudata.tbodyData = tr
        }, response => {})
      },
      chart_qurey_but () {
        this.pageData.currentPage = 1
        this.getIntrusionCarList()
      },
      method: function () {
        if (this.r === 0) {
          this.r = 1
          this.getIntrusionCarList()
        } else {
          this.r = 0
          this.getIntrusionCarList()
        }
      },
      pageOpt: function (data) {
        this.$refs.tableAction.checkList = []
        this.$refs.tableAction.removeCheck()
        this.pageData.perPage = data.perpage
        this.pageData.currentPage = data.currentPage
        this.getIntrusionCarList()
      },
      magcar () {
        var car = this.dataAll
        if (car.length !== 0) {
          this.altcomment = true
          this.cardata = this.dataAll
        } else {
          var that = this
          that.setrem = true
          function time () {
            that.setrem = false
          }
          setTimeout(time, 1000)
        }
      },
      baidu () {
        var car = this.dataAll
        if (car.length !== 0) {
          this.altcom = true
          this.cardata = this.dataAll
        } else {
          var that = this
          that.setrem = true
          function time () {
            that.setrem = false
          }
          setTimeout(time, 1000)
        }
      },
      remove: function () {
        this.altcomment = false
        this.altcom = false
      },
      meactrod: function () {
        var obj = document.getElementsByName('radio')
        var con = null
        var car = this.cardata.toString()
        console.log(car)
        for (var k in obj) {
          if (obj[k].checked) {
            con = obj[k].value
          }
        }
        this.$http.post(this.addser.remurl, {uuids: car, detail: con})
          .then((res) => {
            var that = this
            that.setadd = true
            function time () {
              that.$refs.tableAction.checkList = []
              that.$refs.tableAction.removeCheck()
              that.setadd = false
            }
            setTimeout(time, 1000)
          }, response => {
            var that = this
            that.remcomment = true
            function time () {
              that.remcomment = false
            }
            setTimeout(time, 1000)
          })
        this.altcomment = false
      },
      meactrodBai: function () {
        var obj = document.getElementsByName('rad')
        var con = null
        var car = this.cardata.toString()
        for (var k in obj) {
          if (obj[k].checked) {
            con = obj[k].value
          }
        }
        this.$http.post(this.addser.baiurl, {uuids: car, detail: con})
          .then((res) => {
            var that = this
            that.setadd = true
            function time () {
              that.$refs.tableAction.checkList = []
              that.$refs.tableAction.removeCheck()
              that.setadd = false
            }
            setTimeout(time, 1000)
          }, response => {
            var that = this
            that.remcomment = true
            function time () {
              that.remcomment = false
            }
            setTimeout(time, 1000)
          })
        this.altcom = false
      },
      addver: function (data) {
        var showcar = []
        if (data[1] === 2) {
          var car = []
          car.push(data[0])
          this.$http.post(this.addser.addurl, {carIdArr: car})
            .then((res) => {
              var that = this
              that.addcomment = true
              function time () {
                that.addcomment = false
              }
              setTimeout(time, 1000)
            }, response => {
              var that = this
              that.remcomment = true
              function time () {
                that.remcomment = false
              }
              setTimeout(time, 1000)
            })
        } else if (data[1] === 3) {
          var carId = data[0]
          showcar.push(carId)
          this.dataAll = showcar
          this.i = showcar.length
          this.cardata = carId
          this.altcom = true
        } else if (data[1] === 4) {
          var carId = data[0]
          showcar.push(carId)
          this.dataAll = showcar
          this.i = showcar.length
          this.cardata = carId
          this.altcomment = true
        }
      },
      mag: function (data) {
        if (data) {
          var All = []
          data.forEach(function (val) {
            All.push(val.time)
          })
          this.dataAll = All
          this.i = All.length
          this.dataCheckLen = data.length
        }
      },
      focus_two () {
        this.shows = true
        this.values = ''
      },
      focus_tre () {
        this.show = true
        this.value = ''
      },
      val2 (time) {
        this.values = time.values
        this.shows = false
      },
      val3 (time) {
        this.value = time.value
        this.show = false
      },
      input_false2 () {
        this.show = false
      },
      input_false1 () {
        this.shows = false
      },
      blur2 () {
        setTimeout(this.input_false2, 300)
      },
      blur1 () {
        setTimeout(this.input_false1, 300)
      },
      reset_btn () {
        this.values = ''
        this.value = ''
        this.carId = ''
      }
    },
    components: {
      'tableView': table,
      'pageView': page
    }
  }
</script>

<style scoped lang="less">
  @import url('../assets/less/vehicle.less');
</style>
