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
        timer: '',
        lineData01: [],
        lineData02: [],
        geoCoordMap01: {},
        geoCoordMap02: {}
      }
    },
    components: { countTo },
    created () {
      this.$http.get('http://localhost:3000/getLatestIntrusion').then((res) => {
        this.dangerData = res.data
        console.log(this.dangerData)
      }, (err) => {
        console.log(err)
      })
      console.log(this.$route)
      this.$http.get('http://localhost:3000/getTopConnection').then((res) => {
        this.connectData = res.data
      }, (err) => {
        console.log(err)
      })
    },
    mounted () {
      this.getLineData()
      setTimeout(() => {
        this.getDanger()
      }, 8000)
      // this.intervalGet()
    },
    methods: {
      intervalGet: function () {
        if (this.$route.name === 'State') {
          this.timer = setInterval(() => {
            this.getDanger()
          }, 5000)
        } else {
          return console.log(this.$route.name)
        }
      },
      getLineData: function () {
        if (this.lineData01 === '' && this.lineData02 === '') {
          return false
        } else {
          for (let i = 0; i < 2; i++) {
            if (i === 0) {
              this.$http.get('http://localhost:3000/getBallMultiDataTimeMap').then((res) => {
                console.log(res.data)
                const data = []
                this.lineData01 = [['源', []]]
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
                  data.push(city)
                })
                let i = 0
                res.data.topConnection.forEach((item, index) => {
                  this.geoCoordMap01['源' + index] = [Number(item.longitude), Number(item.latitude)]
                  item.targets.forEach((itemLine) => {
                    let nameId = i++
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
                    this.lineData01[0][1].push(line)
                    this.geoCoordMap01['目的' + nameId] = point
                  })
                })
                console.log(this.lineData01)
              })
            }
            if (i === 1) {
              this.$http.get('http://localhost:3000/getBallMultiDataTimeMap').then((res) => {
                console.log(res.data)
                const data = []
                this.lineData02 = [['源', []]]
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
                  data.push(city)
                })
                let d = 0
                res.data.topConnection.forEach((item, index) => {
                  this.geoCoordMap02['源' + index] = [Number(item.longitude), Number(item.latitude)]
                  item.targets.forEach((itemLine) => {
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
                    this.lineData02[0][1].push(line)
                    this.geoCoordMap02['目的' + nameId] = point
                  })
                })
                console.log(this.lineData02)
              })
            }
          }
        }
      },
      getDanger: function () {
        this.myChart = echarts.init(document.querySelector('#map'))
        let geoCoordMap = {
          '测试1': [-77.013222, 38.913611],
          '测试2': [89.47477, 30.669926],
          '测试3': [-115.95958, 42.077965],
          '测试4': [102.882484, 30.960243],
          '测试5': [-85.34099, 41.15332],
          '测试6': [-67.01193, -10.94536],
          '测试7': [50.59059, 57.888645],
          '测试8': [-100.05147, 38.63391],
          '上海': [93.67255, 54.493504],
          '东莞': [-122.1959, 47.365],
          '东营': [83.620544, 22.741442],
          '中山': [-81.7381, 45.38944],
          '临汾': [41.81904, 38.19797],
          '临沂': [-95.68024, 54.67268],
          '丹东': [-65.37769, -9.78943],
          '丽水': [95.11551, 46.795628],
          '乌鲁木齐': [-99.79695, 32.63207],
          '佛山': [46.17227, 23.872107],
          '保定': [104.990963, 12.565679],
          '兰州': [96.947655, 57.303024]
        }

        let data01 = [
          [{
            name: '测试1'
          }, {
            name: '测试2',
            value: 95
          }],
          [{
            name: '测试1'
          }, {
            name: '测试3',
            value: 90
          }],
          [{
            name: '测试1'
          }, {
            name: '测试4',
            value: 80
          }],
          [{
            name: '测试1'
          }, {
            name: '测试5',
            value: 70
          }],
          [{
            name: '测试1'
          }, {
            name: '测试6',
            value: 60
          }],
          [{
            name: '测试1'
          }, {
            name: '测试7',
            value: 50
          }],
          [{
            name: '测试1'
          }, {
            name: '测试8',
            value: 40
          }],
          [{
            name: '测试1'
          }, {
            name: '上海',
            value: 30
          }]
        ]

        let data02 = [
          [{
            name: '东莞'
          }, {
            name: '东营',
            value: 95
          }],
          [{
            name: '东莞'
          }, {
            name: '中山',
            value: 90
          }],
          [{
            name: '东莞'
          }, {
            name: '临汾',
            value: 80
          }],
          [{
            name: '东莞'
          }, {
            name: '临沂',
            value: 70
          }],
          [{
            name: '丹东'
          }, {
            name: '丽水',
            value: 60
          }],
          [{
            name: '东莞'
          }, {
            name: '乌鲁木齐',
            value: 50
          }],
          [{
            name: '东莞'
          }, {
            name: '佛山',
            value: 40
          }],
          [{
            name: '东莞'
          }, {
            name: '保定',
            value: 30
          }],
          [{
            name: '东莞'
          }, {
            name: '兰州',
            value: 20
          }]
        ]
        let planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        let convertData = (data) => {
          let res = []
          for (let i = 0; i < data.length; i++) {
            let dataItem = data[i]
            let fromCoord = geoCoordMap[dataItem[0].name]
            let toCoord = geoCoordMap[dataItem[1].name]
            if (fromCoord && toCoord) {
              res.push([{
                coord: fromCoord
              }, {
                coord: toCoord
              }])
            }
          }
          console.log(res)
          return res
        }

        let color = ['#a6c84c', '#ffa022', '#46bee9']
        let option = {
          backgroundColor: '#404a59',
          title: {
            text: '模拟迁徙',
            subtext: '数据纯属虚构',
            left: 'center',
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'item'
          },
          geo: {
            map: 'world',
            label: {
              emphasis: {
                show: false
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#404a59'
              },
              emphasis: {
                areaColor: '#2a333d'
              }
            }
          },
          series: []
        }

        this.myChart.setOption(option)
        setInterval(() => {
          setTimeout(() => {
            let series = []
            let data = [
              ['上海', data01]
            ]
            data.forEach((item, i) => {
              series.push({
                name: item[0] + ' Top10',
                type: 'lines',
                zlevel: 1,
                effect: {
                  show: true,
                  period: 2,
                  trailLength: 0.7,
                  color: '#fff',
                  symbolSize: 3,
                  loop: true
                },
                lineStyle: {
                  normal: {
                    color: color[i],
                    width: 0,
                    curveness: 0.2
                  }
                },
                data: convertData(item[1])
              }, {
                name: item[0] + ' Top10',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                  brushType: 'stroke'
                },
                label: {
                  normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                  }
                },
                symbolSize: function (val) {
                  return val[2] / 8
                },
                itemStyle: {
                  normal: {
                    color: color[i]
                  }
                },
                data: item[1].map((dataItem) => {
                  return {
                    name: dataItem[1].name,
                    value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                  }
                })
              })
            })

            this.myChart.setOption({
              series: series
            })
          }, 2000)

          setTimeout(() => {
            let series = []
            let data = [
              ['广州', data02]
            ]
            data.forEach((item, i) => {
              series.push({
                name: item[0] + ' Top10',
                type: 'lines',
                zlevel: 1,
                effect: {
                  show: true,
                  period: 2,
                  trailLength: 0.7,
                  color: '#fff',
                  symbolSize: 3,
                  loop: true
                },
                lineStyle: {
                  normal: {
                    color: color[i],
                    width: 0,
                    curveness: 0.2
                  }
                },
                data: convertData(item[1])
              }, {
                name: item[0] + ' Top10',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                  brushType: 'stroke'
                },
                label: {
                  normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                  }
                },
                symbolSize: function (val) {
                  return val[2] / 8
                },
                itemStyle: {
                  normal: {
                    color: color[i]
                  }
                },
                data: item[1].map((dataItem) => {
                  return {
                    name: dataItem[1].name,
                    value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                  }
                })
              })
            })

            this.myChart.setOption({
              series: series
            })
          }, 4000)
        }, 6000)
      },
      showDetail: function (item) {
        this.$http.get('http://localhost:3000/getIntrusionDetail', {
          params: {
            id: item.id
          }
        })
          .then((res) => {
            console.log(res.data)
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
    },
    beforeRouteLeave (to, from, next) {
      next()
      clearInterval(this.timer)
    },
    watch: {
      '$route': 'intervalGet'
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
