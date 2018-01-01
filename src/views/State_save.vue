<template>
  <div class='apollo-state'>
    <div class='apollo-state-bg'>
      <div class='apollo-state-map'>
        <div id='map' style='width: 1021px; height: 533px'></div>
        <div class='apollo-state-count'>
          <h1><countTo :startVal='onlineNum.init' :endVal='onlineNum.all' :duration='8000' :autoplay="true"></countTo></h1>
          <p class='apollo-state-count-name'>CARS  ONLINE</p>
          <div class='apollo-state-count-tip'>
            <p><countTo :startVal='intrusionNum.init' :endVal='intrusionNum.all' :duration='5000' :autoplay="true"></countTo> in danger</p>
            <p><countTo :startVal='protectNum.init' :endVal='protectNum.all' :duration='5000' :autoplay="true"></countTo> secure</p>
            <div class='apollo-state-count-line'></div>
            <p><countTo :startVal='protectTime.init' :endVal='protectTime.all' :duration='3000' :autoplay="true"></countTo> online time</p>
          </div>
        </div>
      </div>
      <div class='apollo-state-wrap'>
        <div class='apollo-state-flex apollo-state-danger'>
          <div class='apollo-state-flex-title'>
            <h4>LATEST INTRUSION</h4>
            <p>Total 5</p>
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
            <h4>TOP CONNECTION</h4>
            <p>Total 5</p>
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
          <span v-if="dangerCarPart===1" class="apollo-state-laybox-car-ivi"></span>
          <span v-if="dangerCarPart===2" class="apollo-state-laybox-car-dashboard"></span>
          <span v-if="dangerCarPart===3" class="apollo-state-laybox-car-camera"></span>
          <span v-if="dangerCarPart===4" class="apollo-state-laybox-car-ecu"></span>
          <span v-if="dangerCarPart===5" class="apollo-state-laybox-car-lidar"></span>
          <span v-if="dangerCarPart===6" class="apollo-state-laybox-car-gps"></span>
          <span v-if="dangerCarPart===7" class="apollo-state-laybox-car-canBus"></span>
          <span v-if="dangerCarPart===8" class="apollo-state-laybox-car-tbox"></span>
          <span v-if="dangerCarPart===9" class="apollo-state-laybox-car-carCount"></span>
        </div>
        <div class="apollo-state-laybox-cont" v-for="item in dangerCar">
          <div>
            <h4>CAR’S INFORMATION</h4>
            <p>{{item.uuid}}</p>
            <p>{{item.country}}.{{item.continent}}.{{item.province}}</p>
            <p>{{item.attack_level}}</p>
            <p>{{item.part_name}}</p>
          </div>
          <div>
            <h4>CAR’S INFORMATION</h4>
            <p>{{item.hacker_ip}}</p>
            <p>{{item.hacker_country}}.{{item.hacker_province}}</p>
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
        myChart: {},
        name: 'apollo',
        isDanger: false,
        dangerData: [],
        connectData: [],
        dangerCar: [],
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
        option: {
          title: {
            show: false
          },
          tooltip: {
            trigger: 'item',
            alwaysShowContent: true
          },
          geo: {
            map: 'world',
            label: {
              emphasis: {
                show: false
              }
            },
            zoom: 1.233555,
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
          series: [
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 2,
              rippleEffect: {
                brushType: 'stroke',
                period: 5,
                scale: 8
              },
              tooltip: {
                show: false
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
              symbolSize: 2,
              showEffectOn: 'render',
              itemStyle: {
                normal: {
                  show: false,
                  color: '#46bee9'
                }
              },
              data: []
            },
            {
              type: 'lines',
              coordinateSystem: 'geo',
              zlevel: 2,
              large: true,
              effect: {
                show: true,
                period: 5,
                symbol: 'pin',
                symbolSize: 5,
                trailLength: 0.8,
                loop: true
              },
              tooltip: {
                show: false
              },
              lineStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#00d0f3'
                  }, {
                    offset: 1,
                    color: '#00d0f3'
                  }], false),
                  width: 3,
                  opacity: 0,
                  curveness: 0.2
                }
              },
              data: [],
              silent: true
            },
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 3,
              rippleEffect: {
                brushType: 'stroke',
                period: 5,
                scale: 30
              },
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  show: false
                }
              },
              tooltip: {},
              symbol: 'rect',
              symbolSize: 1,
              data: []
            }
          ]
        }
      }
    },
    components: { countTo },
    created () {
      this.$http.get('http://localhost:3000/getLatestIntrusion').then((res) => {
        this.dangerData = res.data
      }, (err) => {
        console.log(err)
      })

      this.$http.get('http://localhost:3000/getTopConnection').then((res) => {
        this.connectData = res.data
      }, (err) => {
        console.log(err)
      })
    },
    mounted () {
      this.getDanger()
      setInterval(() => {
        this.getDanger()
      }, 8000)
    },
    methods: {
      getDanger: function () {
        this.$http.get('http://localhost:3000/getBallMultiData').then((res) => {
          const data = []
          const dataPoint = []
          const dataLine = []
          //数组替换形式
          res.data.ballIntrusion.map((item) => {
            const city = {}
            city.name = item.country
            city.value = [Number(item.longitude), Number(item.latitude)]
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
            data.push(city)
          })

          console.log(res.data)

          data.length = 1

          res.data.topConnection.forEach((item) => {
            const point = {
              'value': [Number(item.latitude), Number(item.longitude)],
              'symbolSize': 1,
              'itemStyle': {
                'normal': {
                  'color': '#00d0f3'
                }
              }
            }
            dataPoint.push(point)
            item.targets.forEach((itemLine) => {
              const line = {
                'coords': [
                  [Number(item.latitude), Number(item.longitude)],
                  [Number(itemLine.Lat), Number(itemLine.Ing)]
                ]
              }
              const point = [Number(itemLine.Lat), Number(itemLine.Ing)]
              dataLine.push(line)
              dataPoint.push(point)
            })
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
          dataLine.length = 5
          dataPoint.length = 5
          this.option.series[0].data = dataPoint
          this.option.series[1].data = dataLine
          this.option.series[2].tooltip = {
            position: (p) => {
              this.pos.x = p[0] - 4
              this.pos.y = p[1] - 5
              return [p[0] - 4, p[1] - 5]
            },
            formatter: () => {
              setTimeout(() => {
                return this.init(res.data.ballIntrusion[0], this.pos)
              })
            },
            backgroundColor: 'transparent'
          }
          this.option.series[2].data = data
          this.myChart = echarts.init(document.querySelector('#map'))

          this.myChart.setOption(this.option, true)
          this.myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 2,
            dataIndex: 0
          })
        })
      },
      showDetail: function (item) {
        this.$http.get('http://localhost:3000/getIntrusionDetail', {
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
            .to({x: 60}, 500)
            .onUpdate(() => {
              startLine.style.setProperty('width', w.x + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(0)
            .start()

          var wb = {x: 60}
          new TWEEN.Tween(wb)
            .to({x: 0}, 500)
            .onUpdate(() => {
              startLine.style.setProperty('width', wb.x + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(3000)
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
            .to({x: 150}, 1000)
            .onUpdate(() => {
              endLine.style.setProperty('width', w.x + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(500)
            .start()

          new TWEEN.Tween(wb)
            .to({x: 0}, 1000)
            .onUpdate(() => {
              endLine.style.setProperty('width', wb.x + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(2000)
            .start()
          return endLine
        }

        function createCont (interpolation) {
          const cont = document.createElement('div')
          cont.className = 'cont'
          target.appendChild(cont)

          const obj = {x: 0}
          new TWEEN.Tween(obj)
            .to({x: 80}, 1000)
            .onUpdate(() => {
              cont.style.setProperty('height', obj.x + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(500)
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
            .to({o: 1}, 300)
            .onUpdate(() => {
              contData.style.setProperty('opacity', o.o)
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(300)
            .start()
          return contData
        }

        function moveTip (interpolation, pos) {
          const cont = document.getElementById('map').getElementsByTagName('div')[1]
          cont.style.display = 'block'
          const contPos = {x: pos.x, y: pos.y, o: 1}
          new TWEEN
            .Tween(contPos)
            .to({x: 300, y: 450}, 1500)
            .onUpdate(() => {
              cont.style.setProperty('left', contPos.x + 'px')
              cont.style.setProperty('top', contPos.y + 'px')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(2500)
            .start()

          return cont
        }

        function hideTip (interpolation) {
          const cont = document.getElementById('map').getElementsByTagName('div')[1]
          const contPos = {o: 1}
          new TWEEN
            .Tween(contPos)
            .to({o: 0}, 800)
            .onUpdate(() => {
              cont.style.setProperty('opacity', contPos.o)
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(3500)
            .start()

          return cont
        }

        function moveDanger (interpolation) {
          const danger = document.getElementById('aniDanger')
          const contPos = {x: 0}
          new TWEEN
            .Tween(contPos)
            .to({x: 0}, 800)
            .onUpdate(() => {
              danger.style.setProperty('transform', 'translateX(' + contPos.x + 'px)')
            })
            .interpolation(interpolation)
            .easing(TWEEN.Easing.Linear.None)
            .delay(3500)
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
        }, 4000)

        return document.getElementById('map').getElementsByTagName('div')[1].appendChild(target)
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
