<template>
  <div class="apollo-wrap">
    <div id="hoverDiv" :class="{hide: !svgData.isShow ,show: svgData.isShow}">
      {{svgData.currentHoverData.zh_cn}}: {{svgData.currentHoverData.attack_num}}
    </div>
    <div class="head">
      <div class="left">
        <form action="">
          <button :class="{p_add: curBtn ===0}" @click="mouth6()" type="button">{{this.language.mouth[0]}}</button>
          <button :class="{p_add: curBtn===1}" @click="mouth3()" type="button">{{this.language.mouth[1]}}</button>
          <button :class="{p_add: curBtn ===2}" @click="mouth1()" type="button">{{this.language.mouth[2]}}</button>
        </form>
      </div>
      <div class="right">
        <form>
          <div class="data_frst">
            <label>{{this.language.data_last[0]}}</label>
            <b></b>
            <div class="block begin_data" style="">
              <el-date-picker
                v-model="value1"
                type="date"
                placeholder="">
              </el-date-picker>
            </div>
          </div>
          <div class="data_last">
            <label>{{this.language.data_last[1]}}</label>
            <b></b>
            <div class="block input_data">
              <el-date-picker
                v-model="value2"
                type="date"
                placeholder="">
              </el-date-picker>
            </div>
          </div>
          <div class="but_but">
            <button @click="chart_qurey" type="button" class="but_but_cx">{{this.language.but[0]}}</button>
            <button class="but_but_cx" type="reset">{{this.language.but[1]}}</button>
          </div>
        </form>
      </div>
    </div>
    <div class="chart">
      <div id="chart_one"></div>
      <div id="chart_two"></div>
      <div class="car_Bubble">
        <div id="chart_str" class="chart_str"></div>
        <div class="pageContent" v-show="sblin">
          <div id="svgOuter">
            <svg id="svg1" class="svg1 car_bg">
              <!-- 鼠标悬停时的透明度圆 -->
              <circle id="topCircle" :cx="svgData.coverCircle.cx" :cy="svgData.coverCircle.cy" :r="svgData.coverCircle.r"
                      :fill="svgData.coverCircle.fill" :fill-opacity="svgData.coverCircle.fillOpacity"/>

              <!-- 车脑控制单元 -->
              <circle id="circle2" cx="61" cy="130" :r="svgData.Arr[3]" :fill="svgData.colorArr[3]"
                      v-on:mouseover="handleSvgShow($event,'2')" v-on:mouseout="handleSvgHide"/>
              <!-- IVI -->
              <circle id="circle3" cx="138" cy="130" :r="svgData.Arr[5]" :fill="svgData.colorArr[5]" v-on:mouseover="handleSvgShow($event,'5')"
                      v-on:mouseout="handleSvgHide"/>
              <!-- TBOX -->
              <circle id="circle4" cx="148" cy="104" :r="svgData.Arr[0]" :fill="svgData.colorArr[0]" v-on:mouseover="handleSvgShow($event,'9')"
                      v-on:mouseout="handleSvgHide"/>
              <!-- CAN总线 -->
              <circle id="circle5" cx="156" cy="104" :r="svgData.Arr[4]" :fill="svgData.colorArr[4]" v-on:mouseover="handleSvgShow($event,'7')"
                      v-on:mouseout="handleSvgHide"/>
              <!-- 仪表盘 -->
              <circle id="circle6" cx="210" cy="104" :r="svgData.Arr[1]" :fill="svgData.colorArr[1]" v-on:mouseover="handleSvgShow($event,'8')"
                      v-on:mouseout="handleSvgHide"/>
              <!-- 雷达 -->
              <circle id="circle7" cx="275" cy="104" :r="svgData.Arr[6]" :fill="svgData.colorArr[6]" v-on:mouseover="handleSvgShow($event,'3')"
                      v-on:mouseout="handleSvgHide"/>
              <!-- 摄像头 -->
              <circle id="circle8" cx="118" cy="76" :r="svgData.Arr[8]" :fill="svgData.colorArr[8]" v-on:mouseover="handleSvgShow($event,'4')"
                      v-on:mouseout="handleSvgHide"/>
              <!-- 全球定位系统 -->
              <circle id="circle9" cx="190" cy="76" :r="svgData.Arr[7]" :fill="svgData.colorArr[7]" v-on:mouseover="handleSvgShow($event,'10')"
                      v-on:mouseout="handleSvgHide"/>
              <!-- 车载计算平台 -->
              <circle id="circle10" cx="270" cy="76" :r="svgData.Arr[2]" :fill="svgData.colorArr[2]" v-on:mouseover="handleSvgShow($event,'6')"
                      v-on:mouseout="handleSvgHide"/>
            </svg>
          </div>

        </div>
      </div>
    </div>
    <div class="chart_line" id="chart_line"></div>

    <div class="tab_lab">
      <form action="" class="apollo-form">
        <div class="apollo-form-group">
          <label>{{this.language.label[0]}}</label>
          <input type="text" :value="value_id" @focus="focus" @blur="blur">
          <div class="sele">
            <div class="select" v-show="show_id">
              <ul class="uls" v-for="time in opt.option_id">
                <li @click="val1(time)">{{time.value_id}}</li>
              </ul>
            </div>
            <b></b>
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
    <table-view :tableData = "intrudata" :method="method"></table-view>
    <page-view :page="pageData" @pageOpt="pageOpt"></page-view>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import table from '../components/table'
  import page from '../components/page'
  export default {
    name: 'intrusion',
    data () {
      return {
        lang: '',
        language: {},
        curBtn: 0,
        en: {
          mouth: ['Recent 6 Months', 'Recent 3 Months', 'Recent 1 Month'],
          data_last: ['Start Time', 'End Time'],
          but: ['Search', 'Reset'],
          label: ['Severity Level', 'Attack Components', 'Treatment Measures'],
          grade: {
            grades: ['Severity Level', 'Attack Type', 'Attack Components', 'Attack Trends', 'Total Attacks', 'Total Blocked', 'Total Handled'],
            attack: 'Attacks',
            intercept: 'Blocked',
            handle: 'Handled'
          },
          opt: {
            options: [{
              values: 'ECU',
              labels: 'ECU',
              id: '2'
            }, {
              values: 'IVI',
              labels: 'IVI',
              id: '3'
            }, {
              values: 'TBOX',
              labels: 'TBOX',
              id: '4'
            }, {
              values: 'CANBus',
              labels: 'CANBus',
              id: '5'
            }, {
              values: 'Lidar',
              labels: 'Lidar',
              id: '6'
            }, {
              values: 'Camera',
              labels: 'Camera',
              id: '7'
            }, {
              values: 'GPS',
              labels: 'GPS',
              id: '8'
            }, {
              values: 'Dashboard',
              labels: 'Dashboard',
              id: '9'
            }, {
              values: 'ComputerPlat',
              labels: 'ComputerPlat',
              id: '10'
            }],
            option: [{
              value: 'Alarm',
              label: 'Alarm',
              id: '28'
            }, {
              value: 'Interdict',
              label: 'Interdict',
              id: '29'
            }, {
              value: 'Isolation',
              label: 'Isolation',
              id: '30'
            }, {
              value: 'Forced to Upgrade',
              label: 'Forced to Upgrade',
              id: '31'
            }, {
              value: 'Reset',
              label: 'Reset',
              id: '32'
            }, {
              value: 'UnDisputed',
              label: 'UnDisputed',
              id: '33'
            }],
            option_id: [{
              value_id: 'Low',
              label_id: 'Low',
              id: '1'
            }, {
              value_id: 'Medium',
              label_id: 'Medium',
              id: '2'
            }, {
              value_id: 'High',
              label_id: 'High',
              id: '3'
            }, {
              value_id: 'Critical',
              label_id: 'Critical',
              id: '4'
            }]
          },
          theadData: [
            {
              type: 'sort',
              name: 'Attack Time'
            },
            {
              type: '',
              name: 'From IP'
            },
            {
              type: '',
              name: 'Severity Level'
            },
            {
              type: '',
              name: 'Attack Components'
            },
            {
              type: '',
              name: 'Facility Name'
            },
            {
              type: '',
              name: 'Attack Type'
            },
            {
              type: '',
              name: 'Treatment Measures'
            }
          ]
        },
        cn: {
          mouth: ['近六个月', '近三个月', '近一个月'],
          data_last: ['开始时间', '结束时间'],
          but: ['查询', '重置'],
          label: ['攻击等级', '攻击部位', '处理结果'],
          grade: {
            grades: ['攻击等级分布', '攻击分类', '攻击部位统计', '攻击数量统计', '总攻击数量', '总拦截数量', '已处理数量'],
            attack: '攻击数量',
            intercept: '拦截数量',
            handle: '已处理数量'
          },
          opt: {
            options: [{
              values: '车脑控制单元',
              labels: '车脑控制单元',
              id: '2'
            }, {
              values: '车载娱乐系统',
              labels: '车载娱乐系统',
              id: '3'
            }, {
              values: 'TBOX',
              labels: 'TBOX',
              id: '4'
            }, {
              values: 'CAN总线',
              labels: 'CAN总线',
              id: '5'
            }, {
              values: '雷达',
              labels: '雷达',
              id: '6'
            }, {
              values: '摄像头',
              labels: '摄像头',
              id: '7'
            }, {
              values: '全球定位系统',
              labels: '全球定位系统',
              id: '8'
            }, {
              values: '仪表盘',
              labels: '仪表盘',
              id: '9'
            }, {
              values: '车载计算平台',
              labels: '车载计算平台',
              id: '10'
            }],
            option: [{
              value: '告警',
              label: '告警',
              id: '28'
            }, {
              value: '阻断',
              label: '阻断',
              id: '29'
            }, {
              value: '隔离',
              label: '隔离',
              id: '30'
            }, {
              value: '强制升级',
              label: '强制升级',
              id: '31'
            }, {
              value: '恢复出厂设置',
              label: '恢复出厂设置',
              id: '32'
            }, {
              value: '未处理',
              label: '未处理',
              id: '33'
            }],
            option_id: [{
              value_id: '低危',
              label_id: '低危',
              id: 1
            }, {
              value_id: '中危',
              label_id: '中危',
              id: 2
            }, {
              value_id: '高危',
              label_id: '高危',
              id: 3
            }, {
              value_id: '致命',
              label_id: '致命',
              id: 4
            }]
          },
          theadData: [
            {
              type: 'sort',
              name: '攻击时间'
            },
            {
              type: '',
              name: '攻击者IP'
            },
            {
              type: '',
              name: '攻击等级'
            },
            {
              type: '',
              name: '攻击部位'
            },
            {
              type: '',
              name: '识别模块'
            },
            {
              type: '',
              name: '攻击类型'
            },
            {
              type: '',
              name: '处理结果'
            }
          ]
        },
        Attacks_val: '',
        Facility_val: '',
        Treatment_val: '',
        show_id: false,
        shows: false,
        show: false,
        sblin: false,
        svgData: {
          isShow: false,
          currentHoverData: {},
          coverCircle: {
            cx: 50,
            cy: 50,
            r: 5,
            fill: '#FFFFFF',
            fillOpacity: 0
          },
          colorArr: ['#007ee5', '#007ee5', '#0098ef', '#00b0f5', '#00c4fc', '#24a7ff', '#4e7aff', '#7d4aff', '#a71dff'],
          Arr: ['4', '4', '5', '6', '7', '8', '9', '10', '12'],
          statData: []
        },
        Arr: ['4', '4', '5', '6', '7', '8', '9', '10', '12'],
        pickerOptions1: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        r: '1',
        opt: {
          options: [{
            values: '车脑控制单元',
            labels: '车脑控制单元'
          }, {
            values: '车载娱乐系统',
            labels: '车载娱乐系统'
          }, {
            values: 'TBOX',
            labels: 'TBOX'
          }, {
            values: 'CAN总线',
            labels: 'CAN总线'
          }, {
            values: '雷达',
            labels: '雷达'
          }, {
            values: '摄像头',
            labels: '摄像头'
          }, {
            values: '全球定位系统',
            labels: '全球定位系统'
          }],
          option: [{
            value: '告警',
            label: '告警'
          }, {
            value: '阻断',
            label: '阻断'
          }, {
            value: '隔离',
            label: '隔离'
          }, {
            value: '强制升级',
            label: '强制升级'
          }, {
            value: '恢复出厂设置',
            label: '恢复出厂设置'
          }, {
            value: '未处理',
            label: '未处理'
          }],
          option_id: [{
            value_id: '低危',
            label_id: '低危'
          }, {
            value_id: '中危',
            label_id: '中危'
          }, {
            value_id: '高危',
            label_id: '高危'
          }, {
            value_id: '致命',
            label_id: '致命'
          }]
        },
        value: '',
        values: '',
        value1: '',
        value2: '',
        value_id: '',
        getAttackLevelStat: [],
        carId: '',
        pageData: {
          count: 0,
          perPage: 10,
          currentPage: 1
        },
        intrudata: {
          isCheck: false,
          isSet: false,
          tbodyData: [],
          theadData: [
            {
              type: 'sort',
              name: '攻击时间'
            },
            {
              type: '',
              name: '攻击者IP'
            },
            {
              type: '',
              name: '攻击等级'
            },
            {
              type: '',
              name: '攻击部位'
            },
            {
              type: '',
              name: '识别模块'
            },
            {
              type: '',
              name: '攻击类型'
            },
            {
              type: '',
              name: '处理结果'
            }
          ]
        }
      }
    },
    components: {
      'tableView': table,
      'pageView': page
    },
    mounted () {
      this.lang = this.$store.state.lang
      this.language = this.en
      this.intrudata.theadData = this.language.theadData //th替换
      this.opt = this.language.opt
      if (this.lang === 'cn') {
        this.language = this.cn
        this.intrudata.theadData = this.language.theadData //th替换
        this.opt = this.language.opt
      } else {
        this.language = this.en
        this.intrudata.theadData = this.language.theadData //th替换
        this.opt = this.language.opt
      }
      this.getEchartMultiData()
      this.getAttackInfo()
    },
    watch: {
      getLanguage (newVal, oldVal ) {//监控语言切换  重新请求数据
        this.lang = newVal
        if ('cn' == this.lang) {//请求中文
          this.language = this.cn
          this.intrudata.theadData = this.language.theadData //th替换
          this.opt = this.language.opt
        }
        if ('en' == this.lang) {//请求英文
          this.language = this.en
          this.intrudata.theadData = this.language.theadData //th替换
          this.opt = this.language.opt
        }
        this.getEchartMultiData()
        this.getAttackInfo()
      }
    },
    computed: {
      getLanguage () {
        return this.$store.state.lang
      }
    },
    methods: {
      getEchartMultiData () {
        this.$http.get('http://localhost:3000/getEchartMultiData?monthNum=6&paramType=month&language=' + this.lang).then(response => {
          this.res(response)
          var date = new Date()
          var year = date.getFullYear()
          var month = date.getMonth() + 1
          var m = date.getMonth() - 5
          var strDate = date.getDate()
          var bingdata = year + '-' + month + '-' + strDate
          var condata = year + '-' + m + '-' + strDate
          this.value1 = new Date(condata)
          this.value2 = new Date(bingdata)
        }, response => {
          console.log('error')
        })
      },
      getAttackInfo () {
        console.log(this.pageData.currentPage + '.....' + this.pageData.perPage)
        this.$http.get('http://localhost:3000/getAttackInfo?&language=' + this.lang, {
          params: {
            perpage: this.pageData.perPage,
            currentPage: this.pageData.currentPage,
            attackLevel: this.Attacks_val,
            attackPart: this.Facility_val,
            disposeResult: this.Treatment_val,
            order: this.r
          }
        }).then(response => {
          let data = response.data
          var tr = []
          this.pageData.count = data.count
          if (data.data) {
            data.data.forEach(function (val) {
              let trData = {
                time: val.attack_date,
                ip: val.attack_ip,
                level: val.attack_level,
                part: val.part_name,
                partName: val.facility_name,
                type: val.type_name,
                result: val.dispose_name
              }
              tr.push(trData)
            })
          }
          this.intrudata.tbodyData = tr
        }, response => {
          console.log('error')
        })
      },
      chart_one (ONE) {
        let onex = []
        let oney = []
        ONE.forEach(function (item) {
          onex.push(item.attack_level)
          oney.push(item.attack_num)
        })
        let chart_one = echarts.init(document.getElementById('chart_one'))
        let option = {
          backgroundColor: '#000000',
          opacity: '0.3',
          title: {
            text: this.language.grade.grades[0].toString(),
            textStyle: {
              color: '#fff',
              fontSize: 18
            },
            left: 20,
            top: 30
          },
          color: ['#ffffff'],
          tooltip: {
            // trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '25',
            right: '25',
            bottom: '20',
            top: 120,
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: onex,
              axisTick: {
                alignWithLabel: true
              },
              nameTextStyle: {
                color: '#A8A9AF'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dotted',
                  color: '#303950'
                }
              },
              nameTextStyle: {
                color: '#A8A9AF'
              },
              axisLine: {
                show: false,
                lineStyle: {
                  type: 'dotted'
                }
              },
              axisTick: {
                show: false
              }
            }
          ],
          series: [
            {
              type: 'bar',
              barWidth: '50%',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0, color: 'rgba(46,130,249,0.7)'
                  },
                  {
                    offset: 1, color: 'rgba(6,109,255,0.2)'
                  }
                  ], false)
                }
              },
              label: {
                normal: {
                  show: true,
                  color: '#fff',
                  position: 'top'
                }
              },
              data: oney
            }
          ]
        }
        chart_one.setOption(option)
      },
      chart_two (TWO) {
        let onex = []
        let oney = []
        TWO.forEach(function (item) {
          onex.push(item.zh_cn)
          let trData = {
            value: item.attack_num,
            name : item.zh_cn
          }
          oney.push(trData)
        })
        let chart_two = echarts.init(document.getElementById('chart_two'))
        let option = {
          tooltip: {},
          backgroundColor: '#000000',
          title: {
            text: this.language.grade.grades[1].toString(),
            textStyle: {
              color: '#fff',
              fontSize: 18
            },
            left: 20,
            top: 30
          },
          color: ['#f29eff', '#dd79ff', '#c856ff', '#b12eff', '#9327ff', '#673bff', '#434bff', '#1661ff', '#0e75FF', '#3291FF', '#51a9ff', '#74c5ff'],
          // color: ['#74c5ff', '#51a9ff', '#3291FF  ', '#0e75FF', '#1661ff', '#434bff', '#673bff', '#9327ff', '#b12eff', '#c856ff', '#dd79ff', '#f29eff'],
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 250,
            top: 153,
            textStyle: {
              color: '#fff'
            },
            data: onex
          },
          series: [
            {
              type: 'pie',
              center: ['33%', '60%'],
              radius: ['30%', '50%'],
              avoidLabelOverlap: false,
              tooltip: {
                trigger: 'item'
              },
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: oney
            }
          ]
        }
        chart_two.setOption(option)
      },
      chart_str () {
        let chart_str = echarts.init(document.getElementById('chart_str'))
        let option = {
          tooltip: {},
          backgroundColor: '#000000',
          title: {
            text: this.language.grade.grades[2].toString(),
            textStyle: {
              color: '#fff',
              fontSize: 18
            },
            left: 20,
            top: 30
          }
        }
        chart_str.setOption(option)
      },
      chart_line (LIN) {
        var SUM = Object.values(LIN.totalNumArr)
        SUM[0] = this.language.grade.grades[4] + ': ' + SUM[0]
        SUM[1] = this.language.grade.grades[5] + ': ' + SUM[1]
        SUM[2] = this.language.grade.grades[6] + ': ' + SUM[2]
        var lin = LIN.byMonthNumArr
        var Data = []
        var linO = []
        var lin1 = []
        var lin2 = []
        if (lin) {
          lin.attachNumByMonth.forEach(function (val) {
            Data.push(val.year + '-' + val.month + '-' + val.day)
            linO.push(val.attack_num)
          })
          lin.disposeNumByMonth.forEach(function (val) {
            lin1.push(val.attack_num)
          })
          lin.interceptNumByMonth.forEach(function (val) {
            lin2.push(val.attack_num)
          })
        }
        let lines = echarts.init(document.getElementById('chart_line'))
        let option = {
          backgroundColor: '#000000',
          title: {
            text: this.language.grade.grades[3].toString(),
            textStyle: {
              color: '#fff',
              fontSize: 18
            },
            left: 20,
            top: 30
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            x: '20',
            y: '85',
            textStyle: {
              color: '#fff'
            },
            data: SUM,
            icon: 'stack'
          },
          grid: {
            top: '150',
            left: '20',
            right: '30',
            bottom: '20',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              nameTextStyle: {
                color: '#A8A9AF'
              },
              boundaryGap: false,
              data: Data,
              axisLine: {
                lineStyle: {
                  type: 'dotted'
                }
              }
            }
          ],
          yAxis: [
            {
              show: true,
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dotted',
                  color: '#303950'
                }
              },
              axisLine: {
                show: false,
                lineStyle: {
                  type: 'dotted'

                }
              },
              axisLabel: {
                color: '#000'
              },
              axisTick: {
                show: false
              },
              nameTextStyle: {
                color: '#A8A9AF'
              },
              boundaryGap: false,
              data: ['0', '100', '200', '300', '400', '500']
            }
          ],
          series: [
            {
              name: SUM[0].toString(),
              type: 'line',
              stack: '总量',
              areaStyle: {normal: {}},
              itemStyle: {
                normal: {
                  color: '#C200FF'
                }
              }
            },
            {
              name: SUM[1].toString(),
              type: 'line',
              stack: '总量',
              areaStyle: {normal: {}},
              itemStyle: {
                normal: {
                  color: '#00CDFF'
                }
              }
            },
            {
              name: SUM[2].toString(),
              type: 'line',
              stack: '总量',
              areaStyle: {normal: {}},
              itemStyle: {
                normal: {
                  color: '#006AFF'
                }
              }
            },
            {
              name: this.language.grade.attack,
              type: 'line',
              stack: '总量',
              symbol: 'image://../../static/img/Group 13.png',
              showSymbol: false,
              symbolSize: '18',
              smooth: true,
              areaStyle: {normal: {}},
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0, color: 'rgba(194,0,255,0.6)'
                  }, {
                    offset: 1, color: 'rgba(194,0,255,0)'
                  }
                  ], false)
                },
                color: '#f00'
              },
              data: linO
            },
            {
              name: this.language.grade.intercept,
              type: 'line',
              color: 'rgba(0,205,255,1)',
              stack: '总量',
              symbol: 'image://../../static/img/Group 11.png',
              showSymbol: false,
              symbolSize: '18',
              showAllSymbol: false,
              smooth: true,
              areaStyle: {normal: {}},
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0, color: 'rgba(0,205,255,0.6)'
                  },
                    {
                      offset: 1, color: 'rgba(0,205,255,0)'
                    }
                  ], false)
                }
              },
              data: lin1
            },
            {
              name: this.language.grade.handle,
              type: 'line',
              stack: '总量',
              symbol: 'image://../../static/img/Group 10.png',
              showSymbol: false,
              symbolSize: '18',
              smooth: true,
              areaStyle: {normal: {}},
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0, color: 'rgba(46,130,249,0.6)'
                  }, {
                      offset: 1, color: 'rgba(6,109,255,0)'
                    }
                  ], false)
                }
              },
              data: lin2
            }
          ]
        }
        lines.on('legendselectchanged', (obj) => {
          let selected = obj.selected
          let legend = []
          let name

          for (name in selected) {
            if (selected.hasOwnProperty(name)) {
              legend.push({name: name})
            }
          }

          lines.dispatchAction({
            type: 'legendSelect',
            batch: legend
          })
        })
        lines.setOption(option)
      },
      mouth6 () {
        this.$http.get('http://localhost:3000/getEchartMultiData?monthNum=6&paramType=month&language=' + this.lang).then(response => {
          this.res(response)
          this.curBtn = 0
          var date = new Date()
          var year = date.getFullYear()
          var month = date.getMonth() + 1
          var m = date.getMonth() - 5
          var strDate = date.getDate()
          var bingdata = year + '-' + month + '-' + strDate
          var condata = year + '-' + m + '-' + strDate
          this.value1 = new Date(condata)
          this.value2 = new Date(bingdata)
        }, response => {
          console.log('error')
        })
      },
      mouth3 () {
        this.$http.get('http://localhost:3000/getEchartMultiData?monthNum=3&paramType=month&language=' + this.lang).then(response => {
          this.res(response)
          this.curBtn = 1
          var date = new Date()
          var year = date.getFullYear()
          var month = date.getMonth() + 1
          var m = date.getMonth() - 2
          var strDate = date.getDate()
          var bingdata = year + '-' + month + '-' + strDate
          var condata = year + '-' + m + '-' + strDate
          this.value1 = new Date(condata)
          this.value2 = new Date(bingdata)
        }, response => {
          console.log('error')
        })
      },
      mouth1 () {
        this.$http.get('http://localhost:3000/getEchartMultiData?monthNum=1&paramType=month&language=' + this.lang).then(response => {
          this.res(response)
          this.curBtn = 2
          var date = new Date()
          var year = date.getFullYear()
          var month = date.getMonth() + 1
          var m = date.getMonth()
          var strDate = date.getDate()
          var bingdata = year + '-' + month + '-' + strDate
          var condata = year + '-' + m + '-' + strDate
          this.value1 = new Date(condata)
          this.value2 = new Date(bingdata)
        }, response => {
          console.log('error')
        })
      },
      chart_qurey () {
        let start = this.value1
        let end = this.value2
        var startWant = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
        var endWant = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
        if (start < end) {
          this.$http.get('http://localhost:3000/getEchartMultiData?startDate=' + startWant + '&endDate=' + endWant + '&paramType=date&language=' + this.lang).then(response => {
            this.res(response)
          }, response => {
            console.log('error')
          })
          this.curBtn = null
        } else {
          return false
        }
      },
      chart_qurey_but () {
        this.pageData.currentPage = 1
        this.getAttackInfo()
      },
      method: function () {
        if (this.r === 0) {
          this.r = 1
          this.getAttackInfo()
        } else {
          this.r = 0
          this.getAttackInfo()
        }
      },
      res: function (response) {
        let ONE = response.data.attackLevel
        let TWO = response.data.attackTypeStat
        let STR = response.data.attackPartStat
        let LIN = response.data.attackStat
        this.chart_one(ONE)
        this.chart_two(TWO)
        this.chart_str()
        this.chart_line(LIN)
        if (STR.length > 0) {
          this.sblin = true
        } else {
          this.sblin = false
        }
        this.svgData.statData = STR
      },
      pageOpt: function (data) {
        this.pageData.perPage = data.perpage
        this.pageData.currentPage = data.currentPage
        console.log(data)
        this.getAttackInfo()
      },
      handleSvgShow (event, attackPart, attackNum) {
        this.svgData.isShow = true
        var hoverCircle = event.target
        this.svgData.coverCircle = {
          cx: hoverCircle.getAttribute('cx'),
          cy: hoverCircle.getAttribute('cy'),
          r: parseInt(hoverCircle.getAttribute('r')) + 10,
          fill: hoverCircle.getAttribute('fill'),
          fillOpacity: '.2' //悬停时有透明度
        }
        var newDiv = document.getElementById('hoverDiv')
        var svgOuter = document.getElementById('svgOuter')
        var svgOuterPosition = this.findPosition(svgOuter)
        newDiv.style.left = svgOuterPosition[0] + event.target.cx.baseVal.value + event.target.r.baseVal.value - 100 + 'px'
        newDiv.style.top = svgOuterPosition[1] + event.target.cy.baseVal.value + document.body.scrollTop + 150 + 'px'
        var findItem = {}
        var Arr = []
        this.svgData.statData.forEach(function (item, index) {
          if (attackPart == item.attack_part) {
            findItem = item
          }
          Arr.push(item.attack_num)
          console.log(item.attack_num)
        })
        // function sortNumber (a, b) {
        //   return a - b
        // }
        // console.log(Arr.sort(sortNumber))
        this.svgData.currentHoverData = findItem
      },
      handleSvgHide () {//隐藏悬浮框
        this.svgData.coverCircle.fillOpacity = 0
        this.svgData.isShow = false
      },
      findPosition (oElement) {//oElement 当前元素
        if (typeof (oElement.offsetParent) != 'undefined') {
          for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
            posX += oElement.offsetLeft
            posY += oElement.offsetTop
          }
        }
        var array = [posX, posY]
        return array
      },
      focus () {
        this.show_id = true
        this.Attacks_val = ''
        this.value_id = ''
      },
      focus_two () {
        this.shows = true
        this.Facility_val = ''
        this.values = ''
      },
      focus_tre () {
        this.show = true
        this.Treatment_val = ''
        this.value = ''
      },
      val1 (time) {
        this.Attacks_val = time.id
        this.value_id = time.value_id
        this.show_id = false
      },
      val2 (time) {
        this.Facility_val = time.id
        this.values = time.values
        this.shows = false
      },
      val3 (time) {
        this.Treatment_val = time.id
        this.value = time.value
        this.show = false
      },
      input_false () {
        this.show_id = false
      },
      input_false1 () {
        this.shows = false
      },
      input_false2 () {
        this.show = false
      },
      blur () {
        setTimeout(this.input_false, 300)
      },
      blur1 () {
        setTimeout(this.input_false1, 300)
      },
      blur2 () {
        setTimeout(this.input_false2, 300)
      },
      reset_btn () {
        this.Attacks_val = ''
        this.value_id = ''
        this.Facility_val = ''
        this.values = ''
        this.Treatment_val = ''
        this.value = ''
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/less/intrusion.less";
  @import url('../assets/less/intelligence-svg.less');
</style>
<style>
  .begin_data{
    padding: 0;
    width: 180px;
  }
  .el-scrollbar__thumb{
    background: #006AFF;
  }
  .el-select-dropdown__item:hover{
    background: #006AFF;
  }
  .el-picker-panel{
    width: 228px;
    height: 213px;
    background: #000000;
    border: 1px solid #000000;
    color: #FFFFFF;
  }
  .el-date-picker__header{
    width: 100%;
    margin: 3px;
    color: #FFFFFF;
  }
  .el-input__inner{
    margin: 0;
    height: 28px;
    width: 180px;
    background: #19202D;
    border: none;
    margin: 0;
    padding: 0;
    color: #fff;
  }
  .el-icon-date{
    display: none;
  }
  . el-icon-arrow-right{

  }
  .el-picker-panel__content{
    width: 228px;
    height: 213px;
  }
  .el-picker-panel__content table{
    width: 228px;
    height: 213px;
  }
  .el-picker-panel__content{
    margin: 0;
  }
  .el-date-table td div{
    height: 22px;
    padding: 0;
  }
  .el-date-table th{
    color: #FFFFFF;
    padding: 0;
  }
  .el-date-table td{
    padding: 0;
    height: 30px;
  }
  .el-picker-panel__icon-btn{
    color: #FFFFFF;
  }
  .el-date-picker__header-label{
    color: white;
  }
  .el-icon-circle-close{
    display: none;
  }
  .el-picker-panel__body{
    height: 238px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 180px;
  }
  .el-picker-panel{
    height: 240px;
    line-height: 18px;
  }
  .el-select-dropdown__item{

  }
  .el-select-dropdown{
    background: #000;
    border: 1px solid #000000;
  }

  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
    background: #3A6098;
    color: #FFFFFF;
  }
  .el-select__caret{
    display: none;
  }
  .el-select:hover .el-input__inner{
    border-bottom: 1px solid #3a6089;
  }
  .el-popper[x-placement^=top] .popper__arrow, .el-popper[x-placement^=top] .popper__arrow::after{
    border-top-color: #000;
  }
  .el-popper[x-placement^=bottom] .popper__arrow, .el-popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color: #000;
  }
</style>
