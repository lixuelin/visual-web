<template>
	<div class="pageContent">
	
	    <!-- 测试车辆日志弹出组件 开始 -->
	    <!--<car-loginfo v-bind:carUuid = "carUuid" v-show="isShow"  v-on:closeCarLogDialog = "closeCarLogDialog"></car-loginfo>
        
        <button type="button" class="btn resetBtn" @click="showCarLogDialog('DQSFF5243478')">显示对话框0</button>
        <button type="button" class="btn resetBtn" @click="showCarLogDialog('SEOWH3367836')">显示对话框2</button>
        <button type="button" class="btn resetBtn" @click="showCarLogDialog('HNFJY6737457')">显示对话框3</button> 
		-->
	    <!-- 测试车辆日志弹出组件 结束 -->
		
		<div class="queryBar">
			<div class="wraper">
 				<div class="number">{{langData.curLanguageData.tQueryLoopholeNum}}<input class = "underline whiteFont"  v-model="param.vulner_id" /></div>
				<div class="version">
				   {{langData.curLanguageData.tQueryEffectVersion}}
				   
				   <div class = "inputOuter" >
				       <input class="underline" v-model="param.vulner_version"  @click="showVersionSelect" readonly>
					   <div id="inputSelect" @click="selectData" v-show = "isShowSelect">
						   <span>ASEC1.0</span>
						   <span>ASEC1.1</span>
						   <span>ASEC1.2</span>
						   <span>ASEC1.3</span>
						   <span>ASEC1.4</span>
						   <span>ASEC1.5</span>
					   </div>
				   </div>
				   
				   <div class="selectAngle"></div>
				</div>
				<button type="button" class="btn queryBtn" v-bind:class = "{active:buttonActiveState.queryActive}" @click="query">{{langData.curLanguageData.tBtnQuery}}</button>
				<button type="button" class="btn resetBtn" v-bind:class = "{active:buttonActiveState.resetActive}" @click="reset">{{langData.curLanguageData.tBtnReset}}</button>
			</div>
		</div>

		<div class="data">
			<div v-for=" obj in pageData" >
			
				<div class= "oneData">
					<div class="title">
						<span>{{langData.curLanguageData.tContentNum}} {{obj.vulner_id}}</span>    
						<span>{{langData.curLanguageData.tContentEffectVersion}}：{{obj.vulner_version}}</span>
						<span>{{langData.curLanguageData.tContentDangerLevel}}： {{obj.level_name}}</span>    
						<span>{{obj.datetimeFormat}}</span>
					</div>
					<div class="content">
						<div class="part">
							<div class="partTitle">{{langData.curLanguageData.tContentIntroduction}}：</div>
							<div class="partContent">{{obj.vulner_des}}</div>
						</div>
						<div class="part">
							<div class="partTitle">{{langData.curLanguageData.tContentAdvise}}：</div>
							<div class="partContent">{{obj.vulner_assisent}}</div>
						</div>
					</div>
				</div>
					
			</div>
    	</div>
		
        <page-view :page="pagingInfo" @pageOpt="pageOpt"></page-view>
	</div>
</template>
<script>
  import carLogInfo from '../components/carLogInfo'//测试车辆日志弹出页使用
  import page from '../components/page'

  export default {
  
    name: 'intelligence',
	data () {//返回对象为页面使用的数据	   
	   return {
	   
	      isShow: false,// 测试车辆日志组件使用  
	      carUuid:'VYLPH5167000',//测试车辆日志组件使用
		  
		  buttonActiveState:{//按钮状态控制
		    queryActive: false,
			resetActive: false
		  },
		  isShowSelect : false ,//控制下拉框显示隐藏
	      pageData: [],
		  
		  langData:{//语言信息
		     en:{
			   tQueryLoopholeNum:'Vulnerability ID',
			   tQueryEffectVersion:'Effected Version',
			   tBtnQuery:'Search',
			   tBtnReset:'Reset',
			   tContentNum:'Vulnerability ID',
			   tContentEffectVersion:'Effected Version',
			   tContentDangerLevel:'Vulnerability Degree',
			   tContentIntroduction:'Introduction',
			   tContentAdvise:'Advise'
			 },
		     curLanguageData:{
			   tQueryLoopholeNum:'Vulnerability ID',
			   tQueryEffectVersion: 'Effected Version',
			   tBtnQuery:'Search',
			   tBtnReset:'Reset',
			   tContentNum:'Vulnerability ID',
			   tContentEffectVersion:'Effect Version',
			   tContentDangerLevel:'Vulnerability Degree',
			   tContentIntroduction:'Introduction',
			   tContentAdvise:'Advise'
			 },
			 cn:{
			   tQueryLoopholeNum:'漏洞编号',
			   tQueryEffectVersion:'影响版本',
			   tBtnQuery:'查询',
			   tBtnReset:'重置',
			   tContentNum:'编号',
			   tContentEffectVersion:'影响版本',
			   tContentDangerLevel:'危害程度',
			   tContentIntroduction:'简介',
			   tContentAdvise:'建议'
			 }
		  },
		  dataUrl: 'http://localhost:3000/getIntelligenceList',
		  param : {
		    language:'en',//默认英文
		    vulner_id : '',
			vulner_version:''		
		  },
		  initPagingInfo:{//查询 重置按钮  等需要重置分页配置时使用
		    count: 0,
		    perPage: 4,
			currentPage: 1
		  },
		  pagingInfo: {
		    count: 0,
		    perPage: 4,
			currentPage: 1
		  }
	   };
	},
	components:{
	  'carLoginfo':carLogInfo,//测试车辆日志弹出页使用
	  'pageView': page
	},
	mounted (){
	  //初始化语言数据
      this.param.language = this.$store.state.lang
	  if("cn" == this.param.language){//请求中文
		this.langData.curLanguageData = this.langData.cn;
	  }
	  if("en" == this.param.language){//请求英文
		this.langData.curLanguageData = this.langData.en;
	  }
	  this.getData()  
	},
    watch:{
	   getLanguage(newVal,oldVal){//监控语言切换  重新请求数据
	      this.param.language = newVal;
		  if("cn" == this.param.language){//请求中文
		    this.langData.curLanguageData = this.langData.cn;
		  }
		  if("en" == this.param.language){//请求英文
		    this.langData.curLanguageData = this.langData.en;
		  }
		  this.getData()
	   }
	},
    computed: {
	  getLanguage(){
	    return this.$store.state.lang
	  }
    },
	methods:{ //define scope methods
	
	   showCarLogDialog(id){ //点击显示车辆日志弹出框   测试车辆日志组件使用
		  this.carUuid = id 
	      this.isShow = true;
	   },
       closeCarLogDialog(data){//关闭对话框  测试车辆日志组件使用  
		  this.isShow = data;
	   },	   
	
	   
	   
	   query(){//查询
	      this.buttonActiveState.queryActive = true;
		  this.buttonActiveState.resetActive = false;
		  //重置分页
		  this.pagingInfo.perPage = this.initPagingInfo.perPage;
		  this.pagingInfo.currentPage = this.initPagingInfo.currentPage;
		  
	      this.getData()
	   },
	   reset(){//重置查询条件
	      this.param.vulner_id = '';
		  this.param.vulner_version = '';
		  
		  //重置分页
		  this.pagingInfo.perPage = this.initPagingInfo.perPage;
		  this.pagingInfo.currentPage = this.initPagingInfo.currentPage;
		  
		  this.buttonActiveState.queryActive = false;
		  //this.buttonActiveState.resetActive = true;//重置按钮不应该有已点击和不可用状态
	   },
	   
	   
	   showVersionSelect(){//下拉框 - 显示版本下拉框
	      this.isShowSelect = !this.isShowSelect
	   },
	   selectData(){//下拉框 - 选择下拉框数据
	     if('span' === event.target.tagName.toLowerCase()){
		    this.param.vulner_version = event.target.innerHTML
			this.isShowSelect = false;		 
		 }
	   },
	   
	   
	   //请求数据方法
	   getData() {
		  var tempObj = Object.assign(this.param,this.pagingInfo)
		  //this.$http.get(this.dataUrl,{params: tempObj}).then(
		  this.$http.get(this.dataUrl,{params: {
            language: this.param.language,
		    vulner_id : this.param.vulner_id,
			vulner_version:this.param.vulner_version,	
            perpage: this.pagingInfo.perPage,
            currentPage: this.pagingInfo.currentPage		  
		}}).then(
		  
			  response => {
				this.pageData = response.data.data
				this.pagingInfo.count = response.data.count;
			  }
			  , response => {
				console.log('error')
			  }
		  )
	   },
       pageOpt: function (data) {
         this.pagingInfo.perPage = data.perpage
         this.pagingInfo.currentPage = data.currentPage
		 this.getData()
	   }
	
	}
  }

</script>

<style scoped lang="less">
  @import url('../assets/less/intelligence.less');
</style>
