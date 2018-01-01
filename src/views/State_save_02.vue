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
        option: {
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
      }
    },
    components: { countTo },
    created () {
      this.getDanger()
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
      this.myChart = echarts.init(document.querySelector('#map'))
      this.myChart.setOption(this.option)

      this.getDanger()
      console.time('get')
      this.intervalGet()
      console.timeEnd('get')
    },
    methods: {
      intervalGet: function () {
        if (this.$route.name === 'State') {
          this.timer = setInterval(() => {
            this.getDanger()
          }, 2000)
        } else {
          return console.log(this.$route.name)
        }
      },
      getDanger: function () {
        let geoCoordMap = {
          '测试1': [-77.013222, 38.913611],
          '测试2': [89.47477, 30.669926],
          '测试3': [102.882484, 30.960243],
          '测试4': [-85.34099, 41.15332],
          '测试5': [-67.01193, -10.94536],
          '测试6': [50.59059, 57.888645],
          '测试7': [-100.05147, 38.63391],
          '测试8': [93.67255, 54.493504],
          '上海': [121.4648, 31.2891],
          '东莞': [113.8953, 22.901],
          '东营': [118.7073, 37.5513],
          '中山': [113.4229, 22.478],
          '临汾': [111.4783, 36.1615],
          '临沂': [118.3118, 35.2936],
          '丹东': [124.541, 40.4242],
          '丽水': [119.5642, 28.1854],
          '乌鲁木齐': [87.9236, 43.5883],
          '佛山': [112.8955, 23.1097],
          '保定': [115.0488, 39.0948],
          '兰州': [103.5901, 36.3043],
          '包头': [110.3467, 41.4899],
          '北京': [116.4551, 40.2539],
          '北海': [109.314, 21.6211],
          '南京': [118.8062, 31.9208],
          '南宁': [108.479, 23.1152],
          '南昌': [116.0046, 28.6633],
          '南通': [121.1023, 32.1625],
          '厦门': [118.1689, 24.6478],
          '台州': [121.1353, 28.6688],
          '合肥': [117.29, 32.0581],
          '呼和浩特': [111.4124, 40.4901],
          '咸阳': [108.4131, 34.8706],
          '哈尔滨': [127.9688, 45.368],
          '唐山': [118.4766, 39.6826],
          '嘉兴': [120.9155, 30.6354],
          '大同': [113.7854, 39.8035],
          '大连': [122.2229, 39.4409],
          '天津': [117.4219, 39.4189],
          '太原': [112.3352, 37.9413],
          '威海': [121.9482, 37.1393],
          '宁波': [121.5967, 29.6466],
          '宝鸡': [107.1826, 34.3433],
          '宿迁': [118.5535, 33.7775],
          '常州': [119.4543, 31.5582],
          '广州': [113.5107, 23.2196],
          '廊坊': [116.521, 39.0509],
          '延安': [109.1052, 36.4252],
          '张家口': [115.1477, 40.8527],
          '徐州': [117.5208, 34.3268],
          '德州': [116.6858, 37.2107],
          '惠州': [114.6204, 23.1647],
          '成都': [103.9526, 30.7617],
          '扬州': [119.4653, 32.8162],
          '承德': [117.5757, 41.4075],
          '拉萨': [91.1865, 30.1465],
          '无锡': [120.3442, 31.5527],
          '日照': [119.2786, 35.5023],
          '昆明': [102.9199, 25.4663],
          '杭州': [119.5313, 29.8773],
          '枣庄': [117.323, 34.8926],
          '柳州': [109.3799, 24.9774],
          '株洲': [113.5327, 27.0319],
          '武汉': [114.3896, 30.6628],
          '汕头': [117.1692, 23.3405],
          '江门': [112.6318, 22.1484],
          '沈阳': [123.1238, 42.1216],
          '沧州': [116.8286, 38.2104],
          '河源': [114.917, 23.9722],
          '泉州': [118.3228, 25.1147],
          '泰安': [117.0264, 36.0516],
          '泰州': [120.0586, 32.5525],
          '济南': [117.1582, 36.8701],
          '济宁': [116.8286, 35.3375],
          '海口': [110.3893, 19.8516],
          '淄博': [118.0371, 36.6064],
          '淮安': [118.927, 33.4039],
          '深圳': [114.5435, 22.5439],
          '清远': [112.9175, 24.3292],
          '温州': [120.498, 27.8119],
          '渭南': [109.7864, 35.0299],
          '湖州': [119.8608, 30.7782],
          '湘潭': [112.5439, 27.7075],
          '滨州': [117.8174, 37.4963],
          '潍坊': [119.0918, 36.524],
          '烟台': [120.7397, 37.5128],
          '玉溪': [101.9312, 23.8898],
          '珠海': [113.7305, 22.1155],
          '盐城': [120.2234, 33.5577],
          '盘锦': [121.9482, 41.0449],
          '石家庄': [114.4995, 38.1006],
          '福州': [119.4543, 25.9222],
          '秦皇岛': [119.2126, 40.0232],
          '绍兴': [120.564, 29.7565],
          '聊城': [115.9167, 36.4032],
          '肇庆': [112.1265, 23.5822],
          '舟山': [122.2559, 30.2234],
          '苏州': [120.6519, 31.3989],
          '莱芜': [117.6526, 36.2714],
          '菏泽': [115.6201, 35.2057],
          '营口': [122.4316, 40.4297],
          '葫芦岛': [120.1575, 40.578],
          '衡水': [115.8838, 37.7161],
          '衢州': [118.6853, 28.8666],
          '西宁': [101.4038, 36.8207],
          '西安': [109.1162, 34.2004],
          '贵阳': [106.6992, 26.7682],
          '连云港': [119.1248, 34.552],
          '邢台': [114.8071, 37.2821],
          '邯郸': [114.4775, 36.535],
          '郑州': [113.4668, 34.6234],
          '鄂尔多斯': [108.9734, 39.2487],
          '重庆': [107.7539, 30.1904],
          '金华': [120.0037, 29.1028],
          '铜川': [109.0393, 35.1947],
          '银川': [106.3586, 38.1775],
          '镇江': [119.4763, 31.9702],
          '长春': [125.8154, 44.2584],
          '长沙': [113.0823, 28.2568],
          '长治': [112.8625, 36.4746],
          '阳泉': [113.4778, 38.0951],
          '青岛': [120.4651, 36.3373],
          '韶关': [113.7964, 24.7028]
        }
        let SHData = [
          [{
            name: '上海'
          }, {
            name: '测试1',
            value: 95
          }],
          [{
            name: '上海'
          }, {
            name: '昆明',
            value: 90
          }],
          [{
            name: '上海'
          }, {
            name: '测试2',
            value: 80
          }],
          [{
            name: '上海'
          }, {
            name: '郑州',
            value: 70
          }],
          [{
            name: '上海'
          }, {
            name: '测试3',
            value: 60
          }],
          [{
            name: '上海'
          }, {
            name: '重庆',
            value: 50
          }],
          [{
            name: '上海'
          }, {
            name: '长沙',
            value: 40
          }],
          [{
            name: '上海'
          }, {
            name: '北京',
            value: 30
          }],
          [{
            name: '上海'
          }, {
            name: '丹东',
            value: 20
          }],
          [{
            name: '上海'
          }, {
            name: '大连',
            value: 10
          }]
        ]
        let GZData = [
          [{
            name: '广州'
          }, {
            name: '测试4',
            value: 95
          }],
          [{
            name: '广州'
          }, {
            name: '太原',
            value: 90
          }],
          [{
            name: '广州'
          }, {
            name: '长春',
            value: 80
          }],
          [{
            name: '广州'
          }, {
            name: '重庆',
            value: 70
          }],
          [{
            name: '广州'
          }, {
            name: '测试5',
            value: 60
          }],
          [{
            name: '广州'
          }, {
            name: '成都',
            value: 50
          }],
          [{
            name: '广州'
          }, {
            name: '常州',
            value: 40
          }],
          [{
            name: '广州'
          }, {
            name: '测试6',
            value: 30
          }],
          [{
            name: '广州'
          }, {
            name: '北海',
            value: 20
          }],
          [{
            name: '广州'
          }, {
            name: '海口',
            value: 10
          }]
        ]
        let convertData = function (data) {
          var res = []
          for (var i = 0; i < data.length; i++) {
            var dataItem = data[i]
            var fromCoord = geoCoordMap[dataItem[0].name]
            var toCoord = geoCoordMap[dataItem[1].name]
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
        let color = ['#a6c84c', '#ffa022', '#46bee9']

        setInterval(() => {
          setTimeout(() => {
            this.option.serise = []
            let data = [['上海', SHData]]
            data.forEach((item, i) => {
              this.option.serise.push({
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
                data: item[1].map(function (dataItem) {
                  return {
                    name: dataItem[1].name,
                    value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                  }
                })
              })
            })

            this.myChart.setOption({
              series: this.option.serise
            })
          }, 2000)

          setTimeout(() => {
            this.option.serise = []
            let data = [['广州', GZData]]
            data.forEach((item, i) => {
              this.option.serise.push({
                name: item[0] + ' Top10',
                type: 'lines',
                zlevel: 1,
                effect: {
                  show: true,
                  period: 2,
                  trailLength: 0.5,
                  color: '#fff',
                  symbolSize: 3,
                  loop: false
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
                data: item[1].map(function (dataItem) {
                  return {
                    name: dataItem[1].name,
                    value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                  }
                })
              })
            })
            this.myChart.setOption({
              series: this.option.serise
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
