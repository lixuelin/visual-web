 <template>
    <div>
      <table class="apollo-table" >
        <thead>
          <tr>
            <th v-for="item in tableData.theadData">
              <div>
                <span v-if="item.name">{{item.name}}</span>
                <div v-if="item.type == 'check'">
                  <label :class="{checkLabel: checked}" @click="checkAll($event)"></label>
                </div>
                <span v-if="item.type == 'sort'" @click="sortList(item, $event)" class="apollo-table-sort">
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody ref="tbodyCheck">
          <tr v-for="(item,index) in tableData.tbodyData" ref="index">
            <td v-if="tableData.isCheck">
              <div style="display: flex">
                <label @click="depCheck($event, item, index)"></label>
              </div>
            </td>
            <td v-for="(value,key) in item" v-if="key!=='id'">
              <div class="apollo-table-status" v-if="key==='status'">
                <span v-if="value==1" class="apollo-table-safeIcon"></span>
                <span v-if="value==2" class="apollo-table-safeIcon"></span>
                <span v-if="value==4" class="apollo-table-dangerIcon"></span>
                <span v-if="value==3" class="apollo-table-dubiousIcon"></span>
              </div>
              <span v-else>{{value}}</span>
            </td>
            <td v-if="tableData.isSet" width="24%">
              <div style="display: flex; align-items: center">
                <button v-if="tableData.set.detail" class="apollo-btn apollo-btn-default" @click="showDetail(item)">
                  <span class="apollo-icon apollo-icon-msg"></span>
                </button>
                <button v-if="tableData.set.msgBd" class="apollo-btn apollo-btn-default" @click="addMonitor(item)">
                  <span class="apollo-icon apollo-icon-plus"></span>
                </button>
                <button v-if="tableData.set.rem" class="apollo-btn apollo-btn-default" @click="remMonitor(item)">
                  <span class="apollo-icon apollo-icon-minus"></span>
                </button>
                <button v-if="tableData.set.add" class="apollo-btn apollo-btn-default" @click="conactBaidu(item)" @mouseout="showBaidu=null" @mouseover="showBaidu=index">
                  <span class="apollo-icon apollo-icon-baidu"></span>
                  <span v-show="index==showBaidu">{{changeLang.curLang.baidu}}</span></button>
                <button v-if="tableData.set.remove" class="apollo-btn apollo-btn-default" @click="callUser(item)" @mouseout="showCar=null" @mouseover="showCar=index">
                  <span class="apollo-icon apollo-icon-talk"></span>
                  <span v-show="index==showCar">{{changeLang.curLang.talk}}</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <car-loginfo v-bind:carUuid = "carUuid" v-show="isShow"  v-on:closeCarLogDialog = "closeCarLogDialog"></car-loginfo>
    </div>
</template>

<script>
  import carLogInfo from '../components/carLogInfo'
  export default {
    name: 'table',
    data () {
      return {
        lang: this.$store.state.lang,
        changeLang: {
          cn: {
            baidu: '通知百度',
            talk: '通知车辆'
          },
          en: {
            baidu: 'connect Baidu',
            talk: 'connect car'
          },
          curLang: {}
        },
        checked: false,
        showCar: null,
        showBaidu: null,
        index: null,
        carUuid: 'YDFNK4391090',
        isShow: false,
        set: {
          detail: 'detail',
          msgBd: 'msgBd',
          add: 'add',
          remove: 'remove'
        },
        checkList: []
      }
    },
    props: [
      'tableData',
      'method',
      'addser',
      'clearCheck'
    ],
    ready () {
      this.tableData.tbodyData.map((item) => {
        this.$set(item, 'isCheck', false)
      })
    },
    components: {
      'carLoginfo': carLogInfo
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
    },
    methods: {
      depCheck (e, item, index) {
        if (e.srcElement.className) {
          e.srcElement.className = ''
          this.checkList.forEach((itemCheck) => {
            if (item.id === itemCheck.id) {
              this.checkList.splice(0, 1)
            }
          })
          e.srcElement.parentElement.parentElement.parentElement.style.background = ''
          this.$emit('mag', this.checkList)
        } else {
          e.srcElement.className = 'checkLabel'
          e.srcElement.parentElement.parentElement.parentElement.style.background = '#1a2535'
          this.checkList.push(item)
        }
      },
      removeCheck () {
        if (this.checkList.length === 0) {
          this.$refs.tbodyCheck.querySelectorAll('tr').forEach((item) => {
            let setLabel = item.querySelector('label')
            item.setAttribute('style', '')
            setLabel.setAttribute('class', '')
          })
        }
      },
      sortList (item, e) {
        this.method()
        if (e.currentTarget.getAttribute('class') === 'apollo-table-sort') {
          e.currentTarget.className = 'apollo-table-resver'
        } else {
          e.currentTarget.className = 'apollo-table-sort'
        }
      },
      checkAll (e) {
        if (e.srcElement.className) {
          e.srcElement.className = ''
          this.checkList = []
          this.$refs.tbodyCheck.querySelectorAll('tr').forEach((item) => {
            let setLabel = item.querySelector('label')
            item.setAttribute('style', '')
            setLabel.setAttribute('class', '')
          })
          this.$emit('mag', this.checkList)
        } else {
          e.srcElement.className = 'checkLabel'
          this.tableData.tbodyData.forEach((item) => {
            this.checkList.push(item)
          })

          this.$refs.tbodyCheck.querySelectorAll('tr').forEach((item) => {
            let setLabel = item.querySelector('label')
            item.setAttribute('style', 'background: #1a2535')
            setLabel.setAttribute('class', 'checkLabel')
          })
        }
      },
      showDetail (item) {
        this.isShow = true
        this.carUuid = item.time
      },
      closeCarLogDialog (data) {
        this.isShow = data
      },
      addMonitor (item) {
        var a = 2
        this.$emit('addver', [item.time, a])
      },
      conactBaidu (item) {
        var a = 3
        this.$emit('addver', [item.time, a])
      },
      callUser (item) {
        var a = 4
        this.$emit('addver', [item.time, a])
      },
      remMonitor (item) {
        var a = 5
        this.$emit('addver', [item.id, a])
      }
    },
    watch: {
      'checkList': {
        handler: function (val, oldVal) {
          console.log(val)
          if (val.length === this.tableData.tbodyData.length) {
            this.checked = true
          } else {
            this.checked = false
          }
          this.$emit('mag', this.checkList)
        },
        deep: true
      },
      langChange (val, oldVal) {
        this.lang = val
        if ('cn' === this.lang) {
          this.changeLang.curLang = this.changeLang.cn
        } else {
          this.changeLang.curLang = this.changeLang.en
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import url('../assets/less/carLogInfo.less');
  @import url('../assets/less/vehicle.less');
  @import "../assets/less/component/table.less";
</style>
