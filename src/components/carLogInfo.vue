<template>
     <div class="dialogContainer" id="dialogContainer">
	 
	   <div class = "dialog-title">
	      车辆日志
	      <div class="dialog-cancelBg" @click="closeDialog"></div>
	   </div>
	   
	   
       <div class = "dialog-content">
	   
	     <div class="carSection">
			 <div>车辆信息</div>
			 <div class="dialog-subContent">
				 <div>ID : &nbsp;{{carLogData.basicInfo.uuid}}</div>
				 <div>车型 :  &nbsp;{{carLogData.basicInfo.vehicle_model}}</div>
				 <div>版本 :  &nbsp;{{carLogData.basicInfo.version}}</div>
				 <div>最近连接时间 : &nbsp; {{carLogData.basicInfo.lastime}}</div>
			 </div>
		 </div>
		 
		 <div class="carUserSection">
			 <div>车主信息 </div>
			 <div  class="dialog-subContent">
				 <div>车主 :  &nbsp;{{carLogData.basicInfo.caruser}}</div>
				 <div>联系方式 :  &nbsp;{{carLogData.basicInfo.phone}}</div>
				 <div>位置 :  &nbsp;{{carLogData.basicInfo.address}}</div>
			 </div>
		 </div>
		 
		 <div class="updateHistory">
			 <div>升级历史 </div>
			 <div  class="dialog-subContent">
			   <div v-for=" obj in carLogData.upgradeHistory">
				  <span>{{obj.date}}</span> <span>{{obj.detail_name}}</span>
			   </div>
			 </div>
		 </div>
		 
		 <div class="fixHistory">
			 <div>修复历史 </div>
			 <div  class="dialog-subContent">
			   <div v-for=" obj in carLogData.fixHistory">
				  <span>{{obj.date}}</span> <span>{{obj.detail_name}}</span>
			   </div>
			 </div>
		 </div>
	 
       </div>	

		<div class="gradient">
		</div>
	   
	 </div>
</template>

<script>
  export default {
    name: 'carLogInfo',
	data(){
	  return {
	     //uuid: this.carUuid,
	     carLogData : {
		    basicInfo : {},
			upgradeHistory : [],
			fixHistory : []
		 }
	  };
	},
	props:['carUuid'],
    watch:{
	   carUuid : function(newVal,okdVal){
	       this.getData()
		   
		   var dialogDiv = document.getElementById('dialogContainer')
		   //每次更新数据 重置定位为fixed
		   dialogDiv.style.removeProperty('position')
		   dialogDiv.style.removeProperty('top')

		   window.onscroll = function(){
			  //console.log('------滚动事件---------')
			  if(!dialogDiv.style.position){
				 dialogDiv.style.position = 'absolute'
				 dialogDiv.style.top = document.documentElement.scrollTop + 100 +'px';
				 window.onscroll = null
			  }
		   }
		   
		   
		   
		}
	},
	created(){
	  this.getData()  
	  
	},
	mounted (){
	  
	},

	methods:{

		getData(){
			  this.$http.get('http://localhost:3000/getCarLog',{params:{uuid:this.carUuid}}).then(
				  response => {
					this.carLogData = response.data
				  }
				  , response => {
					console.log('error')
				  }
			  )
		  },
		  
		  closeDialog(){
				this.$emit("closeCarLogDialog",false)
				/*
				console.log('------carLogInfo组件 this 的值---------',this);
				console.log('------carLogInfo组件 this.$parent 的值---------',this.$parent);
				console.log('------carLogInfo组件 this.$root 的值---------',this.$root);
				*/
		  }
	}
  }


</script>

<style scoped lang="less">
  @import url('../assets/less/carLogInfo.less');
</style>