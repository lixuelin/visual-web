<template>
  <div class='apollo-state'>
    <div class='apollo-state-bg'>
      <div class='apollo-state-map'>
        <div id='map'></div>
        <div class='apollo-state-count'>
          <h1><countTo :startVal='onlineNum.init' :endVal='onlineNum.all' :duration='8000' :autoplay="true"></countTo></h1>
          <p class='apollo-state-count-name'>{{changeLang.curLang.online}}</p>
          <div class='apollo-state-count-tip'>
            <p><countTo :startVal='intrusionNum.init' :endVal='intrusionNum.all' :duration='5000' :autoplay="true"></countTo> {{changeLang.curLang.danger}}</p>
            <p><countTo :startVal='protectNum.init' :endVal='protectNum.all' :duration='5000' :autoplay="true"></countTo> {{changeLang.curLang.secure}}</p>
            <div class='apollo-state-count-line'></div>
            <p><countTo :startVal='protectTime.init' :endVal='protectTime.all' :duration='3000' :autoplay="true"></countTo> {{changeLang.curLang.time}}</p>
          </div>
        </div>
      </div>
      <div class='apollo-state-wrap'>
        <div class='apollo-state-flex apollo-state-danger'>
          <div class='apollo-state-flex-title'>
            <h4>{{changeLang.curLang.latest}}</h4>
            <p>{{changeLang.curLang.top}}</p>
          </div>
          <div class='apollo-state-flex-list'>
            <ul id="aniDanger">
              <li v-for='item in dangerData' @click="showDetail(item)">
                <time>{{item.attack_time}}</time>
                <p>{{item.car_id}}</p>
                <p>{{item.country}}</p>
              </li>
            </ul>
          </div>
        </div>
        <div class='apollo-state-flex apollo-state-connect'>
          <div class='apollo-state-flex-title'>
            <h4>{{changeLang.curLang.connection}}</h4>
            <p>{{changeLang.curLang.top}}</p>
          </div>
          <div class='apollo-state-flex-list'>
            <ul>
              <li v-for='item in connectData'>
                <time>{{item.counts}} Times</time>
                <p>{{item.ip}}</p>
                <p>{{item.continent}}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="apollo-state-laybox" v-show="isDanger">
      <span class="apollo-state-laybox-close" @click="isDanger=!isDanger"></span>
      <div class="apollo-state-laybox-body">
        <div class="apollo-state-laybox-car">
          <svg id="attack_car" class="apollo-state-laybox-car-svg">
            <circle id="ivi" cx="80" cy="76" class="apollo-state-laybox-car-svg-default" :class="{current: dangerCarPart===3}" />
            <circle id="dashboard" cx="50" cy="80" class="apollo-state-laybox-car-svg-default" :class="{current: dangerCarPart===6}"/>
            <circle id="camera" cx="80" cy="140" class="apollo-state-laybox-car-svg-default" :class="{current: dangerCarPart===8}"/>
            <circle id="ecu" cx="50" cy="170" class="apollo-state-laybox-car-svg-default" :class="{current: dangerCarPart===2}"/>
            <circle id="lidar" cx="80" cy="196" class="apollo-state-laybox-car-svg-default" :class="{current: dangerCarPart===7}"/>
            <circle id="gps" cx="80" cy="213" class="apollo-state-laybox-car-svg-default" :class="{current: dangerCarPart===9}"/>
            <circle id="canBus" cx="110" cy="230" class="apollo-state-laybox-car-svg-default" :class="{current: dangerCarPart===5}"/>
            <circle id="tbox" cx="50" cy="250" class="apollo-state-laybox-car-svg-default"  :class="{current: dangerCarPart===4}"/>
            <circle id="carCount" cx="110" cy="310"  class="apollo-state-laybox-car-svg-default" :class="{current: dangerCarPart===10}"/>
          </svg>
        </div>
        <div class="apollo-state-laybox-cont" v-for="item in dangerCar">
          <div>
            <h4>{{changeLang.curLang.carTitle}}</h4>
            <p>{{changeLang.curLang.carId}}：{{item.uuid}}</p>
            <p>{{changeLang.curLang.add}}：{{item.country}}.{{item.continent}}.{{item.province}}</p>
            <p>{{changeLang.curLang.level}}：{{item.attack_level}}</p>
            <p>{{changeLang.curLang.part}}：{{item.part_name}}</p>
          </div>
          <div>
            <h4>{{changeLang.curLang.hacker}}</h4>
            <p>{{changeLang.curLang.ip}}：{{item.hacker_ip}}</p>
            <p>{{changeLang.curLang.add}}：{{item.hacker_country}}.{{item.hacker_province}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  import world from 'echarts/map/js/world'
  import countTo from 'vue-count-to'
  import TWEEN from '@tweenjs/tween.js'
  export default {
    name: 'state',
    data () {
      return {
        lang: this.$store.state.lang,
        changeLang: {
          en: {
            online: 'Cars online',
            secure: 'Secure',
            danger: 'In danger',
            time: 'Online time',
            latest: 'LATEST INTRUSION',
            top: 'Top5',
            connection: 'TOP CONNECTION',
            carTitle: 'CAR’S INFORMATION',
            carId: 'Car ID',
            add: 'Address',
            level: 'Severity Level',
            part: 'Attack component',
            hacker: 'HACKER’S INFORMATION',
            ip: 'IP'
          },
          cn: {
            online: '在线车辆',
            secure: '安全车辆',
            danger: '危险车辆',
            time: '在线总时长',
            latest: '最新攻击',
            top: 'Top5',
            connection: '连接排名',
            carTitle: '车辆信息',
            carId: '车辆ID',
            add: '位置',
            level: '攻击等级',
            part: '攻击部位',
            hacker: '攻击信息',
            ip: 'IP'
          },
          curLang: {}
        },
        myChart: {},
        name: 'apollo',
        isDanger: false,
        dangerData: [],
        connectData: [],
        dangerCar: [],
        oldPointData: [],
        oldPointLen: 0,
        oldLineLen: 0,
        oldLineData: [],
        onlineNum: {
          init: 0,
          all: 0
        },
        intrusionNum: {
          init: 0,
          all: 0
        },
        protectNum: {
          init: 0,
          all: 0
        },
        protectTime: {
          init: 0,
          all: 0
        },
        dangerCarPart: 0,
        countOpt: {
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.'
        },
        pos: {
          x: 0,
          y: 0
        },
        lineData: [],
        onLineDanger: [],
        currentDanger: [],
        sourceData: [],
        itemLineData: [],
        geoCoordMap: {},
        timer: null,
        option: {
          backgroundColor: 'transparent',
          title: {
            show: false
          },
          tooltip: {
            trigger: 'item',
            alwaysShowContent: true
          },
          geo: {
            map: 'world',
            zoom: 1.233555,
            roam: false,
            label: {
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: 'transparent',
                borderColor: 'transparent'
              },
              emphasis: {
                color: 'transparent'
              }
            }
          },
          series: []
        }
      }
    },
    components: { countTo },
    created () {
      this.initDanger()
      this.initConnection()
    },
    computed: {
      langChange () {
        return this.$store.state.lang
      }
    },
    mounted () {
      if ('cn' === this.lang) {
        this.changeLang.curLang = this.changeLang.cn
      } else {
        this.changeLang.curLang = this.changeLang.en
      }
      this.getLineData()
    },
    methods: {
      initDanger: function () {
        this.$http.get('http://localhost:3000/getLatestIntrusion?language=' + this.lang).then((res) => {
          this.dangerData = res.data
        }, (err) => {
          console.log(err)
        })
      },
      initConnection: function () {
        this.$http.get('http://localhost:3000/getTopConnection?language=' + this.lang).then((res) => {
          this.connectData = res.data
        }, (err) => {
          console.log(err)
        })
      },
      resetEchart: function () {
        this.getLineData()
        this.getDanger()
        this.clearData()

        setTimeout(() => {
          this.resetEchart()
        }, 4500)
      },
      intervalGet: function () {
        if (this.$route.name === 'State') {
          let series = []
          this.myChart = echarts.init(document.querySelector('#map'))
          this.myChart.setOption({series: series})
          clearTimeout(this.timer)
          this.getLineData()
        } else {
          let series = []
          this.myChart = echarts.init(document.querySelector('#map'))
          this.myChart.setOption({series: series})
          return console.log(this.$route.name)
        }
      },
      sliceArray: function (array, size) {
        let result = []
        if (array.length >= 5 || size === 3) { // 3 为了攻击点数据特殊处理
          for (let x = 0; x < Math.ceil(array.length / size); x++) {
            let start = x * size
            let end = start + size
            result.push(array.slice(start, end))
          }
        } else {
          if (array.length >= 3) {
            result.push(array.splice(0, 3))
          }

          if (array.length >= 2) {
            result.push(array.splice(0, 2))
          }

          if (array.length >= 1) {
            result.push(array)
          }
        }
        return result
      },
      getLineData: function () {
        this.$http.get('http://localhost:3000/getBallMultiDataTimeMap?language=' + this.lang).then((res) => {
          console.log(res.data)
          this.lineData = []
          this.onLineDanger = []
          let topConnect = this.sliceArray(res.data.topConnection, 3)
          console.log(topConnect)
          this.currentDanger = this.sliceArray(res.data.ballIntrusion, 3)
          res.data.ballIntrusion.map((item) => {
            const city = {}
            city.name = item.country
            city.value = [item.longitude, item.latitude]
            city.symbol = 'rect'
            city.symbolSize = 1
            city.label = {
              normal: {
              show: false
              }
            }
            city.itemStyle = {
              normal: {
                'color': '#f00'
              }
            }
            this.onLineDanger.push(city)
          })
          let d = 0
          this.onLineDanger.length = 1
          this.sourceData = []
          topConnect.forEach((item, index) => {
            this.lineData.push(['源' + index, []])
            this.sourceData.push([])
            if (item.length > 1) {
              item.forEach((dataItem, i) => {
                this.geoCoordMap['源' + index + i] = [Number(dataItem.longitude), Number(dataItem.latitude)]
                let sourcePoint = {
                  'value': [Number(dataItem.longitude), Number(dataItem.latitude)],
                  'symbolSize': 1,
                  'itemStyle': {
                    'normal': {
                      'color': '#006EEF'
                    }
                  }
                }
                this.sourceData[index].push(sourcePoint)

                dataItem.targets.forEach((itemLine, l) => {
                  const line = [
                    {
                      name: '源' + index + i
                    },
                    {
                      name: '目的' + index + i + l,
                      value: 60
                    }
                  ]
                  const point = [Number(itemLine.Long), Number(itemLine.Lat)]
                  this.lineData[index][1].push(line)
                  this.geoCoordMap['目的' + index + i + l] = point
                })
              })
            }
            if (item.length === 1) {
              item.forEach((dataItem) => {
                this.geoCoordMap['源' + index] = [Number(dataItem.longitude), Number(dataItem.latitude)]
                let sourcePoint = {
                  'value': [Number(dataItem.longitude), Number(dataItem.latitude)],
                  'symbolSize': 1,
                  'itemStyle': {
                    'normal': {
                      'color': '#006EEF'
                    }
                  }
                }
                this.sourceData[index].push(sourcePoint)
                dataItem.targets.forEach((itemLine) => {
                  let nameId = d++
                  const line = [
                    {
                      name: '源' + index
                    },
                    {
                      name: '目的' + nameId,
                      value: 60
                    }
                  ]
                  const point = [Number(itemLine.Long), Number(itemLine.Lat)]
                  this.lineData[index][1].push(line)
                  this.geoCoordMap['目的' + nameId] = point
                })
              })
            }
          })
          this.onlineNum = {
            init: this.onlineNum.all,
            all: res.data.onlineNum
          }

          this.intrusionNum = {
            init: this.intrusionNum.all,
            all: res.data.intrusionNum
          }

          this.protectNum = {
            init: this.protectNum.all,
            all: res.data.protectNum
          }

          this.protectTime = {
            init: this.protectTime.all,
            all: res.data.protectTime
          }

          this.clearData()
          this.getDanger()
          this.timer = setTimeout(() => {
            this.getLineData()
            this.initConnection()
          }, 2500)
        })
      },
      getDanger: function () {
        let convertData = (data) => {
          let res = []
          for (let i = 0; i < data.length; i++) {
            let dataItem = data[i]
            let fromCoord = this.geoCoordMap[dataItem[0].name]
            let toCoord = this.geoCoordMap[dataItem[1].name]
            if (fromCoord && toCoord) {
              res.push([{
                coord: fromCoord
              }, {
                coord: toCoord
              }])
            }
          }
          return res
        }
        this.myChart = echarts.init(document.querySelector('#map'))
        this.myChart.setOption(this.option)
        this.lineData.length = 1
        this.setData(convertData, this.lineData[0], 0)
      },
      setData: function (convertData, item) {
        let series = []
        let data = item[1]
        series.push({
          type: 'lines',
          zlevel: 0,
          effect: {
            show: true,
            period: 3,
            trailLength: 0.7,
            color: '#46bee9',
            symbol: 'pin',
            symbolSize: 5,
            loop: false
          },
          tooltip: {
            show: false
          },
          lineStyle: {
            normal: {
              width: 0,
              curveness: 0.2
            }
          },
          data: convertData(data)
        }, {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 1,
          rippleEffect: {
            brushType: 'stroke',
            period: 5,
            scale: 12
          },
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
              position: 'right',
              formatter: '{b}'
            }
          },
          tooltip: {
            show: false
          },
          symbolSize: 1,
          showEffectOn: 'render',
          itemStyle: {
            normal: {
              show: false,
              color: '#46bee9'
            }
          },
          data: data.map((dataItemCont) => {
            return {
              name: dataItemCont[1].name,
              value: this.geoCoordMap[dataItemCont[1].name].concat([dataItemCont[1].value])
            }
          })
        }, {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {
            brushType: 'stroke',
            period: 5,
            scale: 12
          },
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
              position: 'right',
              formatter: '{b}'
            }
          },
          tooltip: {
            show: false
          },
          symbolSize: 1,
          showEffectOn: 'render',
          itemStyle: {
            normal: {
              show: false,
              color: '#46bee9'
            }
          },
          data: this.sourceData[0]
        }, {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 3,
          rippleEffect: {
            brushType: 'stroke',
            period: 5,
            scale: 20
          },
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              show: true
            }
          },
          tooltip: {
            show: true,
            position: (p) => {
              this.pos.x = p[0] - 4
              this.pos.y = p[1] - 5
              return [p[0] - 4, p[1] - 5]
            },
            formatter: () => {
              setTimeout(() => {
                if (this.currentDanger.length !== 0) {
                  if (this.currentDanger[0]) {
                    this.init(this.currentDanger[0][0], this.pos)
                  } else {
                    console.log('没值了')
                    return false
                  }
                }
              })
            },
            backgroundColor: 'transparent'
          },
          symbol: 'rect',
          symbolSize: 1,
          data: this.onLineDanger
        })

        this.myChart.setOption({
          series: series
        })

        this.myChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 3,
          dataIndex: 0
        })
      },
      clearData: function () {
        this.myChart = echarts.init(document.querySelector('#map'))
        let series = []
        series.push({
          type: 'lines',
          zlevel: 0,
          effect: {
            show: false,
            period: 3,
            trailLength: 0.7,
            color: '#46bee9',
            symbol: 'pin',
            symbolSize: 5,
            loop: false
          },
          tooltip: {
            show: false
          },
          lineStyle: {
            normal: {
              width: 0,
              curveness: 0.2
            }
          },
          data: []
        }, {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 0,
          rippleEffect: {
            brushType: 'stroke',
            period: 5,
            scale: 12
          },
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
              position: 'right',
              formatter: '{b}'
            }
          },
          tooltip: {
            show: false
          },
          symbolSize: 1,
          showEffectOn: 'render',
          itemStyle: {
            normal: {
              show: false,
              color: '#46bee9'
            }
          },
          data: []
        }, {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 0,
          rippleEffect: {
            brushType: 'stroke',
            period: 5,
            scale: 12
          },
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
              position: 'right',
              formatter: '{b}'
            }
          },
          tooltip: {
            show: false
          },
          symbolSize: 1,
          showEffectOn: 'render',
          itemStyle: {
            normal: {
              show: false,
              color: '#46bee9'
            }
          },
          data: []
        }, {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 0,
          rippleEffect: {
            brushType: 'stroke',
            period: 5,
            scale: 20
          },
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              show: true
            }
          },
          tooltip: {
            show: false,
            backgroundColor: 'transparent'
          },
          symbol: 'rect',
          symbolSize: 1,
          data: []
        })

        this.myChart.setOption({
          series: series
        })
      },
      showDetail: function (item) {
        this.$http.get('http://localhost:3000/getIntrusionDetail?language=' + this.lang, {
          params: {
            id: item.id
          }
        })
          .then((res) => {
            this.isDanger = true
            this.dangerCar = res.data
            this.dangerCarPart = res.data[0].attack_part
          }, (err) => {
            console.log(err)
          })
      },
      init: function (data, pos) {
        const target = document.createElement('div')

        createStart(TWEEN.Interpolation.Linear)
        createEnd(TWEEN.Interpolation.Linear)
        createCont(TWEEN.Interpolation.Linear)
        setTimeout(() => {
          createData(TWEEN.Interpolation.Linear, data)
        }, 800)
        moveTip(TWEEN.Interpolation.Linear, pos)
        hideTip(TWEEN.Interpolation.Linear)
        moveDanger(TWEEN.Interpolation.Linear)

        function createStart (interpolation) {
          const startLine = document.createElement('span')
          target.appendChild(startLine)
          startLine.className = 'startLine'
          const w = {x: 0}

          new TWEEN.Tween(w)
            .to({x: 60}, 300)
            .onUpdate(() => {
              startLine.style.setProperty('width', w.x + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(0)
            .start()

          var wb = {x: 60}
          new TWEEN.Tween(wb)
            .to({x: 0}, 300)
            .onUpdate(() => {
              startLine.style.setProperty('width', wb.x + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(2300)
            .start()
          return startLine
        }

        function createEnd (interpolation) {
          const endLine = document.createElement('span')
          endLine.className = 'endLine'
          target.appendChild(endLine)
          const w = {x: 0}
          const wb = {x: 150}

          new TWEEN.Tween(w)
            .to({x: 150}, 500)
            .onUpdate(() => {
              endLine.style.setProperty('width', w.x + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(300)
            .start()

          new TWEEN.Tween(wb)
            .to({x: 0}, 500)
            .onUpdate(() => {
              endLine.style.setProperty('width', wb.x + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(1800)
            .start()
          return endLine
        }

        function createCont (interpolation) {
          const cont = document.createElement('div')
          cont.className = 'cont'
          target.appendChild(cont)

          const obj = {x: 0}
          new TWEEN.Tween(obj)
            .to({x: 80}, 500)
            .onUpdate(() => {
              cont.style.setProperty('height', obj.x + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(300)
            .start()
          return cont
        }

        function createData (interpolation, data) {
          const contData = document.createElement('div')
          contData.innerHTML = '<p>Intrusion</p>' +
            '<p>' + data.car_id + '</p>' +
            '<p>' + data.city + data.country + '</p>'
          contData.style.opacity = 0
          contData.style.padding = '10px'
          target.getElementsByClassName('cont')[0].appendChild(contData)
          const o = {o: 0}
          new TWEEN
            .Tween(o)
            .to({o: 1}, 200)
            .onUpdate(() => {
              contData.style.setProperty('opacity', o.o)
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(200)
            .start()
          return contData
        }

        function moveTip (interpolation, pos) {
          const cont = document.getElementById('map').getElementsByTagName('div')[1]
          cont.style.display = 'block'
          const contPos = {x: pos.x, y: pos.y, o: 1}
          new TWEEN
            .Tween(contPos)
            .to({x: 300, y: 450}, 600)
            .onUpdate(() => {
              cont.style.setProperty('left', contPos.x + 'px')
              cont.style.setProperty('top', contPos.y + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(2600)
            .start()

          return cont
        }

        function hideTip (interpolation) {
          const cont = document.getElementById('map').getElementsByTagName('div')[1]
          const contPos = {o: 1}
          new TWEEN
            .Tween(contPos)
            .to({o: 0}, 200)
            .onUpdate(() => {
              cont.style.setProperty('opacity', contPos.o)
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(3200)
            .start()

          return cont
        }

        function moveDanger (interpolation) {
          const danger = document.getElementById('aniDanger')
          const contPos = {x: 0}
          new TWEEN
            .Tween(contPos)
            .to({x: 0}, 200)
            .onUpdate(() => {
              danger.style.setProperty('transform', 'translateX(' + contPos.x + 'px)')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(3000)
            .start()
        }

        setTimeout(() => {
          animate()
        }, 200)
        function animate (time) {
          requestAnimationFrame(animate)
          TWEEN.update(time)
        }

        setTimeout(() => {
          this.dangerData.length = 4
          this.dangerData.unshift(data)
        }, 2500)

        return document.getElementById('map').getElementsByTagName('div')[1].appendChild(target)
      }
    },
    beforeRouteLeave (to, from, next) {
      next()
      let series = []
      this.myChart = echarts.init(document.querySelector('#map'))
      this.myChart.setOption({series: series})
      clearTimeout(this.timer)
    },
    watch: {
      '$route': 'intervalGet',
      langChange (val, oldVal) {
        this.lang = val
        if ('cn' === this.lang) {
          this.changeLang.curLang = this.changeLang.cn
        } else {
          this.changeLang.curLang = this.changeLang.en
        }
        this.initDanger()
      }
    }
  }
</script>

<style lang='less'>
  @import '../assets/less/state.less';
  .aniDanger{
    transform: translateX(30);
  }
  .cont {
    box-sizing: border-box;
    position: absolute;
    top: -25px;
    left: 56px;
    width: 150px;
    height: 0px;
    color: #fff;
    background: rgba(0,0,0,.5);
    opacity: 1;
  }
  .startLine{
    position: absolute;
    width: 0px;
    left: 4px;
    top: 5px;
    height: 1px;
    background: #f00;
    transform: rotate(-30deg);
    transform-origin: 0% 0%;
  }
  .endLine{
    position: absolute;
    width: 0px;
    left: 56px;
    height: 1px;
    top: -25px;
    background: #f00;
  }
</style>
