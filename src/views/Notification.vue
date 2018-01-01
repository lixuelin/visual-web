<template>
  <div class="pageContent">
    <div class="tab">
      <div id="notifiTab" v-bind:class="{active:tabSelectStatus.carMessage}"  @click="switchToCarMessage">{{langData.curLanguageData.tContentNoticeCar}}</div>
      <div id="contactTab" v-bind:class="{active:tabSelectStatus.baiduMessage}" @click="switchToBaiduMessage">{{langData.curLanguageData.tContentContactBaidu}}</div>
    </div>

    <div class="data" id="notifiTabData">
	
      <div v-for=" obj in pageData" >
	  
		  <div class= "oneData">
			<div class="title">
			  <span>{{obj.type}}</span>    <span>{{obj.date}}</span>
			</div>
			<div class="content">
				<div v-for=" id in obj.uuids">
				   {{id}}
				</div>
			</div>
		  </div>
	  
	  </div>
     <page-view :page="pagingInfo" @pageOpt="pageOpt" ref="setPage"></page-view>
	  
    </div>
  </div>

</template>


<script>
  import page from '../components/page'
  export default{
    name:'notification',
    data () {//define scope data
      return {
		  carMessageUrl:'http://localhost:3000/getSendCarMessageList',
		  baiduMessageUrl:'http://localhost:3000/getSendBaiduMessageList',
		  
		  tabSelectStatus:{carMessage:true,baiduMessage:false},
		  pageData:[],
		  
		  param : {
		    language:'en' //默认显示  语言值
		  },
		  initPagingInfo: {
		    count: 0,
		    perPage: 5,
			currentPage: 1
		  },
		  pagingInfo: {
		    count: 0,
		    perPage: 5,
			currentPage: 1
		  },
		  langData:{//语言信息
		     curLanguageData:{
			   tContentNoticeCar:'Notify Vehicles',
			   tContentContactBaidu:'Contact Baidu'
			 },
		     en:{
			   tContentNoticeCar:'Notify Vehicles',
			   tContentContactBaidu:'Contact Baidu'
			 },
			 cn:{
			   tContentNoticeCar:'通知车辆',
			   tContentContactBaidu:'联系百度'
			 }
		  }
      }
    },
	components:{
	  'pageView': page
	},
    created (){
  
	},
	mounted(){//
	  //初始化语言数据
      this.param.language = this.$store.state.lang
	  if("cn" == this.param.language){//请求中文
		this.langData.curLanguageData = this.langData.cn;
	  }
	  if("en" == this.param.language){//请求英文
		this.langData.curLanguageData = this.langData.en;
	  }
	  //请求数据
	  this.getCarMessage()
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
		  this.getCarMessage()
	   }
	},
	
    computed: {
	  getLanguage(){
	    return this.$store.state.lang
	  }
    },
	
    methods:{ //define scope methods
	   switchToCarMessage(){
	      //初始化分页信息
		  this.pagingInfo.perPage = this.initPagingInfo.perPage ;
		  this.pagingInfo.currentPage = this.initPagingInfo.currentPage ;

		   this.$refs.setPage.perpage = this.initPagingInfo.perPage
		   this.$refs.setPage.currentPage = this.initPagingInfo.currentPage
		   this.$refs.setPage.goPage(this.initPagingInfo.currentPage)

	      this.tabSelectStatus = {carMessage:true,baiduMessage:false};
		  //请求数据
		  this.getCarMessage()
	   
	   },
	   switchToBaiduMessage(){
	     //初始化分页信息
		 this.pagingInfo.perPage = this.initPagingInfo.perPage ;
		 this.pagingInfo.currentPage = this.initPagingInfo.currentPage ;

		   this.$refs.setPage.perpage = this.initPagingInfo.perPage
		   this.$refs.setPage.currentPage = this.initPagingInfo.currentPage
		   this.$refs.setPage.goPage(this.initPagingInfo.currentPage)


	     this.tabSelectStatus = {carMessage:false,baiduMessage:true};

		 //请求数据
		 this.getBaiduMessage()
	   
	   },
	   
	   getCarMessage(){
		  //请求数据
		  this.$http.get(this.carMessageUrl,{params: {
		    language: this.param.language,
            perpage: this.pagingInfo.perPage,
            currentPage: this.pagingInfo.currentPage
		  
		  }}).then(
			  response => {
			    this.pagingInfo.count = response.data.count;
				this.pageData = response.data.data
				this.pageData.forEach(function(item,index){
					//将逗号分隔的字符串转换成数组
					item.uuids = item.uuids.split(",");
				});
			  }
			  , response => {
				console.log('error')
			  }
		  )
	   },
	   
	   getBaiduMessage(){
		  //请求数据
		  this.$http.get(this.baiduMessageUrl,{params: {
		    language: this.param.language,
            perpage: this.pagingInfo.perPage,
            currentPage: this.pagingInfo.currentPage
		  
		  }}).then(
			  response => {
			    this.pagingInfo.count = response.data.count;
				this.pageData = response.data.data
				this.pageData.forEach(function(item,index){
					//将逗号分隔的字符串转换成数组
					item.uuids = item.uuids.split(",");
				});
			  }
			  , response => {
				console.log('error')
			  }
		  )
	   },
      pageOpt: function (data) {
		
        this.pagingInfo.perPage = data.perpage
        this.pagingInfo.currentPage = data.currentPage
		
		if(this.tabSelectStatus.carMessage){//当前为通知车辆tab页
		  this.getCarMessage()
		}else{
		  this.getBaiduMessage()
		}
        
      }
    }
}
</script>

<style scoped lang="less">
  @import "../assets/less/notification.less";
</style>
