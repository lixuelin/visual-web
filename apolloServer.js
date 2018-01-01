const http = require('http')
const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')

app.use(express.static(__dirname))
app.use(bodyParser.json()); // for parsing application/json
/* app.use(bodyParser.urlencoded({//此项必须在 bodyParser.json 下面,为参数编码
  extended: true
})); */

var connection = mysql.createConnection({
	multipleStatements: true,
    //host:'172.20.110.14',//公共数据库
	  host:'localhost',
    user:'adusec',
    password:'adusec',
    database:'adusec'
});
connection.connect();
//connection.end();//数据库连接关闭什么时候操作？



//app.get('/',(req,res)=>res.send('Hello World!'))


app.all('*',function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	if (req.method == 'OPTIONS') {    res.send(200);
	}  else {    next();
	}
});











//漏洞情报中心
app.get('/getIntelligenceList',function(req,res){

	/* 请求接收的查询参数：
	    漏洞编号：vulner_id
	    版本：version
	*/
	//http://localhost:3000/getIntelligenceList?vulner_id = 100802
	var vulner_id = req.query.vulner_id;
	var vulner_version  = req.query.vulner_version ;


	//分页相关 字段： 1.perpage 页面条数 2.currentPage 页码 3.count 总条数
	//默认 没传参 取第一页数据  每页4条
	if(req.query.perpage&&req.query.currentPage){
		var perPage = req.query.perpage;
		var targetPage = req.query.currentPage;
	}else{
		perPage = 4;
		targetPage = 1;
	}
    //计算 limit值
    var limitStart = perPage*(targetPage-1);//start row  0-9  10-19 20-29
	var limitEnd = perPage;//data number


	//语言
	var language = req.query.language;
	if(!language){
		language = 'cn'; //默认中文
	}

	var sql = "";
	if('en'==language){
	    sql += " select a.vulner_id,a.vulner_version,b.usa as level_name ,DATE_FORMAT(a.datetime,'%Y-%m-%d') as datetimeFormat"
			 +"  , cast(a.vulner_des_us as char) as vulner_des , cast(a.vulner_assisent_us as char)  as vulner_assisent";
	}else{
	    sql += " select a.vulner_id,a.vulner_version,b.zh_cn as level_name ,DATE_FORMAT(a.datetime,'%Y-%m-%d') as datetimeFormat"
			 +"  , cast(a.vulner_des_zh as char) as vulner_des , cast(a.vulner_assisent_zh as char)  as vulner_assisent";
	}


	 sql += " from t_vulnerability a "
			 +" left join t_vullevelenum b on a.vulner_level = b.id"
			 +" "
			 +" where 1=1 ";
			if(vulner_id){
				sql += " and a.vulner_id = '"+vulner_id+"'";
			}
			if(vulner_version){
				sql += " and a.vulner_version = '"+vulner_version+"'";
			}

			sql += " order by a.datetime desc  ";
	        sql += " limit "+limitStart+","+limitEnd+" ;";

	var totalNumSql = " select count(1) as totalNum"
			 +" from t_vulnerability a "
			 //+" left join t_vullevelenum b on a.vulner_level = b.id"
			 +" where 1=1 ";
			if(vulner_id){
				totalNumSql += " and a.vulner_id = '"+vulner_id+"'";
			}
			if(vulner_version){
				totalNumSql += " and a.vulner_version = '"+vulner_version+"'";
			}
			totalNumSql += ";";


    connection.query(totalNumSql+sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send({
				count: results[0][0].totalNum,
				data:results[1]
			});
		}
	});
});
















//通知车辆
app.get('/getSendCarMessageList',function(req,res){
	//localhost:3000/getSendCarMessageList

	//分页相关 字段： 1.perpage 页面条数 2.currentPage 页码 3.count 总条数
	//默认 没传参 取第一页数据  每页5条
	if(req.query.perpage&&req.query.currentPage){
		var perPage = req.query.perpage;
		var targetPage = req.query.currentPage;
	}else{
		perPage = 5;
		targetPage = 1;
	}




    //计算 limit值
    var limitStart = perPage*(targetPage-1);//start row  0-9  10-19 20-29
	var limitEnd = perPage;//data number
	//sql += " limit "+limitStart+","+limitEnd+" ;";


	//语言
	var language = req.query.language;
	if(!language){
	    //console.log('----进入无参---')
		language = 'cn'; //默认中文
	}

	var sql = "";
	if('en'==language){
		 sql += " select  b.usa as type ,cast(a.uuids as char) as uuids,DATE_FORMAT(a.datatime,'%Y-%m-%d %T') as date";
	}else{
	     sql += " select  b.zh_cn as type ,cast(a.uuids as char) as uuids,DATE_FORMAT(a.datatime,'%Y-%m-%d %T') as date";
	}

	 sql +=" from t_assist a left join t_assistenum b on a.detail = b.id "
			+" order by a.datatime desc"
			+" limit "+limitStart+","+limitEnd+" ;";

	var totalNumSql = " select  count(1) as totalNum "
			//+" from t_assist a left join t_assistenum b on a.detail = b.id "
			+" from t_assist a "
			//+" order by a.datatime desc"
			+" ;";

    connection.query(totalNumSql+sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send({
				count: results[0][0].totalNum,
				data:results[1]
			});

		}
	});
});










//联系百度
app.get('/getSendBaiduMessageList',function(req,res){
	//localhost:3000/getSendBaiduMessageList

	//分页相关 字段： 1.perpage 页面条数 2.currentPage 页码 3.count 总条数
	//默认 没传参 取第一页数据  每页5条
	if(req.query.perpage&&req.query.currentPage){
		var perPage = req.query.perpage;
		var targetPage = req.query.currentPage;
	}else{
		perPage = 5;
		targetPage = 1;
	}
    //计算 limit值
    var limitStart = perPage*(targetPage-1);//start row  0-9  10-19 20-29
	var limitEnd = perPage;//data number

	//语言
	var language = req.query.language;
	//console.log('----req.query.language---',req.query.language)
	if(!language){
		language = 'cn'; //默认中文
	}

	var sql = "";
	if('en'==language){
		 sql += " select  b.usa as type ,cast(a.uuids as char) as uuids,DATE_FORMAT(a.datatime,'%Y-%m-%d %T') as date";
	}else{
	     sql += " select  b.zh_cn as type ,cast(a.uuids as char) as uuids,DATE_FORMAT(a.datatime,'%Y-%m-%d %T') as date";
	}

	 sql += " from t_relationbd a left join t_relationbdenum b on a.detail = b.id "
			+" order by a.datatime desc"
			+" limit "+limitStart+","+limitEnd+" ; ";

	var totalNumSql = " select  count(1) as totalNum "
			+" from t_relationbd a "
			+" ; ";

		connection.query(totalNumSql+sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send({
				count: results[0][0].totalNum,
				data:results[1]
			});
		}
	});
});



/*
    //计算 limit值
    var limitStart = perPage*(targetPage-1);//start row  0-9  10-19 20-29
	var limitEnd = perPage;//data number
	//sql += " limit "+limitStart+","+limitEnd+" ;";
	res.send({
		count: results[0][0].totalNum,
		data:results[1]
	});
 */







//==================================车辆管理3个页面涉及的数据 开始==========================================


//车辆管理4个列表数据请求

//整体车辆状况
app.get('/getCarTotalInfoList',function(req,res){

	/* 请求接收的参数：
	   日期排序：order  值为 0(升序)或1(降序)
	   车辆id： car_id
	   车型：vehicle_model  值的取值范围待定   ???此字段在carinfo表还是在vehicliinfo表？？
	   版本：version
	*/
	var order = req.query.order;
	var car_id = req.query.car_id;
	var vehicle_model = req.query.vehicle_model;
	var version  = req.query.version;


	//分页相关 字段： 1.perpage 页面条数 2.currentPage 页码 3.count 总条数
	//默认 没传参 取第一页数据  每页5条
	if(req.query.perpage&&req.query.currentPage){
		var perPage = req.query.perpage;
		var targetPage = req.query.currentPage;
	}else{
		perPage = 10;
		targetPage = 1;
	}
    //计算 limit值
    var limitStart = perPage*(targetPage-1);//start row  0-9  10-19 20-29
	var limitEnd = perPage;//data number




	var sql = " select "
			+"    aa.uuid,aa.vehicle_model,aa.version,	aa.status,DATE_FORMAT(aa.lastime,'%Y-%m-%d %T') as lastime,"
			+" 	  b.zh_cn as status_name"
			+"  from "
			+"   ("
			+" 		select "
			+" 		  	a.uuid,a.vehicle_model,a.version,	a.status,a.lastime"
			+" 		from t_vehicleinfo a "
			+" 		where 1=1 ";

			if(car_id){
				sql += " and a.uuid = '"+car_id+"'";
			}
			if(vehicle_model){
				sql += " and a.vehicle_model = '"+vehicle_model+"'";
			}
			if(version){
				sql += " and a.version = '"+version+"'";
			}

			if(order == 0){
				sql += " order by a.lastime ";
			}else{//默认倒序 最近时间在前
				sql += " order by a.lastime desc ";
			}
			sql += " limit "+limitStart+","+limitEnd+"  ";


			sql += " ) aa"
				+" left join t_vehicleenum b on aa.status = b.id  ";
			if(order == 0){
				sql += " order by aa.lastime ";
			}else{//默认倒序 最近时间在前
				sql += " order by aa.lastime desc ";
			}
			sql += " ;";



	var totalNumSql = " select count(1) as totalNum "
			+" from t_vehicleinfo a "
			+" where 1=1  ";
			if(car_id){
				totalNumSql += " and a.uuid = '"+car_id+"'";
			}
			if(vehicle_model){
				totalNumSql += " and a.vehicle_model = '"+vehicle_model+"'";
			}
			if(version){
				totalNumSql += " and a.version = '"+version+"'";
			}
			totalNumSql += " ; ";


    connection.query(totalNumSql+sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send({
				count: results[0][0].totalNum,
				data:results[1]
			});
		}
	});
});





//监控车辆名单
app.get('/getMonitorCarList',function(req,res){

	/* 请求接收的参数：
	   日期排序：order  值为 0(升序)或1(降序)
	   车辆id： car_id
	   车型：vehicle_model  值的取值范围待定   ???此字段在carinfo表还是在vehicliinfo表？？
	   版本：version
	*/
	//http://localhost:3000/getMonitorCarList?car_id=TZJCG8641409
	var order = req.query.order;
	var car_id = req.query.car_id;
	var vehicle_model = req.query.vehicle_model;
	var version  = req.query.version;

	//分页相关 字段： 1.perpage 页面条数 2.currentPage 页码 3.count 总条数
	//默认 没传参 取第一页数据  每页5条
	if(req.query.perpage&&req.query.currentPage){
		var perPage = req.query.perpage;
		var targetPage = req.query.currentPage;
	}else{
		perPage = 5;
		targetPage = 1;
	}
    //计算 limit值
    var limitStart = perPage*(targetPage-1);//start row  0-9  10-19 20-29
	var limitEnd = perPage;//data number





	var sql = " select d.id ,DATE_FORMAT(a.lastime,'%Y-%m-%d %T') as lastime , a.uuid,a.vehicle_model,a.version,a.status"
			+" from t_vehicleinfo a left join t_monitor d on a.uuid = d.uuid "
			+" where a.uuid in (	select  b.uuid from t_monitor b	)  " ;
	if(car_id){
		sql += " and a.uuid = '"+car_id+"'";
	}
	if(vehicle_model){
		sql += " and a.vehicle_model = '"+vehicle_model+"'";
	}
	if(version){
		sql += " and a.version = '"+version+"'";
	}

	if(order == 0){
		sql += " order by a.lastime ";
	}else{//默认倒序 最近时间在前
		sql += " order by a.lastime desc ";
	}
	sql += " limit "+limitStart+","+limitEnd+"  ;"



	if(car_id||vehicle_model||version){

		var totalNumSql = "  select count(1) as totalNum"
					+" 	from t_vehicleinfo a "
					+" where 1=1  " ;
		if(car_id){ //此条件提前能优化查询速度
			totalNumSql += " and a.uuid = '"+car_id+"'";
		}
		totalNumSql += " and a.uuid in (select  b.uuid from t_monitor b	)";

		if(vehicle_model){
			totalNumSql += " and a.vehicle_model = '"+vehicle_model+"'";
		}
		if(version){
			totalNumSql += " and a.version = '"+version+"'";
		}
		totalNumSql += " ;";

	}else{//无查询条件
		var totalNumSql = "  select count(1) as totalNum from t_monitor a ;";
	}





    connection.query(totalNumSql+sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send({
				count: results[0][0].totalNum,
				data:results[1]
			});
		}
	});
});





//被攻击车辆名单
app.get('/getIntrusionCarList',function(req,res){

	/* 请求接收的参数：
	   日期排序：order  值为 0(升序)或1(降序)
	   车辆id： car_id
	   车型：vehicle_model  值的取值范围待定   ???此字段在carinfo表还是在vehicliinfo表？？
	   版本：version
	*/
	//http://localhost:3000/getIntrusionCarList?car_id=TZJCG8641409
	var order = req.query.order;
	var car_id = req.query.car_id;
	var vehicle_model = req.query.vehicle_model;
	var version  = req.query.version;

	//分页相关 字段： 1.perpage 页面条数 2.currentPage 页码 3.count 总条数
	//默认 没传参 取第一页数据  每页5条
	if(req.query.perpage&&req.query.currentPage){
		var perPage = req.query.perpage;
		var targetPage = req.query.currentPage;
	}else{
		perPage = 5;
		targetPage = 1;
	}
    //计算 limit值
    var limitStart = perPage*(targetPage-1);//start row  0-9  10-19 20-29
	var limitEnd = perPage;//data number


	var sql = " select a.uuid,a.vehicle_model,a.version,DATE_FORMAT(a.lastime,'%Y-%m-%d %T') as lastime ,a.status,b.zh_cn as status_name"
		+" from t_vehicleinfo a left join t_vehicleenum b on a.status = b.id"
		+" where 1=1 and exists "
		+" ("
		+"   select 1 from "
		+"    ( "
		+"      select distinct a.uuid"
		+"      from t_attackinfo a"
		+"    ) aa"
		+"   where aa.uuid=a.uuid "
		+" )" ;

	if(car_id){
		sql += " and a.uuid = '"+car_id+"'";
	}
	if(vehicle_model){
		sql += " and a.vehicle_model = '"+vehicle_model+"'";
	}
	if(version){
		sql += " and a.version = '"+version+"'";
	}

	if(order == 0){
		sql += " order by a.lastime ";
	}else{//默认倒序  最新时间在前
		sql += " order by a.lastime desc ";
	}

    sql += " limit "+limitStart+","+limitEnd+" ; ";







	var totalNumSql = " select count(1) as totalNum "
					+" from t_vehicleinfo a "
					+" where 1=1 and exists "
					+" ("
					+"   select 1 from "
					+"    ( "
					+"      select distinct a.uuid"
					+"      from t_attackinfo a"
					+"    ) aa"
					+"   where aa.uuid=a.uuid "
					+" )";

	if(car_id){
		totalNumSql += " and a.uuid = '"+car_id+"'";
	}
	if(vehicle_model){
		totalNumSql += " and a.vehicle_model = '"+vehicle_model+"'";
	}
	if(version){
		totalNumSql += " and a.version = '"+version+"'";
	}

	if(order == 0){
		totalNumSql += " order by a.lastime ";
	}
	if(order == 1){
		totalNumSql += " order by a.lastime desc ";
	}

    totalNumSql += " ; ";




    connection.query(totalNumSql + sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send({
				count: results[0][0].totalNum,
				data:results[1]
			});
		}
	});
});



//车辆日志
/*
   参数：uuid  要查看详情的车辆id
 */
app.get('/getCarLog',function(req,res){
	var uuid = req.query.uuid;



		//语言
	var language = req.query.language;
	if(!language){
		language = 'cn'; //默认中文
	}





    if(uuid){

		var basicInfoSql = " select  a.uuid,a.vehicle_model,a.version,a.lastime,a.status,a.caruser,a.phone,a.address, ";

		if('en'==language){
			 basicInfoSql += " b.usa as status_name";
		}else{
			 basicInfoSql += " b.zh_cn as status_name";
		}
	    basicInfoSql += " from t_vehicleinfo a left join t_vehicleenum b on a.status = b.id "
					+" where a.uuid='"+uuid+"'"
					+" ;";



		var upgradeInfoSql = " select a.upgrade_detail,DATE_FORMAT(a.upgrade_date,'%Y-%m-%d %T') as date,a.upgrade_date,";

		if('en'==language){
			 upgradeInfoSql += " b.usa as detail_name";
		}else{
			 upgradeInfoSql += " b.zh_cn as detail_name";
		}
		upgradeInfoSql += " from t_upgradeinfo a left join t_attackenum b on a.upgrade_detail = b.id"
						+" where a.uuid = '"+uuid+"'"
						+" ;";





		var fixInfoSql = " select  a.fix_date,DATE_FORMAT(a.fix_date,'%Y-%m-%d %T') as date,a.fix_detail,";
		if('en'==language){
			 fixInfoSql += " b.usa as detail_name";
		}else{
			 fixInfoSql += " b.zh_cn as detail_name";
		}
		fixInfoSql += " from t_fixinfo a left join t_attackenum b on a.fix_detail = b.id "
					+" where a.uuid = '"+uuid+"'"
					+" ;";

		connection.query(basicInfoSql + upgradeInfoSql + fixInfoSql,function(error,results,fields){
			if(error){
				throw error;
			}else{
				res.setHeader('Access-Control-Allow-Origin','*');
				var obj = {
					basicInfo : results[0][0],
					upgradeHistory : results[1],
                    fixHistory: results[2]
				};
				res.send(obj);
			}
		});

	}else{
				res.setHeader('Access-Control-Allow-Origin','*');
				res.send([]);
	}





});


//================车辆管理中  入库操作=====================


//向监控表插入数据     ？？？车辆id已经在监控表中的是不是不能再插入车辆id相同的数据？？？ 待确认
app.post('/putDataIntoMonitor',function(req,res){
	/*
	参数：
	   车辆id数组：carIdArr   (无论是单个添加还是批量添加，数据都使用数组格式)
	   数据格式：{carIdArr:['THABG4214071','YSDFE1415874']} 转换成json 传递过来
	*/
	var carIdArr = [];
    carIdArr = req.body.carIdArr;
    //console.log('------接收到的参数数组carIdArr--------',carIdArr);
    //console.log('------req.body--------',carIdArr);

	if(carIdArr.length>0){
		var sql = " insert into t_monitor (uuid,datetime) values ";
		carIdArr.forEach(function(item,index){
			if(index==carIdArr.length-1){
				sql += " ('"+item+"',now()) "
			}else{
				sql += " ('"+item+"',now()),"
			}
		});
		connection.query(sql,function(error,results,fields){
			if(error){
				throw error;
			}
			else{
				//该提供怎样的响应信息？？？
				res.setHeader('Access-Control-Allow-Origin','*');
				res.send(results);
			}
		});
	}



});



//删除监控数据：  传递参数：监控id 后曾批量删除,接收参数为逗号间隔的字符串 如：  id: '1,2,3'
app.post('/deleteMonitorDataById',function(req,res){
	var monitorId;
    monitorId = req.body.id;
	if(monitorId){
		var sql = " delete from t_monitor   where id in ( "+ monitorId + ") ;";
		connection.query(sql,function(error,results,fields){
			if(error){
				throw error;
			}else{
				//该提供怎样的响应信息？？？
				res.setHeader('Access-Control-Allow-Origin','*');
				res.send(results);
			}
		});
	}
});






//向联系百度表插入数据
app.post('/putDataIntoRelationbd',function(req,res){
	/*
	参数：
	   数据格式：json
	    {
		   uuids:'THABG4214071,YSDFE1415874',
		   detail:'1'
	    }
	*/
	var uuids,detail;
    uuids = req.body.uuids;
	detail = req.body.detail;
	if(uuids){
		var sql = " insert into t_relationbd (uuids,detail,datatime) values('"+uuids+"','"+detail+"',now()); ";

		connection.query(sql,function(error,results,fields){
			if(error){
				throw error;
			}else{
				//该提供怎样的响应信息？？？
				res.setHeader('Access-Control-Allow-Origin','*');
				res.send(results);
			}
		});
	}
});


//向通知车辆表插入数据
app.post('/putDataIntoAssist',function(req,res){
	/*
	参数：
	   数据格式：json
	    {
		   uuids:'THABG4214071,YSDFE1415874',
		   detail:'1'
	    }
	*/
	var uuids,detail;
    uuids = req.body.uuids;
	detail = req.body.detail;
	if(uuids){
		var sql = " insert into t_assist (uuids,detail,datatime) values('"+uuids+"','"+detail+"',now()); ";

		connection.query(sql,function(error,results,fields){
			if(error){
				throw error;
			}else{
				//该提供怎样的响应信息？？？
				res.setHeader('Access-Control-Allow-Origin','*');
				res.send(results);
			}
		});
	}
});





//==================================车辆管理3个页面涉及的数据 结束==========================================














//=================图表页  数据 开始=======================



//图表页-表格 攻击详情
app.get('/getAttackInfo',function(req,res){
	/* 请求接收的参数：
	   日期排序：order  值为 0(升序)或1(降序)

	   攻击等级：attackLevel
	   攻击部位：attackPart
	   处理结果：disposeResult

	   //已作废的查询条件
	   车辆id： car_id
	   车型：vehicle_model  值的取值范围待定   ?在vehicliinfo表？？
	   版本：version
	*/

	var order = req.query.order;

	var attack_level = req.query.attackLevel;
	var attack_part = req.query.attackPart;
	var dispose_result  = req.query.disposeResult;

	//分页相关 字段： 1.perpage 页面条数 2.currentPage 页码 3.count 总条数
	//返回数据，后台只需要  每页条数与要条状到的页数
	//默认 没传参 取第一页数据  每页10条
	if(req.query.perpage&&req.query.currentPage){
		var perPage = req.query.perpage;
		var targetPage = req.query.currentPage;
	}else{
		perPage = 10;
		targetPage = 1;
	}
    //计算 limit值
    var limitStart = perPage*(targetPage-1);//start row  0-9  10-19 20-29
	var limitEnd = perPage;//data number



	//语言
	var language = req.query.language;
	if(!language){
		language = 'cn'; //默认中文
	}

    //优化后
	var sql = " select "
			+" 	aa.attack_part  ,"
			+" 	aa.attack_facility , "
			+" 	aa.attack_type , "
			+" 	aa.dispose_result ,"

			+"  vehi.uuid,vehi.vehicle_model,vehi.version,"

			+" 	DATE_FORMAT(aa.attack_date,'%Y-%m-%d %T') as attack_date,     "
			+" 	INET_NTOA(aa.attack_ip) as attack_ip,	" ;

			if('en'==language){
				 sql += " 	 part.usa as part_name,"
						+" 	 facility.usa as facility_name ,"
						+" 	 attType.usa as type_name ,"
						+" 	 dispose.usa as dispose_name, "
						+" 	 attacklevel.usa as attack_level ";
			}else{
				 sql += " 	 part.zh_cn as part_name,"
						+" 	 facility.zh_cn as facility_name ,"
						+" 	 attType.zh_cn as type_name ,"
						+" 	 dispose.zh_cn as dispose_name,"
						+" 	 attacklevel.zh_cn as attack_level" ;
			}

			sql += " from "
			+"   ("
			+" 		select "
			+" 		    a.uuid,"
			+"          a.attack_date,   "
			+" 			a.attack_level,"
			+" 			a.attack_part,"
			+" 			a.attack_facility,"
			+" 			a.attack_type,"
			+" 			a.dispose_result,"
			+" 			a.attack_ip"
			+" 		from t_attackinfo a "
			+" 		where 1=1 ";

			if(attack_level){
				sql += " and a.attack_level = '"+attack_level+"'";
			}
			if(attack_part){
				sql += " and a.attack_part = '"+attack_part+"'";
			}
			if(dispose_result){
				sql += " and a.dispose_result = '"+dispose_result+"'";
			}

			if(order == 0){
				sql += " order by a.attack_date ";
			}else{//默认倒序  即最新时间在前
				sql += " order by a.attack_date desc ";
			}

			sql += " limit "+limitStart+","+limitEnd+" "
				+" 	) aa"
				+" 	left join t_attackenum part on aa.attack_part = part.id"
				+" 	left join t_attackenum facility on aa.attack_facility = facility.id"
				+" 	left join t_attackenum attType on aa.attack_type = attType.id"
				+" 	left join t_attackenum dispose on aa.dispose_result = dispose.id"
				+" 	left join t_vehicleinfo vehi on aa.uuid = vehi.uuid "
				+" 	left join t_attacklevelenum attacklevel on  aa.attack_level = attacklevel.id ";

			if(order == 0){
				sql += " order by aa.attack_date ";
			}else{//默认倒序  即最新时间在前
				sql += " order by aa.attack_date desc ";
			}


			sql +=" ;";




	//为了优化  计算总数据中与结果数量无关的表连接可以去掉
	var totalRecoardSql =  " select count(1) as totalNum "
						+" 		from t_attackinfo a "
						+" 		where 1=1 ";

	if(attack_level){
		totalRecoardSql += " and a.attack_level = '"+attack_level+"'";
	}
	if(attack_part){
		totalRecoardSql += " and a.attack_part = '"+attack_part+"'";
	}
	if(dispose_result){
		totalRecoardSql += " and a.dispose_result = '"+dispose_result+"'";
	}
	totalRecoardSql += " ;";

    //console.log(sql);
    //console.log(totalRecoardSql);

    connection.query(totalRecoardSql+sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');


			//处理表格数据,ip为0.0.0.0 改为localhost
			var str = 'localhost';
			results[1].forEach(function(item,index){
				if('0.0.0.0'=== item.attack_ip){
					item.attack_ip = str;
				}
			});


			res.send({
				count: results[0][0].totalNum,
				data:results[1]
			});
		}
	});
});


//图表页  四个图表数据  默认统计6个月 近半年的数据
app.get('/getEchartMultiData',function(req,res){
	/*
	请求接收4个参数：
	    paramType: 值为month或者date   字符串
	    monthNum: 值为：1或 3或 6  数字
		startDate: 值为  2017-04-07  格式的字符串
		endDate: 值为 2017-04-09 格式的字符串
	*/
	var paramType = req.query.paramType;
	var monthNum = req.query.monthNum;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	//console.log('------firstchart data  param------------',req.query);


	var language = req.query.language;
	if(!language){
		language = 'cn'; //默认中文
	}



    //图表页-图表 攻击部位统计
	var sql1 = " select a.attack_part,count(1) as attack_num,"

	if('en'==language){
		 sql1 += " 	 b.usa as zh_cn";
	}else{
		 sql1 += " 	 b.zh_cn as zh_cn";
	}

	sql1 += " from t_attackinfo a left join t_attackenum b on a.attack_part = b.id"
	+" where 1=1 ";

	if("month" === paramType){
		sql1 += " and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date";
	}
	if("date" === paramType){
		if(startDate){
			sql1 += " and  a.attack_date >= '"+startDate+"' ";
		}
		if(endDate){
			sql1 += " and a.attack_date <='"+endDate+"'";
		}
	}
	//+" and DATE_SUB(CURDATE(), INTERVAL 6 MONTH) <= a.attack_date"
	sql1 += " group by a.attack_part,b.zh_cn ;";



    //图表页-图表 攻击分类图表
	var sql2 = " select a.attack_type,count(1) as attack_num,";

	if('en'==language){
		 sql2 += " 	 b.usa as zh_cn";
	}else{
		 sql2 += " 	 b.zh_cn as zh_cn";
	}

	sql2 += " from t_attackinfo a left join t_attackenum b on a.attack_type = b.id"
	+" where 1=1 ";

	if("month" === paramType){
		sql2 += " and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date";
	}
	if("date" === paramType){
		if(startDate){
			sql2 += " and  a.attack_date >= '"+startDate+"' ";
		}
		if(endDate){
			sql2 += " and a.attack_date <='"+endDate+"'";
		}
	}
	//+" and DATE_SUB(CURDATE(), INTERVAL 6 MONTH) <= a.attack_date"
	sql2 += " group by a.attack_type ";
	sql2 += " order by attack_num desc ;";




    //图表页-图表-攻击等级分布数据
	var sql3 = " select count(a.uuid) as attack_num, ";

	if('en'==language){
		 sql3 += " 	 b.usa as attack_level";
	}else{
		 sql3 += " 	 b.zh_cn as attack_level";
	}

	sql3 += " from t_attackinfo a left join t_attacklevelenum b on a.attack_level = b.id "
			+" where 1=1 ";

	if("month" === paramType){
		sql3 += " and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date";
	}
	if("date" === paramType){
		if(startDate){
			sql3 += " and  a.attack_date >= '"+startDate+"' ";
		}
		if(endDate){
			sql3 += " and a.attack_date <='"+endDate+"'";
		}
	}
	sql3 += " group by a.attack_level ";
	sql3 += " order by attack_num desc ;";







    //这个数据量太大了  是否应该分开提供
    //图表页-图表 攻击数量统计
	/* 返回数据结构：
	{
		totalNumArr:{
		  totalAttackNum:5000,//攻击总数
		  totalInterceptNum:4000,//拦截总数
		  totalDisposeNum:3000//已处理总数
		},
		byMonthNumArr:{
		  attachNumByMonth:[{year:2017,month:07,attack_num:50}],//攻击按月总数
		  interceptNumByMonth:[{year:2017,month:07,attack_num:70}],//拦截按月总数
		  disposeNumByMonth:[{year:2017,month:07,attack_num:70}]//已处理按月总数
		},
	}
	*/


	var threeHourDataDate = '2017-10-07';//3小时数据所在天，用于刨除掉3小时数据所在天的数据

    //总数sql   攻击  拦截  已处理
    var totalAttackNumSql = " select 'totalAttackNum' as type,count(1) as attack_num"
						+" from t_attackinfo a "
						+" where 1=1 ";
						+" and DATE_FORMAT(a.attack_date,'%Y-%m-%d') !='"+threeHourDataDate+"'"
						//+" and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date"

						if("month" === paramType){
							totalAttackNumSql += " and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date";
						}
						if("date" === paramType){
							if(startDate){
								totalAttackNumSql += " and  a.attack_date >= '"+startDate+"' ";
							}
							if(endDate){
								totalAttackNumSql += " and a.attack_date <='"+endDate+"'";
							}
						}

						totalAttackNumSql += " union"

						+" select 'totalInterceptNum' as type,count(1) as attack_num"
						+" from t_attackinfo a "
						+" where 1=1 "
						+" and DATE_FORMAT(a.attack_date,'%Y-%m-%d') !='"+threeHourDataDate+"'"
						+" and a.intercept_result = 1";

						//+" and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date"

						if("month" === paramType){
							totalAttackNumSql += " and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date";
						}
						if("date" === paramType){
							if(startDate){
								totalAttackNumSql += " and  a.attack_date >= '"+startDate+"' ";
							}
							if(endDate){
								totalAttackNumSql += " and a.attack_date <='"+endDate+"'";
							}
						}

						totalAttackNumSql += " union"

						+" select 'totalDisposeNum' as type ,count(1) as attack_num"
						+" from t_attackinfo a "
						+" where 1=1 "
						+" and DATE_FORMAT(a.attack_date,'%Y-%m-%d') !='"+threeHourDataDate+"'"
						+" and a.dispose_result != 43" ;

						//+" and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date"

						if("month" === paramType){
							totalAttackNumSql += " and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date";
						}
						if("date" === paramType){
							if(startDate){
								totalAttackNumSql += " and  a.attack_date >= '"+startDate+"' ";
							}
							if(endDate){
								totalAttackNumSql += " and a.attack_date <='"+endDate+"'";
							}
						}

						totalAttackNumSql += " ;";


	//按月汇总sql  攻击  拦截  已处理
	var byMonthAttackNumSql =" select date_format(a.attack_date,'%y') as year,date_format(a.attack_date,'%m') as month ,date_format(a.attack_date,'%d') as day,count(1) as attack_num,'attachNumByMonth' as type"
							+" from t_attackinfo a "
							+" where 1=1 "

						    +" and DATE_FORMAT(a.attack_date,'%Y-%m-%d') !='"+threeHourDataDate+"'";
							//+" and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date"

							if("month" === paramType){
								byMonthAttackNumSql += " and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date";
							}
							if("date" === paramType){
								if(startDate){
									byMonthAttackNumSql += " and  a.attack_date >= '"+startDate+"' ";
								}
								if(endDate){
									byMonthAttackNumSql += " and a.attack_date <='"+endDate+"'";
								}
							}

							byMonthAttackNumSql += " group by date_format(a.attack_date,'%y'),date_format(a.attack_date,'%m'),date_format(a.attack_date,'%d')"

							+" union"

							+" select date_format(a.attack_date,'%y') as year,date_format(a.attack_date,'%m') as month ,date_format(a.attack_date,'%d') as day ,count(1) as attack_num,'interceptNumByMonth' as type"
							+" from t_attackinfo a "
							+" where 1=1 "
						    +" and DATE_FORMAT(a.attack_date,'%Y-%m-%d') !='"+threeHourDataDate+"'"
							+" and a.intercept_result = 1";

							//+" and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date"

							if("month" === paramType){
								byMonthAttackNumSql += " and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date";
							}
							if("date" === paramType){
								if(startDate){
									byMonthAttackNumSql += " and  a.attack_date >= '"+startDate+"' ";
								}
								if(endDate){
									byMonthAttackNumSql += " and a.attack_date <='"+endDate+"'";
								}
							}

							byMonthAttackNumSql += " group by date_format(a.attack_date,'%y'),date_format(a.attack_date,'%m'),date_format(a.attack_date,'%d')"

							+" union"

							+" select date_format(a.attack_date,'%y') as year,date_format(a.attack_date,'%m') as month,date_format(a.attack_date,'%d') as day ,count(1) as attack_num,'disposeNumByMonth' as type"
							+" from t_attackinfo a "
							+" where 1=1 "
						    +" and DATE_FORMAT(a.attack_date,'%Y-%m-%d') !='"+threeHourDataDate+"'"
							+" and a.dispose_result != 43" ;

							//+" and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date"

							if("month" === paramType){
								byMonthAttackNumSql += " and DATE_SUB(CURDATE(), INTERVAL "+ parseInt(monthNum) +" MONTH) <= a.attack_date";
							}
							if("date" === paramType){
								if(startDate){
									byMonthAttackNumSql += " and  a.attack_date >= '"+startDate+"' ";
								}
								if(endDate){
									byMonthAttackNumSql += " and a.attack_date <='"+endDate+"'";
								}
							}

							byMonthAttackNumSql += " group by date_format(a.attack_date,'%y'),date_format(a.attack_date,'%m'),date_format(a.attack_date,'%d')"
							 +" ;";

							 //console.log('------byMonthAttackNumSql---------',byMonthAttackNumSql);

/*
	 console.log(sql1);
	 console.log(sql2);
	 console.log(sql3);
 */
    connection.query(sql1+sql2+sql3+totalAttackNumSql+byMonthAttackNumSql,[],function(error,results,fields){
	if(error){
			throw error;
		}else{
            //返回对象结构
			var returnData = {
				attackStat: {//攻击统计
		           totalNumArr:{
					   totalAttackNum : 0,
					   totalInterceptNum : 0,
					   totalDisposeNum: 0
				   },
				   byMonthNumArr:{
					   attachNumByMonth : [],
					   interceptNumByMonth : [],
					   disposeNumByMonth : []
				   }
				},
				attackPartStat:[],//攻击部位统计
				attackTypeStat:[],//攻击类型统计
				attackLevel:[]//攻击等级统计
			}
			//console.log('----query result:------',results);
            returnData.attackPartStat = results[0];
            returnData.attackTypeStat = results[1];
            returnData.attackLevel = results[2];


			results[3].forEach(function(item2,index2){
				switch(item2.type){
					case 'totalAttackNum':
					  returnData.attackStat.totalNumArr.totalAttackNum = item2.attack_num ;
					  break;
					case 'totalInterceptNum':
					  returnData.attackStat.totalNumArr.totalInterceptNum = item2.attack_num ;
					  break;
					case 'totalDisposeNum':
					  returnData.attackStat.totalNumArr.totalDisposeNum = item2.attack_num ;
					  break;
				}


			});


			var attackArr = [];
			var interceptArr = [];
			var disposeArr = [];

			//console.log('---------按月汇总数据sql查询结果：-----------',results[4]);

			//处理数据  返回合适形式
			results[4].forEach(function(item,index){
				switch(item.type){
					case 'attachNumByMonth':
					  attackArr.push(item);
					  break;
					case 'interceptNumByMonth':
					  interceptArr.push(item);
					  break;
					case 'disposeNumByMonth':
					  disposeArr.push(item);
					  break;
				}

			})








			//==========attackArr=============================================

			//处理第5个echart攻击数量统计图表数据，按天统计数据，没有数据的天给补0值

			var newDate = new Date();//当前日期
			var beforeDate =  new Date();//指定时间段之前的日期
			//month比实际值小1  要处理
			//newDate.setMonth(newDate.getMonth())
			//beforeDate.setMonth(beforeDate.getMonth() - 6);

			/*
            console.log('-----------时间参数处理前-------------',);
            console.log('---------beforeDate---------------',beforeDate);
            console.log('---------newDate---------------',newDate);
			*/
			if("month" === paramType){
			    beforeDate.setMonth(beforeDate.getMonth() - parseInt(monthNum));
			}
			if("date" === paramType){
				if(startDate){
					beforeDate = startDate ;
				}
				if(endDate){
					newDate = endDate ;
				}
			}

			var totalDays = getTotalDates(beforeDate,newDate);
			/*
            console.log('-----------时间参数处理后-------------',);
            console.log('---------beforeDate---------------',beforeDate);
            console.log('-----------时间开始-------------',);
            console.log('---------totalDays.length---------------',totalDays.length);
            console.log('---------beforeDate---------------',beforeDate);
            console.log('---------newDate---------------',newDate);
			*/
			//------------------------处理攻击按天统计数据---
			//拼接年月日
			attackArr.forEach(function(item,index){
				item.date = "20"+item.year+"-"+item.month+"-"+item.day;
			});
		    //迭代指定时间段内的所有天，没有数据的天，数据补0
			var isExists1 = false;
			totalDays.forEach(function(item,index){
				attackArr.forEach(function(attack,attackIndex){
					if(attack.date == item){
						isExists1 = true
						return
					}
				});
				if(!isExists1){
					attackArr.splice(index,0,{date:item,year:item.substr(2,2),month:item.substr(5,2),day:item.substr(8,2),attack_num:0,type:"attachNumByMonth"});
				}
				isExists1 = false;
			});


			//=================已拦截==interceptArr====================================

			//拼接年月日
			interceptArr.forEach(function(item,index){
				item.date = "20"+item.year+"-"+item.month+"-"+item.day;
			});
		    //迭代指定时间段内的所有天，没有数据的天，数据补0
			var isExists2 = false;
			totalDays.forEach(function(item,index){
				interceptArr.forEach(function(attack,attackIndex){
					if(attack.date == item){
						isExists2 = true
						return
					}
				});
				if(!isExists2){
					interceptArr.splice(index,0,{date:item,year:item.substr(2,2),month:item.substr(5,2),day:item.substr(8,2),attack_num:0,type:"interceptNumByMonth"});
				}
				isExists2 = false;
			});


			//==============================已处理===disposeArr======================

			//拼接年月日
			disposeArr.forEach(function(item,index){
				item.date = "20"+item.year+"-"+item.month+"-"+item.day;
			});
            //console.log('---------attackArr.length---------------',attackArr.length);
		    //迭代指定时间段内的所有天，没有数据的天，数据补0
			var isExists3 = false;
			totalDays.forEach(function(item,index){
				disposeArr.forEach(function(attack,attackIndex){
					if(attack.date == item){
						isExists3 = true
						return
					}
				});
				if(!isExists3){
					disposeArr.splice(index,0,{date:item,year:item.substr(2,2),month:item.substr(5,2),day:item.substr(8,2),attack_num:0,type:"disposeNumByMonth"});
				}
				isExists3 = false;
			});







			//console.log('---------按月汇总数据 处理后：-----------',interceptArr);

            returnData.attackStat.byMonthNumArr = {
				attachNumByMonth : attackArr,  //攻击
				interceptNumByMonth : interceptArr,//拦截
				disposeNumByMonth : disposeArr//已处理
			};

			/* 返回数据结构：
			{
				totalNumArr:{
				  totalAttackNum:5000,
				  totalInterceptNum:4000,
				  totalDisposeNum:3000
				},
				byMonthNumArr:{
				  attachNumByMonth:[{year:2017,month:07,attack_num:50}],
				  interceptNumByMonth:[{year:2017,month:07,attack_num:70}],
				  disposeNumByMonth:[{year:2017,month:07,attack_num:70}]
				},
			}
			*/

			//console.log('----returnData:------',returnData);

	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send(returnData);
		}
	});

});

//=================图表页  数据 结束=======================














//=================首页  数据 开始=======================
/*
//首页-地球  最活跃连接数据 给5条  一组经纬度数据格式待处理
app.get('/getBallTopConnection',function(req,res){
	var sql = " select a.srcip,b.longitude,b.latitude,cast(a.target as char) as targets "
		+" from t_topconn a left join t_ip b  "
		+" on a.srcip between b.ip_start_num and b.ip_end_num"
		+" order by a.counts desc"
		+" limit 5";


    connection.query(sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');

		    results.forEach(function(item,index){
		    	//console.log("-------------");
		    	//console.log(item.targets);
		    	item.targets = JSON.parse(item.targets);
		    	//console.log(item.targets);
		    })
			res.send(results);
		}
	});
});*/


/*//首页-地球  攻击数据 先给2条
app.get('/getBallIntrusion',function(req,res){
	var sql =" select a.uuid as car_id,b.continent,b.country,b.province,b.city,b.longitude,b.latitude"
			+" from t_attackinfo a left join t_ip b"
			+" on a.local_ip between b.ip_start_num and b.ip_end_num"
			+" where 1=1 and a.id = ?"
			+" order by a.attack_date desc";

    //随机取700条攻击数据 暂时供前台测试地球
    var index = Math.floor(Math.random()*1000)+Math.floor(Math.random()*100)+Math.floor(Math.random()*10);
    if(index>700){
    	index = 700;
    }

	connection.query(sql,[index],function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send(results);
		}
	});
});*/


//首页-最近攻击数据  5条
app.get('/getLatestIntrusion',function(req,res){
	//当前时间
	var curDate = new Date();
	//映射后的当前时间
	var beginMapDate = changeCurDateToMapDate(curDate);
	var beginDateStr = getCurDateStr(beginMapDate);



	var language = req.query.language;
	if(!language){
		language = 'cn'; //默认中文
	}
	var sql = "select a.id,a.uuid as car_id , a.attack_date ,  "
	         +" date_format(a.attack_date,'%T') as attack_time,"
	         +" DATE_FORMAT(a.attack_date,'%Y-%m-%d %T') as structDate,"
	         +" b.longitude , b.latitude,";

	if('en'==language){
		 sql += " b.continent_english as continent, b.country_english as country, b.province_english as province , b.city as city";
	}else{
		 sql += " b.continent , b.country , b.province , b.city ";
	}

	sql += " from t_attackinfo a left join t_ip b "
		+" on a.local_ip between b.ip_start_num and b.ip_end_num "
		+" where 1=1 "
		+" and a.attack_date < '"+beginDateStr+"'"
		+" order by a.attack_date desc"
		+" limit 5" ;

	connection.query(sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send(results);
		}
	});
});
//首页-活跃连接数据排名数据
app.get('/getTopConnection',function(req,res){

    //增加时间映射  按时间段查询
	//当前时间
	var curDate = new Date();

	//映射后的当前时间
	var beginMapDate = changeCurDateToMapDate(curDate);
	var endMapDate = changeCurDateToMapDate(curDate);
	endMapDate.setTime(endMapDate.setSeconds(endMapDate.getSeconds()-20));//结束时间与起始时间间距20秒

	var beginDateStr = getCurDateStr(beginMapDate);
	var endDateStr = getCurDateStr(endMapDate);



	var language = req.query.language;
	if(!language){
		language = 'cn'; //默认中文
	}
/*
	var sql = " select a.counts,INET_NTOA(a.srcip) as ip, ";
	if('en'==language){
		 sql += " b.continent_english as continent, b.country_english as country, b.province_english as province , b.city as city";
	}else{
		 sql += " b.continent , b.country , b.province , b.city ";
	}
	sql += " from t_topconn a"
				+" left join t_ip b"
				+" on a.srcip between b.ip_start_num and b.ip_end_num "
				+" where 1=1 "
			    +" and a.datetime between '"+beginDateStr+"'  and '"+endDateStr+"' "
				+" order by a.counts desc"
				+" limit 5";
*/
	    var sql = " select 	  aa.counts,  INET_NTOA(aa.srcip) as ip ,";

		if('en'==language){
			 sql += " b.continent_english as continent, b.country_english as country, b.province_english as province , b.city as city";
		}else{
			 sql += " b.continent , b.country , b.province , b.city ";
		}

		sql += " from "
			+" ("
			+" 	select "
			+" 	  a.counts,"
			+" 		a.srcip,"
			+" 	  a.datetime "
			+" 	from t_topconn a "
			+" 	where 1=1"
			+"  and a.datetime between '"+endDateStr+"'  and '"+beginDateStr+"' "
			+" 	order by a.datetime desc"
			+" 	limit 5"
			+" ) aa "
			+" left join t_ip b on aa.srcip between b.ip_start_num and b.ip_end_num"
			+" order by aa.counts desc"
			+" ;"


	connection.query(sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send(results);
		}
	});
});

//首页 点击最近攻击 弹窗信息（包含车辆信息和攻击源信息）
app.get('/getIntrusionDetail',function(req,res){

	var paramId = req.query.id;

	var language = req.query.language;
	if(!language){
		language = 'cn'; //默认中文
	}

	var sql = " select a.uuid,INET_NTOA(a.attack_ip) as hacker_ip, a.attack_type,a.attack_part,";

	if('en'==language){
		 sql += " 	atttype.usa as type_name,"
				 +" part.usa as part_name,"
				 +" attacklevel.usa as attack_level,"
				 +" b.continent_english as continent,b.country_english as country,b.province_english as province,"
				 +" hacker.continent_english as hacker_continent , hacker.country_english as hacker_country , hacker.province_english as hacker_province";
	}else{
		 sql += " atttype.zh_cn as type_name, "
				 +" part.zh_cn as part_name,"
				 +" attacklevel.zh_cn as attack_level,"
				 +" b.continent,b.country,b.province,"
				 +" hacker.continent as hacker_continent , hacker.country as hacker_country , hacker.province as hacker_province";
	}

	sql += " from t_attackinfo a "
		+" left join t_ip b on a.local_ip between b.ip_start_num and b.ip_end_num "
		+" left join t_attackenum atttype on a.attack_type = atttype.id"
		+" left join t_attackenum part on a.attack_part = part.id"
		+" left join t_ip hacker on a.attack_ip between hacker.ip_start_num and hacker.ip_end_num"
		+" left join t_attacklevelenum  attacklevel on a.attack_level = attacklevel.id"
		+" where a.id= ? ";

    connection.query(sql,[paramId],function(error,results,fields){
	if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send(results);
		}
	});
});


//随机取数据   用于前端查看效果
//首页   地球攻击  地球连接数据  还有左下角3条数据   一个请求返回
/* app.get('/getBallMultiDataRandom',function(req,res){

    //随机取700条攻击数据 暂时供前台测试地球
    var index = getRandomNumber();

	//两条随机攻击数据id
	var intrusionArr = [];
	intrusionArr[0] = getRandomNumber();
	intrusionArr[1] = getRandomNumber();
	var intrusionStr = intrusionArr.join();

	//5条随机活跃连接数据id
	var connectArr = [];
	for(var i=0;i<5;i++){
		connectArr.push(getRandomNumber());
	}
	var connStr = connectArr.join();



	function getRandomNumber(){
		var index = Math.floor(Math.random()*1000)+Math.floor(Math.random()*100)+Math.floor(Math.random()*10);
		if(index>700){
			index = 700;
		}
		return index
	}
    //首页-地球  攻击数据 先给2条
	var sql1 =" select a.uuid as car_id,b.continent,b.country,b.province,b.city,b.longitude,b.latitude,a.attack_date,DATE_FORMAT(a.attack_date,'%Y-%m-%d %T') as date"
			+" from t_attackinfo a left join t_ip b"
			+" on a.local_ip between b.ip_start_num and b.ip_end_num"
			+" where 1=1 and a.id in ("+intrusionStr+")"
			+" order by a.attack_date ;";

    //首页  地球  连接数据
	var sql2 = " select a.srcip,b.longitude,b.latitude,cast(a.target as char) as targets,a.datetime,DATE_FORMAT(a.datetime,'%Y-%m-%d %T') as date "
		+" from t_topconn a left join t_ip b  "
		+" on a.srcip between b.ip_start_num and b.ip_end_num"
		+" where 1=1 and a.id in ("+connStr+")"
		+" order by a.counts desc"
		+" limit 5 ;";

    connection.query(sql1+sql2,[index],function(error,results,fields){
	if(error){
			throw error;
		}else{
            //返回对象结构
			var returnData = {
				ballIntrusion:[],//攻击数据
				topConnection:[],//连接数据
				onlineNum:11486383,//cars online?  数据逻辑待定
				intrusionNum: 300744,//攻击
				protectNum:3333,//保护数量
				protectTime: 1000//保护时间
			}
			//
            returnData.ballIntrusion = results[0];
            returnData.topConnection = results[1];

            //数据处理
            //地球连接数据  结果处理
            returnData.topConnection.forEach(function(item,index){
		    	//console.log(item.targets);
		    	item.targets = JSON.parse(item.targets);
		    	//console.log(item.targets);
		    })
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send(returnData);
		}
	});

}); */



//使用时间映射
//首页   地球攻击  地球连接数据  还有左下角4条数据   一个请求返回
app.get('/getBallMultiDataTimeMap',function(req,res){

	//当前时间
	var curDate = new Date();

	//当前时间 格式化后字符串
	var curDateStr = getCurDateStr(curDate);
    //映射后的时间
	//var mapDate = changeCurDateToMapDate(curDate);//当前时间映射后的基准时间
	//console.log('------当前时间-------',curDateStr);
	//console.log('------映射到的时间-------',mapDate);



	//映射后的当前时间
	var beginMapDate = changeCurDateToMapDate(curDate);

	var endMapDate = changeCurDateToMapDate(curDate);
	endMapDate.setTime(endMapDate.setSeconds(endMapDate.getSeconds()+4));//结束时间与起始时间间距5秒

	//首页 球 连接数据 查询最近的5条数据，并排序  改为每次查询20秒内数据 自己设置的,这样能保证够5条数据
	var fiveMinutesBeforDateBallConnect = changeCurDateToMapDate(curDate);
	fiveMinutesBeforDateBallConnect.setTime(fiveMinutesBeforDateBallConnect.setSeconds(fiveMinutesBeforDateBallConnect.getSeconds()-4));
	var fiveMinutesBeforDateBallConnectStr = getCurDateStr(fiveMinutesBeforDateBallConnect);



	//左下角4个数字中  cars online 与 in danger 统计使用的时间，比起始时间向前5分钟
	var fiveMinutesBeforDate = changeCurDateToMapDate(curDate);
	fiveMinutesBeforDate.setTime(fiveMinutesBeforDate.setMinutes(fiveMinutesBeforDate.getMinutes()-4));


	//var beginDateStr = '2017-01-18 12:51:28';
	//var endDateStr = '2017-01-18 12:51:35';
	var beginDateStr = getCurDateStr(beginMapDate);
	var endDateStr = getCurDateStr(endMapDate);
	var fiveMinutesBeforStr = getCurDateStr(fiveMinutesBeforDate);
	var baseDate = '2017-09-20 11:00:00';


	var language = req.query.language;
	if(!language){
		language = 'cn'; //默认中文
	}


    //首页-地球  攻击数据 5秒内实际数据
	var sql1 = "select a.id,a.uuid as car_id , a.attack_date ,  "
	         +" date_format(a.attack_date,'%T') as attack_time,"
	         +" DATE_FORMAT(a.attack_date,'%Y-%m-%d %T') as structDate,"
	         +" b.longitude , b.latitude,";

	if('en'==language){
		 sql1 += " b.continent_english as continent, b.country_english as country, b.province_english as province , b.city as city ";
	}else{
		 sql1 += " b.continent , b.country , b.province , b.city ";
	}

	sql1 +=" from t_attackinfo a left join t_ip b"
			+" on a.local_ip between b.ip_start_num and b.ip_end_num"
			+" where 1=1 "
			+" and a.attack_date between '"+beginDateStr+"'  and '"+endDateStr+"' "
			+" order by a.attack_date ;";





    //首页  地球  连接数据
	var sql2 = " select a.srcip,b.longitude,b.latitude,cast(a.target as char) as targets,a.datetime"
			  //与列表top5 对比没有的字段
			  //+" ,INET_NTOA(a.srcip) as ip , a.counts"

			  +" from t_topconn a left join t_ip b  "
			  +" on a.srcip between b.ip_start_num and b.ip_end_num"
			  +" where 1=1 "
			  +" and a.datetime between '"+fiveMinutesBeforDateBallConnectStr+"'  and '"+beginDateStr+"' "
			  +" order by a.counts desc , a.datetime desc"
			  +" limit 5 ;";




	//首页  地球  左下角  4个数据



     var sql3 = " 	select count(distinct a.uuid) as num,'carsOnline' as type"
				+" 	from t_loginfo a "
				+"   where a.upload_time > '"+fiveMinutesBeforStr+"' and a.upload_time < '"+beginDateStr+"'"
				+" 	"
				+" 	union"
				// cars online  基准数据"
				+" 	select count(distinct a.uuid) as num,'carsOnlineBase' as type"
				+" 	from t_loginfo a "
				+"   where a.upload_time < '"+baseDate+"'"
				+" 	"
				+" 	union	"
				+" "
				//in danger : 攻击表 基于基准时间  时间映射去查3小时数据累加"
				+"   select  count(distinct a.uuid)as num,'inDanger' as type"
				+" 	from t_attackinfo a "
				+"   where a.attack_date > '"+fiveMinutesBeforStr+"' and a.attack_date < '"+beginDateStr+"'"
				+"   "
				+" 	union"
				+" 	"
				// in danger   基准数据"
				+"   select  count(distinct a.uuid) as num,'inDangerBase' as type"
				+" 	from t_attackinfo a "
				+"   where   a.attack_date < '"+baseDate+"'"
				+" "
				+" 	union"
				+" "
				//secure  :车辆表总数 减去  in danger车辆数"
				//+"   车辆总数"
				+"     select count(1) as num ,'totalCarNum' as type"
				+" 		from t_vehicleinfo "
				+"    union"
				//onlineTime "
				+"   select count(1)*5 as num,'onlineTime' as type"
				+" 	from t_loginfo a"
				+" 	where a.upload_time  > '"+fiveMinutesBeforStr+"' and a.upload_time < '"+beginDateStr+"'"
				//onlineTime 基准数据"
				+" 	union"
				+"   select count(1)*5 as num,'onlineTimeBase' as type"
				+" 	from t_loginfo a"
				+" 	where a.upload_time <'"+baseDate+"' ;";




    connection.query(sql1+sql2+sql3,function(error,results,fields){
	if(error){
			throw error;
		}else{
            //返回对象结构
			var returnData = {
				ballIntrusion:[],//攻击数据
				topConnection:[],//连接数据
				onlineNum:0,//cars online?  数据逻辑待定
				intrusionNum: 0,//攻击
				protectNum:0,//保护数量
				protectTime: 0//保护时间
			}
			//
            returnData.ballIntrusion = results[0];
            returnData.topConnection = results[1];

			//console.log(results[2]);
			//左下角4个统计数字处理
			// carsOnline  carsOnlineBase     inDanger  inDangerBase     totalCarNum       onlineTime  onlineTimeBase
			var tempObj = {};
			results[2].forEach(function(item,index){
				switch(item.type){

					case 'carsOnline':
					  tempObj.carsOnline = item.num ;
					  break;
					case 'carsOnlineBase':
					  tempObj.carsOnlineBase = item.num ;
					  break;


					case 'inDanger':
					  tempObj.inDanger = item.num ;
					  break;
					case 'inDangerBase':
					  tempObj.inDangerBase = item.num ;
					  break;


					case 'totalCarNum':
					  tempObj.totalCarNum = item.num ;
					  break;


					case 'onlineTime':
					  tempObj.onlineTime = item.num ;
					  break;
					case 'onlineTimeBase':
					  tempObj.onlineTimeBase = item.num ;
					  break;
				}
			});

/* 			onlineNum:0,//cars online?    数据逻辑待定
			intrusionNum: 0,// in danger 攻击
			protectNum:0,// secure       保护数量
			protectTime: 0// online time 保护时间
 */
			// carsOnline  carsOnlineBase     inDanger  inDangerBase     totalCarNum       onlineTime  onlineTimeBase
			//计算首页左下角4个数字    基准数据+映射变动数据
			returnData.onlineNum = tempObj.carsOnline + tempObj.carsOnlineBase ;//cars online
			returnData.intrusionNum = tempObj.inDanger + tempObj.inDangerBase ;//in danger
			returnData.protectNum = tempObj.totalCarNum - returnData.intrusionNum ;//secure
			returnData.protectTime = tempObj.onlineTime + tempObj.onlineTimeBase ;//time online

			//查看映射时间点攻击数据量 取数据库里核对
			/*
			console.log('------------------------------------')
			console.log('---映射后时间  起始时间----',beginDateStr)
			console.log('---映射后时间  结束时间----',endDateStr)
			console.log('------本次映射时间段内 攻击数据------',returnData.ballIntrusion)
			console.log('------------------------------------')
			*/


            //数据处理
            //地球连接数据  结果处理
            returnData.topConnection.forEach(function(item,index){
		    	//console.log(item.targets);
		    	item.targets = JSON.parse(item.targets);
		    	//console.log(item.targets);
		    })
			/*
		console.log('-------首页 球  攻击  开始-------------------------------------------');

		console.log('-------fiveMinutesBeforDateBallConnectStr---',fiveMinutesBeforDateBallConnectStr);
		console.log('-------beginDateStr-------------------------',beginDateStr);
		console.log('-------连接数据----------',returnData.topConnection.length);

		console.log('-------首页 球  攻击  结束--------------------------------------------');
			*/

	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send(returnData);
		}
	});

});


//=================首页  数据 结束=======================












//测试mysql不同类型参数传递
app.get('/testParamType',function(req,res){

	var startDateStr = '2017-01-18 12:51:28';
	var endDateStr = '2017-01-18 12:59:28';

	var sql = " select a.attack_date"
			+" from t_attackinfo a "
			+" where  a.attack_date between '"+startDateStr+"'  and '"+endDateStr+"'"
			+" order by a.attack_date ;";

    connection.query(sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.send(results);
		}
	});
});



















//测试时间查询
app.get('/testTimeMap',function(req,res){

	//当前时间
	var beginDate = new Date();
	var endDate = new Date();

	//var endDate_milli = endDate.getTime();
	//endDate.setTime(endDate_milli+1000*5);//结束时间与起始时间间距5秒

	endDate.setTime(endDate.setSeconds(endDate.getSeconds()+4));



	//当前时间 格式化后字符串
	var beginDateStr = getCurDateStr(beginDate);
	//console.log('------beginDateStr value : -------',beginDateStr);
	var endDateStr = getCurDateStr(endDate);
	//console.log('------endDateStr value : -------',endDateStr);




    //映射后的时间
	var mapDate = changeCurDateToMapDate(beginDate);

	//console.log('------映射到的时间-------',mapDate);


	var sql = "select a.attack_date,a.uuid,a.local_ip,a.attack_part "
	         +" ,'"+beginDateStr+"' as curDate"
	         +" from t_attackinfo a "
			 +" where Hour(a.attack_date)="+mapDate.hour+" and Minute(a.attack_date)="+mapDate.minute+" and Second(a.attack_date) ="+mapDate.second;
    //console.log(sql);
    connection.query(sql,function(error,results,fields){
		if(error){
			throw error;
		}else{
	        res.setHeader('Access-Control-Allow-Origin','*');
			res.setHeader('Cache-Control','no-cache,must-revalidate');
			res.send(results);
		}
	});
});

















//日期格式化成字符串函数 将日期输出为: '2017-01-01 12:22:02'格式字符串
function getCurDateStr(curDate){
    //用于返回给前端被映射到基准时间的当前时间
	var curDateObj = {
		year: curDate.getFullYear(),
		month: curDate.getMonth(),
		day: curDate.getDate(),
		hour: curDate.getHours(),
		minute: curDate.getMinutes(),
		second: curDate.getSeconds()
	}


    var curDateStr = "";
	//当前时间 格式化后字符串
    curDateStr = ""+curDateObj.year+"-"+curDateObj.month+"-"+curDateObj.day+" "+curDateObj.hour+":"+curDateObj.minute+":"+curDateObj.second;
    //console.log('-------curDateStr-------',curDateStr);

    //保留  勿删除
    if(curDateObj.hour<10) curDateObj.hour = '0'+curDateObj.hour;
    if(curDateObj.minute<10) curDateObj.minute = '0'+curDateObj.minute;
    if(curDateObj.second<10) curDateObj.second = '0'+curDateObj.second;

    curDateStr = ""+curDateObj.year+"-"+curDateObj.month+"-"+curDateObj.day+" "+curDateObj.hour+":"+curDateObj.minute+":"+curDateObj.second;
	//console.log('-------curDateStr-------',curDateStr);



	return curDateStr;
}








//时间映射函数
function changeCurDateToMapDate(currentDate){
 //var startDate = new Date('2017-10-03 01:34:35');// data start time 数据库数据起始时间
 //var startDate = new Date('2017-01-18 12:51:28');// data start time 数据库数据起始时间
 //2017-04-07 16:12:50
 //2017-10-07 16:19:28
 var startDate = new Date('2017-10-07 16:19:28');
 var constructDate ;//映射后的时间

 var curHour = currentDate.getHours();
 var curMinutes = currentDate.getMinutes();
 var curSeconds = currentDate.getSeconds();


 var calculateHour;
 //计算startHour
 if(curHour%2==0 && Math.floor(curHour/2)>0){
     calculateHour = curHour%2+1 ;
 }else{
     calculateHour = curHour%2;
 }

 var startHour = startDate.getHours();
 var startMinutes = startDate.getMinutes();
 var startSeconds = startDate.getSeconds();

/*  var startHour = 1
 var startMinutes = 34;
 var startSeconds = 35;
 */
 //加上差距
 var countHour = calculateHour + startHour ;
 var countMinutes = curMinutes + startMinutes ;
 var countSeconds = curSeconds + startSeconds ;

 //console.log('直接相加结果：',countHour,countMinutes,countSeconds);
 //60进制处理
 (function(){
    if(countSeconds>=60){
        countMinutes += Math.floor(countSeconds/60);
        countSeconds = countSeconds%60;
    }
    if(countMinutes>=60){
        countHour += Math.floor(countMinutes/60);
        countMinutes = countMinutes%60;
    }
    if(countHour>=24){//如果小时超了24  待处理

    }
 })();
 //console.log('60进制处理结果：',countHour,countMinutes,countSeconds);

 //个位数字时分秒转换成双位数
 //countHour<10?'0'+countHour:countHour

 //保留  勿删除
 //if(countHour<10) countHour = '0'+countHour;
 //if(countMinutes<10) countMinutes = '0'+countMinutes;
 //if(countSeconds<10) countSeconds = '0'+countSeconds;


  //构造时间
  //返回日期
  //constructDate = new Date('2017-10-13 '+countHour+":"+countMinutes+":"+countSeconds);
  //var dateStr = '2017/01/18 '+countHour+":"+countMinutes+":"+countSeconds;
  //console.log(dateStr);
  //constructDate = new Date(dateStr);
  constructDate = new Date(2017,10,7,countHour,countMinutes,countSeconds);
  //console.log('------constructDate----',constructDate);
  //返回字符串
  //constructDate = '2017-9-23 '+countHour+":"+countMinutes+":"+countSeconds;
  //返回对象
/*   constructDate  = {
	  hour:countHour,
	  minute:countMinutes,
	  second:countSeconds
  } */
 return constructDate;
}



//==============================echart 攻击数量统计 日期函数==============================

//图表 按天统计 补数据使用的日期相关函数
function getTotalDates(startDate, stopDate) {
  var dateArray = [];
  var currentDate = new Date(Date.parse(startDate));//避开引用传参
  while (currentDate <= stopDate) {
    dateArray.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate()+1);
  }
  return dateArray;
}



//日期格式化成字符串函数 将日期输出为: '2017-01-01'格式字符串
function formatDate(curDate){
    //用于返回给前端被映射到基准时间的当前时间
	var curDateObj = {
		year: curDate.getFullYear(),
		month: curDate.getMonth()+1,//js Date对象的getMonth方法返回的月份比实际值小1 ，在格式化日期输出时，要加上
		day: curDate.getDate(),
	}
    var curDateStr = "";

    if(curDateObj.month<10) curDateObj.month = '0'+curDateObj.month;
    if(curDateObj.day<10) curDateObj.day = '0'+curDateObj.day;

    curDateStr = curDateObj.year+"-"+curDateObj.month+"-"+curDateObj.day;

	return curDateStr;
}

//==============================echart 攻击数量统计 日期函数=  结束=============================



app.listen(3000,()=>console.log('Server listening on port 3000!'))
