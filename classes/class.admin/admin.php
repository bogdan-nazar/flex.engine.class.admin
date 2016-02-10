<?
/**
* Модуль Admin
*
* Использован бесплатный шаблон
* http://bambootheme.com/showcase/crisp/administrator/
*
* @author Bogdan Nazar <nazar_bogdan@itechserv.ru>
* @version 1.0.6 [2014.04.04]
*/
namespace FlexEngine;
defined("FLEX_APP") or die("Forbidden.");
if(defined("ADMIN_MODE"))return;
define("ADMIN_MODE","admin",false);
$i=0;
define("ADMIN_MODE_EDIT",$i++,false);//0
define("ADMIN_MODE_VIEW",$i++,false);
$i=0;
define("ADMIN_MODEDIT_CODE",$i++,false);
define("ADMIN_MODEDIT_CFG",$i++,false);
define("ADMIN_MODEDIT_SELF",$i++,false);
$i=0;
define("ADMIN_SECTION_CONTENT",$i++,false);
define("ADMIN_SECTION_HELP",$i++,false);
define("ADMIN_SECTION_INTRO",$i++,false);
define("ADMIN_SECTION_LOGIN",$i++,false);
define("ADMIN_SECTION_MEDIA",$i++,false);
define("ADMIN_SECTION_MODULES",$i++,false);
define("ADMIN_SECTION_SETTINGS",$i++,false);
define("ADMIN_SECTION_STAT",$i++,false);
define("ADMIN_SECTION_SYSTEM",$i++,false);
final class admin extends module
{
	private static $c				=	NULL;
	private static $config			=	array(
		"content-optItemsOnPage"	=>	10,
		"content-optSortBy"			=>	array("created","DESC"),
		"media-optListPerTime"		=>	10,
		"modules-optCoreHide"		=>	1,
		"modules-optItemsOnPage"	=>	20,
		"modules-optSortBy"			=>	array("title","ASC")
	);
	private static $content		=	array();
	private static $class		=	"";
	private static $module		=	array(
		"id"					=>	0,
		"act"					=>	0,
		"sub"					=>	ADMIN_MODEDIT_SELF,
		"binds"					=>	array(),
		"created"				=>	"",
		"updated"				=>	"",
		"class"					=>	"",
		"title"					=>	"",
		"hookInit"				=>	false,
		"hookExec"				=>	false,
		"hookRender"			=>	false,
		"hookSleep"				=>	false
	);
	private static $section		=	array();
	private static $sectionOpts	=	array(
		"loaded"				=>	false,
		ADMIN_SECTION_CONTENT	=>	array(
			"optHide"			=>	0,
			"optItemsOnPage"	=>	20,
			"optPage"			=>	0,
			"optSortBy"			=>	array("created","DESC")
		),
		ADMIN_SECTION_HELP		=>	array(),
		ADMIN_SECTION_INTRO		=>	array(),
		ADMIN_SECTION_LOGIN		=>	array(),
		ADMIN_SECTION_MEDIA		=>	array(),
		ADMIN_SECTION_MODULES	=>	array(
			"optCoreHide"		=>	1,
			"optItemsOnPage"	=>	20,
			"optPage"			=>	0,
			"optSortBy"			=>	array("title","ASC")
		),
		ADMIN_SECTION_SETTINGS	=>	array(),
		ADMIN_SECTION_STAT		=>	array(),
		ADMIN_SECTION_SYSTEM	=>	array()
	);
	private static $sections	=	array(
		ADMIN_SECTION_CONTENT	=>	array(
			"hasmode"			=>	true,
			"name"				=>	"content",
			"title"				=>	"Контент"
		),
		ADMIN_SECTION_HELP		=>	array(
			"hasmode"			=>	false,
			"name"				=>	"help",
			"title"				=>	"Помощь"
		),
		ADMIN_SECTION_INTRO		=>	array(
			"hasmode"			=>	false,
			"name"				=>	"intro",
			"title"				=>	"Начало"
		),
		ADMIN_SECTION_LOGIN		=>	array(
			"hasmode"			=>	false,
			"name"				=>	"login",
			"title"				=>	"Авторизация"
		),
		ADMIN_SECTION_MEDIA		=>	array(
			"hasmode"			=>	true,
			"name"				=>	"media",
			"title"				=>	"Файлы",
		),
		ADMIN_SECTION_MODULES	=>	array(
			"hasmode"			=>	true,
			"name"				=>	"modules",
			"title"				=>	"Модули",
		),
		ADMIN_SECTION_SETTINGS	=>	array(
			"hasmode"			=>	false,
			"name"				=>	"settings",
			"title"				=>	"Конфигурация"
		),
		ADMIN_SECTION_STAT		=>	array(
			"hasmode"			=>	false,
			"name"				=>	"stat",
			"title"				=>	"Статистика"
		),
		ADMIN_SECTION_SYSTEM	=>	array(
			"hasmode"			=>	false,
			"name"				=>	"system",
			"title"				=>	"Система"
		)
	);
	private static $session		=	array();

	private static function _actionBindings()
	{
		echo"{res:true,mid:".self::post("mid").",data:{mid:".self::post("mid")."}";
	}

	private static function _actionContentListFilter()
	{
		$filter=self::post(self::$class."-".self::$section["name"]."-list-filter");
		if(!$filter)$filter="sortby";
		switch($filter)
		{
			case "sortby":
				$sortby=self::post(self::$class."-".self::$section["name"]."-list-sortby");
				$sortby=explode(":",$sortby);
				if(count($sortby)!=2)return;
				if(!in_array($sortby[0],array("default","title","alias","date-cr","date-up")))return;
				switch($sortby[0])
				{
					case "title":
						self::$section["optSortBy"][0]="title";
						break;
					case "alias":
						self::$section["optSortBy"][0]="alias";
						break;
					case "date-cr":
						self::$section["optSortBy"][0]="created";
						break;
					case "date-up":
						self::$section["optSortBy"][0]="updated";
						break;
				}
				self::$section["optSortBy"][1]=($sortby[1]=="DESC"?"DESC":"ASC");
				self::$sectionOpts[ADMIN_SECTION_CONTENT]["optSortBy"][0]=self::$section["optSortBy"][0];
				self::$sectionOpts[ADMIN_SECTION_CONTENT]["optSortBy"][1]=self::$section["optSortBy"][1];
				break;
			case "showcnt":
				self::$section["optPage"]=0;
				self::$sectionOpts[ADMIN_SECTION_CONTENT]["optPage"]=self::$section["optPage"];
				$cnt=0+self::post(self::$class."-".self::$section["name"]."-list-showcnt");
				if(!in_array($cnt,array(10,20,30,40,50,100)))$cnt=10;
				self::$section["optItemsOnPage"]=$cnt;
				self::$sectionOpts[ADMIN_SECTION_CONTENT]["optItemsOnPage"]=self::$section["optItemsOnPage"];
				break;
			case "hide":
				self::$section["optHide"]=0+(!self::$section["optHide"]);
				self::$sectionOpts[ADMIN_SECTION_CONTENT]["optHide"]=self::$section["optHide"];
				break;
		}
	}

	private static function _actionContentSilentItemAliasCheck()
	{
		$alias=self::post(self::$class."-".self::$section["name"]."-alias");
		$cid=0+self::post(self::$class."-".self::$section["name"]."-cid");
		if(self::mquotes_gpc())$alias=stripslashes($alias);
		$res=content::check("alias",$alias,$cid);
		$msg="";
		if(!$res)
		{
			$msg=msgr::errorGet();
			$msg=self::libJsonPrepare($msg[0]["msg"]);
		}
		echo"{res:".($res?"true":"false").",msg:\"".$msg."\"}";
	}

	private static function _actionContentSilentItemCreate()
	{
		$alias=self::post(self::$class."-".self::$section["name"]."-alias");
		$title=self::post(self::$class."-".self::$section["name"]."-title");
		if(self::mquotes_gpc())
		{
			$alias=stripslashes($alias);
			$title=stripslashes($title);
		}
		$msg="";
		$res=content::create(array(0,0,0,$alias,$title,"",""),"");
		if($res===false)
		{
			$msg=msgr::errorGet();
			$msg=$msg[0]["msg"];
		}
		echo"{res:".($res?"true":"false").",id:".($res===false?0:$res).",msg:\"".self::libJsonPrepare($msg)."\"}";
	}

	private static function _actionContentSilentItemDelete()
	{
		$id=0+self::post(self::$class."-".self::$section["name"]."-id");
		$msg="";
		$res=content::delete($id);
		if(!$res)
		{
			$msg=msgr::errorGet();
			$msg=$msg[0]["msg"];
		}
		echo"{res:".($res?"true":"false").",msg:\"".self::libJsonPrepare($msg)."\"}";
	}

	private static function _actionContentSilentItemQuick()
	{
		$id=0+self::post(self::$class."-".self::$section["name"]."-id");
		if(!$id)
		{
			echo"{res:false,msg:\"Ошибка: идентификатор записи не задан.\"}";
			return;
		}
		//проверка заголовка
		$act=(self::post(self::$class."-".self::$section["name"]."-act")=="1"?1:0);
		$nolayout=(self::post(self::$class."-".self::$section["name"]."-nolayout")=="1"?1:0);
		$show_title=(self::post(self::$class."-".self::$section["name"]."-showtitle")=="1"?1:0);
		$alias=self::post(self::$class."-".self::$section["name"]."-alias");
		$title=self::post(self::$class."-".self::$section["name"]."-title");
		$meta_desc=self::post(self::$class."-".self::$section["name"]."-meta-description");
		$meta_kw=self::post(self::$class."-".self::$section["name"]."-meta-keywords");
		if($act && !$alias)
		{
			echo"{res:false,msg:\"Невозможно включить страницу без алиаса!\"}";
			return;
		}
		if(self::mquotes_gpc())
		{
			$alias=stripslashes($alias);
			$title=stripslashes($title);
			$meta_desc=stripslashes($meta_desc);
			$meta_kw=stripslashes($meta_kw);
		}
		$values=array(
			"act"=>$act,
			"nolayout"=>$nolayout,
			"show_title"=>$show_title,
			"alias"=>$alias,
			"title"=>$title,
			"meta_description"=>$meta_desc,
			"meta_keywords"=>$meta_kw
		);
		$msg="";
		$res=content::update(array(array("id","=",$id)),$values);
		if(!$res)
		{
			$msg=msgr::errorGet();
			$msg=self::libJsonPrepare($msg[0]["msg"]);
		}
		echo"{res:".($res?"true":"false").",msg:\"".$msg."\",updated:\"".self::dtR("",true)."\"}";
	}

	private static function _actionContentSilentItemQuickLoad()
	{
		$id=0+self::post(self::$class."-".self::$section["name"]."-id");
		$msg="";
		$res=content::fetch(array("act","show_title","nolayout","title","alias","meta_description","meta_keywords"),array(0=>array("id","=",$id)));
		if(!$res)
		{
			$msg=msgr::errorGet();
			$msg=$msg[0]["msg"];
		}
		else
		{
			$act=$res[0]["act"];
			$show_title=$res[0]["show_title"];
			$nolayout=$res[0]["nolayout"];
			$title=self::libJsonPrepare($res[0]["title"]);
			$alias=self::libJsonPrepare($res[0]["alias"]);
			$metaD=self::libJsonPrepare($res[0]["meta_description"]);
			$metaK=self::libJsonPrepare($res[0]["meta_keywords"]);
		}
		if($res) echo"{res:true,msg:\"\",act:".$act.",showTitle:".$show_title.",noLayout:".$nolayout.",title:\"".$title."\",alias:\"".$alias."\",metaDescription:\"".$metaD."\",metaKeywords:\"".$metaK."\"}";
		else echo"{res:false,msg:\"".self::libJsonPrepare($msg)."\"}";
	}

	private static function _actionContentSilentItemUpdate()
	{
		$id=0+self::post(self::$class."-".self::$section["name"]."-id");
		if(!$id)
		{
			echo"{res:false,msg:\"Ошибка: идентификатор записи не задан.\"}";
			return;
		}
		//проверка заголовка
		$act=(self::post(self::$class."-".self::$section["name"]."-act")=="1"?1:0);
		$nolayout=(self::post(self::$class."-".self::$section["name"]."-nolayout")=="1"?1:0);
		$show_title=(self::post(self::$class."-".self::$section["name"]."-showtitle")=="1"?1:0);
		$alias=self::post(self::$class."-".self::$section["name"]."-alias");
		$title=self::post(self::$class."-".self::$section["name"]."-title");
		$meta_desc=self::post(self::$class."-".self::$section["name"]."-meta-description");
		$meta_kw=self::post(self::$class."-".self::$section["name"]."-meta-keywords");
		$body=self::post(self::$class."-".self::$section["name"]."-body");
		if($act && !$alias)
		{
			echo"{res:false,msg:\"Невозможно включить страницу без алиаса!\"}";
			return;
		}
		if(self::mquotes_gpc())
		{
			$alias=stripslashes($alias);
			$title=stripslashes($title);
			$meta_desc=stripslashes($meta_desc);
			$meta_kw=stripslashes($meta_kw);
			$body=stripslashes($body);
		}
		$values=array(
			"act"=>$act,
			"nolayout"=>$nolayout,
			"show_title"=>$show_title,
			"alias"=>$alias,
			"title"=>$title,
			"meta_description"=>$meta_desc,
			"meta_keywords"=>$meta_kw
		);
		$msg="";
		$res=content::update(array(array("id","=",$id)),$values,$body);
		if(!$res)
		{
			$msg=msgr::errorGet();
			$msg=self::libJsonPrepare($msg[0]["msg"]);
		}
		echo"{res:".($res?"true":"false").",msg:\"".$msg."\",updated:\"".self::dtR("",true)."\"}";
	}

	private static function _actionContentSilentStateToggle()
	{
		$res="{res:";
		$id=0+self::post(self::$class."-".self::$section["name"]."-id");
		$flag=self::post(self::$class."-".self::$section["name"]."-flag");
		switch($flag)
		{
			case "switch":$flag="act";break;
			case "title":$flag="show_title";break;
			case "layout":$flag="nolayout";break;
			default:$flag="";
		}
		if(!$flag)
		{
			echo $res."false,msg:\"Error: unknown flag passed.\"}";
			return;
		}
		$recs=content::fetch($flag,array(0=>array("id","=",$id)));
		$l=count($recs);
		if(!$l)
		{
			echo $res."false,msg:\"Страница не найдена, возможно удалена в другой сессии.\"}";
			return;
		}
		if($l>1)
		{
			echo $res."false,msg:\"Невозможно выполнить операцию: ошибка целостности БД.\"}";
			return;
		}
		$val=$recs[0][$flag];
		if(!content::update(array(0=>array("id","=",$id)),array($flag=>false)))
		{
			$msg=msgr::errorGet();
			echo $res."false,msg:\"".self::libJsonPrepare($msg[0]["msg"])."\"}";
			return;
		}
		if($flag!="nolayout")$val=$val?0:1;
		echo $res."true,msg:\"\",flag:".$val.",cl:\"".($val?"":"off")."\",txt:\"".($val?"Да":"Нет")."\"}";
	}

	private static function _actionMediaSilentList()
	{
		$res="{res:";
		$module=self::post(self::$class."-media-module");
		$entity=0+self::post(self::$class."-media-entity");
		$itemsPerTime=0+self::post(self::$class."-media-count");
		//проверка модуля
		if(!$module || !@class_exists($module))
		{
			echo $res."false,msg:\"Ссылочный модуль не найден [".$module."]\"}";
			return;
		}
		$mid=self::modId($module,true);
		if(!$mid)
		{
			echo $res."false,msg:\"Ссылочный модуль не найден [".$module."]\"}";
			return;
		}
		//
		$ids=array();
		if(!$itemsPerTime)$itemsPerTime=self::$config["media-optListPerTime"];
		$items_own=",items_own:";
		$childs=array();
		if(!$entity)$items_own.="[],items_own_more:false";
		else
		{
			$recs=media::fetchArray($module,$entity,false,array(0,$itemsPerTime+1),true,false);
			if($recs===false)
			{
				$msg=msgr::errorGet();
				echo $res."false,msg:\"".self::libJsonPrepare($msg[0]["msg"])."\"}";
				return;
			}
			$c=count($recs);
			foreach($recs as $i=>$rec)
			{
				if(isset($rec["childs"]) && count($rec["childs"]))
				{
					$childs[]=array_merge(array(),$rec["childs"]);
					unset($rec["childs"]);
				}
			}
			if($c)$items_own.=self::libJsonMake($recs).",items_own_more:".($c<=$itemsPerTime?"false":"true");
			else $items_own.="[],items_own_more:false";
		}
		$recs=media::fetchArray($module,0,false,array(0,$itemsPerTime+1),true,false);
		if($recs===false)
		{
			$msg=msgr::errorGet();
			echo $res."false,msg:\"".self::libJsonPrepare($msg[0]["msg"])."\"}";
			return;
		}
		$c=count($recs);
		foreach($recs as $i=>$rec)
		{
			if(isset($rec["childs"]) && count($rec["childs"]))
			{
				$childs[]=array_merge(array(),$rec["childs"]);
				unset($rec["childs"]);
			}
		}
		if($c)$items_shared=",items_shared:".self::libJsonMake($recs).",items_shared_more:".($c<=$itemsPerTime?"false":"true");
		else $items_shared=",items_shared:[],items_shared_more:false";
		if(count($childs))$childs=",childs:".self::libJsonMake($childs);
		else $childs=",childs:[]";
		echo $res."true,msg:\"\"".$items_own.$items_shared.$childs.",rowsShowDef:".self::$config["media-optListPerTime"]."}";
	}

	private static function _actionMediaSilentXUpload()
	{
		$res="{res:";
		$module=self::post(self::$class."-media-uploader-module");
		$entity=0+self::post(self::$class."-media-uploader-entity");
		//проверка модуля
		if(!$module || !@class_exists($module))
		{
			$res.="false,msg:\"Ссылочный модуль не найден [".$module."]\"}";
			self::silentXResponseSet($res);
			return;
		}
		$q="SELECT `id` FROM ".db::tn("mods")." WHERE `class`='".$module."'";
		$r=db::q($q,false);
		if($r===false)
		{
			$res.="false,msg:\"Ошибка операции с базой данных!\"}";
			self::silentXResponseSet($res);
			return;
		}
		$rec=mysql_fetch_assoc($r);
		if(!$rec)
		{
			$res.="false,msg:\"Неверные параметры запроса: модуль не найден!\"}";
			self::silentXResponseSet($res);
			return;
		}
		$mid=0+$rec["id"];
		//проверка файла
		$f=media::postFile(self::$class."-media-uploader-file");
		if(!$f)
		{
			$res.="false,msg:\"Файл не загружен, убедитесь, что размер файла не превышает ".media::config("uploadFileMaxSize")." байт!\"}";
			self::silentXResponseSet($res);
			return;
		}
		//
		$name=trim(self::post(self::$class."-media-uploader-file-name"));
		if(!self::libValidStr($name,LIB_STR_TYPE_FILE,true,1,128,true,"Название файла"))
		{
			$res.="false,msg:\"".self::libLastMsg()."\"}";
			self::silentXResponseSet($res);
			return;
		}
		$credit=trim(self::post(self::$class."-media-uploader-file-credit"));
		$title=trim(self::post(self::$class."-media-uploader-file-title"));
		if(self::mquotes_gpc())
		{
			$title=stripslashes($title);
			$credit=stripslashes($credit);
		}
		$nameId=(0+self::post(self::$class."-media-uploader-file-noid"))?0:1;
		if(!$name)$nameId=1;//защита от "пустого" имени
		$nameSized=(0+self::post(self::$class."-media-uploader-file-nosizes"))?0:1;
		//проверка директории сохранения
		$dir=self::post(self::$class."-media-uploader-destination");
		$dir=trim($dir,"/");
		if(!$dir && $entity)$dir="".$entity;
		$values=array();
		$values["name"]=$name;
		$values["name_id"]=$nameId;
		$values["name_sized"]=$nameSized;
		$values["directory"]=$dir;
		$values["title"]=$title;
		$values["credit"]=$credit;
		$item=media::create($module,$f,$values,array("oid"=>$entity));
		$item="item:".self::libJsonMake($item);
		//$item="item:{id:".$id.",pid:0,width:".$szW.",height:".$szH.",bytes:".$fsize.",dt:\"".$dtSQL."\",dts:".$dt.",name_id:".$nameId.",name_sized:".$nameSized.",size_delim:\"".self::$config["sizeDelimiter"]."\",extension:\"".$ext."\",name:\"".$name."\",path:\"".$dir."\",title:\"".$title."\",credit:\"".$credit."\",content_type:\"".$ctp."\"}";
		$res.="true,msg:\"\",".$item."}";
		self::silentXResponseSet($res);
	}

	private static function _actionModuleInvertState()
	{
		$ids=self::post(self::$class."-".self::$section["name"]."-ids");
		if(!is_array($ids) || !count($ids))
		{
			msgr::add("Некорректные данные запроса!");
			return;
		}
		if(count($ids)==1)$sql="=".$ids[0];
		else $sql=" IN (".implode(",",$ids).")";
		db::q("UPDATE ".db::tn("mods")." SET `act`=NOT `act` WHERE `id`{$sql} AND `core`=0",true);
	}

	private static function _actionModulesListFilter()
	{
		$filter=self::post(self::$class."-".self::$section["name"]."-list-filter");
		if(!$filter)$filter="sortby";
		switch($filter)
		{
			case "sortby":
				$sortby=self::post(self::$class."-".self::$section["name"]."-list-sortby");
				$sortby=explode(":",$sortby);
				if(count($sortby)!=2)return;
				if(!in_array($sortby[0],array("default","title","name","date-cr","date-up")))return;
				switch($sortby[0])
				{
					case "title":
						self::$section["optSortBy"][0]="title";
						break;
					case "name":
						self::$section["optSortBy"][0]="class";
						break;
					case "date-cr":
						self::$section["optSortBy"][0]="created";
						break;
					case "date-up":
						self::$section["optSortBy"][0]="updated";
						break;
				}
				self::$section["optSortBy"][1]=($sortby[1]=="DESC"?"DESC":"ASC");
				self::$sectionOpts[ADMIN_SECTION_MODULES]["optSortBy"][0]=self::$section["optSortBy"][0];
				self::$sectionOpts[ADMIN_SECTION_MODULES]["optSortBy"][1]=self::$section["optSortBy"][1];
				break;
			case "showcnt":
				self::$section["optPage"]=0;
				self::$sectionOpts[ADMIN_SECTION_MODULES]["optPage"]=self::$section["optPage"];
				$cnt=0+self::post(self::$class."-".self::$section["name"]."-list-showcnt");
				if(!in_array($cnt,array(10,20,30,40,50,100)))$cnt=10;
				self::$section["optItemsOnPage"]=$cnt;
				self::$sectionOpts[ADMIN_SECTION_MODULES]["optItemsOnPage"]=self::$section["optItemsOnPage"];
				break;
			case "hidesys":
				self::$section["optCoreHide"]=0+(!self::$section["optCoreHide"]);
				self::$sectionOpts[ADMIN_SECTION_MODULES]["optCoreHide"]=self::$section["optCoreHide"];
				break;
		}
	}

	private static function _contentRenderEditor()
	{
		if(!isset(self::$content["id"]))$id=0;
		else $id=0+self::$content["id"];
		if(!$id)$item=false;
		else $item=content::fetch(array(),array(0=>array("id","=",$id)));
		if($item===false)
		{
			echo"Страница не найдена";
			return;
		}
		$item=$item[0];
		$item["body"]=content::data($item["id"]);
		$wrap=content::wrap($item["id"],$item["alias"]);
		$t=tpl::get(self::$class,"content-edit");
		$t->setVar("sectName",self::$section["name"]);
		$t->setVar("id",$item["id"]);
		$t->setVar("title",str_replace("\"","&#34;",$item["title"]));
		$t->setVar("alias",$item["alias"]);
		$t->setVar("meta-description",str_replace("\"","&#34;",$item["meta_description"]));
		$t->setVar("meta-keywords",str_replace("\"","&#34;",$item["meta_keywords"]));
		$t->setVar("act-off",$item["act"]?"":"off");
		$t->setVar("act-yes",$item["act"]?"Да":"Нет");
		$t->setVar("title-off",$item["show_title"]?"":"off");
		$t->setVar("title-yes",$item["show_title"]?"Да":"Нет");
		$t->setVar("layout-off",$item["nolayout"]?"off":"");
		$t->setVar("layout-yes",$item["nolayout"]?"Нет":"Да");
		$t->setVar("wrap-start",$wrap[0]);
		$t->setVar("body",$item["body"]);
		$t->setVar("wrap-end",$wrap[1]);
		$t->setVar("editor-path",(FLEX_APP_DIR_ROOT.FLEX_APP_DIR_HLP_CKEED4));
		$t->_render();
	}

	private static function _contentRenderList()
	{
		$cnt=content::count_(array(0=>array("id","!=","2")));
		$pages=array();
		$pc=($cnt-$cnt%self::$section["optItemsOnPage"])/self::$section["optItemsOnPage"];
		if($pc*self::$section["optItemsOnPage"]!=$cnt)$pc++;
		$start=self::$section["optPage"]*self::$section["optItemsOnPage"];
		if(($start<0) || ($start>$cnt))
		{
			self::$section["optPage"]=$pc-1;
			$start=self::$section["optPage"]*self::$section["optItemsOnPage"];
		}
		for($c=0;$c<$pc;$c++)
			$pages[]=array("page"=>$c,"num"=>($c+1),"pact"=>(self::$section["optPage"]==$c?"pact":""));
		$filters=array();
		$filters[]=array("id","!=","2");
		if(self::$section["optHide"])$filters[]=array("act","=","1");
		$recs=content::fetch(array(),$filters,self::$section["optSortBy"],array($start,self::$section["optItemsOnPage"]));
		$entries=array();
		foreach($recs as $row)
		{
			$id=$row["id"];
			$act=$row["act"];
			$st=$row["show_title"];
			$nl=$row["nolayout"];
			$created=self::dtR($row["created"],true);
			$updated=self::dtR($row["updated"],true);
			$alias=$row["alias"];
			$title=$row["title"];
			$spanAct=($act?"":" off");
			$spanActText=($act?"Да":"Нет");
			$spanST=($st?"":" off");
			$spanSTText=($st?"Да":"Нет");
			$spanNL=(!$nl?"":" off");
			$spanNLText=(!$nl?"Да":"Нет");
			$entries[]=array(
				"created"=>$created,
				"id"=>$id,
				"alias"=>$alias,
				"spanAct"=>$spanAct,
				"spanActText"=>$spanActText,
				"spanST"=>$spanST,
				"spanSTText"=>$spanSTText,
				"spanNL"=>$spanNL,
				"spanNLText"=>$spanNLText,
				"title"=>$title,
				"updated"=>$updated
			);
		}
		$t=tpl::get(self::$class,"content-list");
		$t->setVar("sectName",self::$section["name"]);
		$t->setVar("sortby-".self::$section["optSortBy"][0]."-".self::$section["optSortBy"][1]," selected=\"selected\"");
		$t->setVar("showcnt-".self::$section["optItemsOnPage"]," selected=\"selected\"");
		if(self::$section["optHide"])$t->setVar("hide"," checked=\"checked\"");
		$t->setArrayCycle("entries",$entries);
		if(count($pages)>1)$t->setArrayCycle("pager",$pages);
		$t->_render();
		$t=tpl::get(self::$class,"content-list-create");
		$t->_render();
		$t=tpl::get(self::$class,"content-list-quick");
		$t->_render();
	}

	private static function _moduleEmpty()
	{
		self::$module["id"]=0;
		self::$module["act"]=0;
		self::$module["sub"]=ADMIN_MODEDIT_SELF;
		self::$module["binds"]=array();
		self::$module["created"]="";
		self::$module["updated"]="";
		self::$module["class"]="";
		self::$module["title"]="";
		self::$module["hookInit"]=false;
		self::$module["hookExec"]=false;
		self::$module["hookRender"]=false;
		self::$module["hookSleep"]=false;
	}

	private static function _moduleGet()
	{
		self::_moduleEmpty();
		$id=0+self::post(self::$class."-".self::$section["name"]."-id");
		if(!$id)
		{
			self::$module["title"]="Новый модуль";
			return true;
		}
		$r=db::q("SELECT * FROM ".db::tn("mods")." WHERE id={$id}",true);
		$rec=mysql_fetch_assoc($r);
		if(!$rec)
		{
			msgr::add(_t("Модуль не найден")."[{$id}]");
			return false;
		}
		self::$module["id"]=$id;
		self::$module["act"]=$rec["act"];
		self::$module["binds"]=array();
		self::$module["created"]=$rec["created"];
		self::$module["updated"]=$rec["updated"];
		self::$module["class"]=$rec["class"];
		self::$module["title"]=$rec["title"];
		self::$module["hookInit"]=self::modHookName("initDeep");
		if(!@method_exists(self::$module["class"],self::$module["hookInit"]))
		{
			self::$module["hookInit"]=self::modHookName("init").self::modHookName("adminSuf");
			if(!@method_exists(self::$module["class"],self::$module["hookInit"]))self::$module["hookInit"]=false;
		}
		self::$module["hookExec"]=self::modHookName("execDeep");
		if(!@method_exists(self::$module["class"],self::$module["hookExec"]))
		{
			self::$module["hookExec"]=self::modHookName("exec").self::modHookName("adminSuf");
			if(!@method_exists(self::$module["class"],self::$module["hookExec"]))self::$module["hookExec"]=false;
		}
		self::$module["hookRender"]=self::modHookName("renderDeep");
		if(!@method_exists(self::$module["class"],self::$module["hookRender"]))
		{
			self::$module["hookRender"]=self::modHookName("render").self::modHookName("adminSuf");
			if(!@method_exists(self::$module["class"],self::$module["hookRender"]))self::$module["hookRender"]=false;
		}
		self::$module["hookSleep"]=self::modHookName("sleepDeep");
		if(!@method_exists(self::$module["class"],self::$module["hookSleep"]))
		{
			self::$module["hookSleep"]=self::modHookName("sleep").self::modHookName("adminSuf");
			if(!@method_exists(self::$module["class"],self::$module["hookSleep"]))self::$module["hookSleep"]=false;
		}
		return true;
	}

	private static function _modulesRenderEditor()
	{
		$data="";
		if(self::$module["hookRender"])
		{
			@ob_start();
			@call_user_func(array(self::$module["class"],self::$module["hookRender"]),self::$module["class"]);
			$data=ob_get_contents();
			ob_end_clean();
		}
		if(self::$module["hookSleep"])@call_user_func(array(self::$module["class"],self::$module["hookSleep"]),self::$module["class"]);
		if(!$data)$data=_t("Модуль не имеет собственных функций управления данными.");
		$t=tpl::get(self::$class,"modules-data");
		$t->setVar("data",$data);
		$tab="self";
		if(self::$module["sub"]==ADMIN_MODEDIT_CODE)$tab="code";
		if(self::$module["sub"]==ADMIN_MODEDIT_CFG)$tab="cfg";
		$t->setVar("tab",$tab);
		$t->_render();
	}

	private static function _modulesRenderList()
	{
		$qpr=" FROM ".db::tn("mods")." WHERE `class`!='".self::$class."'".(self::$section["optCoreHide"]?" AND `core`!=1":"")." ";
		$q="SELECT COUNT(`id`) AS `cnt`".$qpr;
		$r=db::q($q,true);
		$cnt=@mysql_fetch_assoc($r);
		$cnt=0+$cnt["cnt"];
		$pages=array();
		$pc=($cnt-$cnt%self::$section["optItemsOnPage"])/self::$section["optItemsOnPage"];
		if($pc*self::$section["optItemsOnPage"]!=$cnt)$pc++;
		$start=self::$section["optPage"]*self::$section["optItemsOnPage"];
		if(($start<0) || ($start>$cnt))
		{
			self::$section["optPage"]=$pc-1;
			$start=self::$section["optPage"]*self::$section["optItemsOnPage"];
		}
		for($c=0;$c<$pc;$c++)
			$pages[]=array("page"=>$c,"num"=>($c+1),"pact"=>(self::$section["optPage"]==$c?"pact":""));
		$q="SELECT *".$qpr.
		"ORDER BY ".(self::$section["optCoreHide"]?"":"`core` DESC, `ord`, ")."`".self::$section["optSortBy"][0]."` ".self::$section["optSortBy"][1]." ".
		"LIMIT {$start},".self::$section["optItemsOnPage"];
		$r=db::q($q,true);
		$ids=array();
		$entries=array();
		while($row=mysql_fetch_assoc($r))
		{
			$id=0+$row["id"];
			$ids[]=$id;
			$act=0+$row["act"];
			$core=0+$row["core"];
			$isAdminText=$core?"<span class=\"admin-sys\">Да</span>":"Нет";
			$check="";
			if(!$core)
				$check="<input type=\"checkbox\" id=\"".self::$class."-".self::$section["name"]."-ids".$id."\" name=\"".self::$class."-".self::$section["name"]."-ids[]\" value=\"".$id."\" />";
			$created=self::dtR($row["created"],true);
			$updated=self::dtR($row["updated"],true);
			$module=$row["class"];
			$title=$row["title"];
			$spanAct=$core?" class=\"admin-systune\"":(" class=\"admin-tune".($act?"":" off")."\" onclick=\"render.pluginGet('".self::$class."').callWrap('onClickTurn',[".$id."]);\"");
			$spanActText=($act?"Да":"Нет");
			$spanTune=$core?" class=\"admin-systune\"":(" class=\"admin-tune\" onclick=\"render.pluginGet('".self::$class."').callBinds('onClickShow',[".$id."])\"");
			$spanTuneText=$core?"отсутствуют":"[Изменить]";
			$core=$core?"core":"";
			$entries[]=array(
				"check"=>$check,
				"core"=>$core,
				"created"=>$created,
				"id"=>$id,
				"isAdminText"=>$isAdminText,
				"module"=>$module,
				"spanAct"=>$spanAct,
				"spanActText"=>$spanActText,
				"spanTune"=>$spanTune,
				"spanTuneText"=>$spanTuneText,
				"title"=>$title,
				"updated"=>$updated
			);
		}
		$t=tpl::get(self::$class,"modules-list");
		$t->setVar("sortby-".self::$section["optSortBy"][0]."-".self::$section["optSortBy"][1]," selected=\"selected\"");
		$t->setVar("showcnt-".self::$section["optItemsOnPage"]," selected=\"selected\"");
		if(self::$section["optCoreHide"])$t->setVar("hidesys"," checked=\"checked\"");
		$t->setArrayCycle("entries",$entries);
		if(count($pages)>1)$t->setArrayCycle("pager",$pages);
		$t->setVar("ids",implode(",",$ids));
		$t->_render();
	}

	private static function _renderContent()
	{
		switch(self::$section["mode"])
		{
			case ADMIN_MODE_EDIT:
				self::_contentRenderEditor();
				break;
			default:
				self::_contentRenderList();//view
		}
	}

	private static function _renderIntro()
	{

	}

	private static function _renderLoginBox($note="",$url="")
	{
		if(!$note)$note=self::config("","siteName").": для доступа в административный раздел требуется авторизация.";
		if(isset($url))self::$session["url"]=$url;
		$t=tpl::get(self::$class,"login-box");
		$t->setVar("sectId",self::$section["id"]);
		$t->setVar("sectName",self::$section["name"]);
		$t->setVar("note",$note);
		$t->setVar("login",(self::post(self::$class."-username")));
		$t->_render();
	}

	private static function _renderMedia()
	{

	}

	private static function _renderModules()
	{
		switch(self::$section["mode"])
		{
			case ADMIN_MODE_EDIT:
				self::_modulesRenderEditor();
				break;
			default:
				self::_modulesRenderList();//view
		}
	}

	private static function _renderSettings()
	{

	}

	private static function _renderSystem()
	{
		$i=true;
		$php=array();
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"PHP версия:","value"=>phpversion());
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"PHP идентификатор процесса:","value"=>zend_version());
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"PHP ZEND версия:","value"=>getmypid());
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Владелец скрипта:","value"=>get_current_user());
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Владелец скрипта [UID]:","value"=>getmyuid());
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Владелец скрипта [GID]:","value"=>getmygid());
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Владелец скрипта [inode]:","value"=>getmyinode());
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Макс. время выполнения скрипта:","value"=>ini_get("max_execution_time"));
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Макс. размер загружаемого файла:","value"=>ini_get("upload_max_filesize"));
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Макс. размер POST-данных:","value"=>ini_get("post_max_size"));
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Макс. объем памяти скрипта:","value"=>ini_get("memory_limit"));
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Папка загружаемых файлов:","value"=>ini_get("upload_tmp_dir"));
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Папка хранения сессий:","value"=>ini_get("session.save_path"));
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Путь включения скриптов:","value"=>get_include_path());
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Cборщик циклических ссылок:","value"=>@function_exists("gc_enabled")?(gc_enabled()?"On":"Off"):"N/A(?)");
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"MAGIC_QUOTES_GPC:","value"=>self::mquotes_gpc()?"On":"Off");
		$php[]=array("row"=>(1+(0+($i=!$i))),"name"=>"MAGIC_QUOTES_RUNTIME:","value"=>self::mquotes_runtime()?"On":"Off");
  		$i=true;
  		$mysql=array();
		$mysql[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Версия сервера:","value"=>mysql_get_server_info());
		$mysql[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Имя сервера:","value"=>db::coninfo("host"));
		$mysql[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Имя БД:","value"=>db::coninfo("name"));
		$mysql[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Имя пользователя:","value"=>db::coninfo("user"));
		$mysql[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Пароль:","value"=>db::coninfo("pass"));
		$mysql[]=array("row"=>(1+(0+($i=!$i))),"name"=>"Используемое расширение:","value"=>mysql);
		$t=tpl::get(self::$class,self::$section["name"]);
		$t->setArrayCycle("php",$php);
		$t->setArrayCycle("mysql",$mysql);
		$t->_render();
	}

	private static function _sectionSet($section=false,$mode=ADMIN_MODE_VIEW)
	{
		if($section===false)$section=ADMIN_SECTION_INTRO;
		self::$section=array_merge(self::$sections[$section],self::$sectionOpts[$section]);
		self::$section["id"]=$section;
		self::$section["mode"]=$mode;
	}

	public static function _on1init()
	{
		self::$class=self::_class();
		self::$session=self::sessionGet();
		if(isset(self::$session["section"]))self::$section=self::$session["section"];
		if(isset(self::$session["sectionOpts"]))self::$sectionOpts=self::$session["sectionOpts"];
		if(isset(self::$session["content"]))self::$content=self::$session["content"];
		if(isset(self::$session["module"]))self::$module=self::$session["module"];
		if(self::accessGot("render"))self::_sectionSet(ADMIN_SECTION_LOGIN);
	}

	public static function _on2exec()
	{
		if(!self::silent())
		{
			self::resourceStyleAdd();
			self::resourceScriptAdd();
		}
		if(!count(self::$section))
		{
			self::_sectionSet(false);
		}
		if(!self::$sectionOpts["loaded"])
		{
			self::$sectionOpts["loaded"]=true;
			for($c=ADMIN_SECTION_CONTENT;$c<=ADMIN_SECTION_SYSTEM;$c++)
			{
				switch($c)
				{
					case ADMIN_SECTION_CONTENT:
						self::$sectionOpts[ADMIN_SECTION_CONTENT]["optItemsOnPage"]=self::$config["content-optItemsOnPage"];
						self::$sectionOpts[ADMIN_SECTION_CONTENT]["optSortBy"]=self::$config["content-optSortBy"];
						break;
					case ADMIN_SECTION_MODULES:
						self::$sectionOpts[ADMIN_SECTION_MODULES]["optCoreHide"]=self::$config["modules-optCoreHide"];
						self::$sectionOpts[ADMIN_SECTION_MODULES]["optItemsOnPage"]=self::$config["modules-optItemsOnPage"];
						self::$sectionOpts[ADMIN_SECTION_MODULES]["optSortBy"]=self::$config["modules-optSortBy"];
						break;
				}
			}
		}
		if(self::action(self::$class."-section-set"))
		{
			$id=0+self::post(self::$class."-section-id");
			if(($id<ADMIN_SECTION_CONTENT) || ($id>ADMIN_SECTION_SYSTEM))$id=0;
			self::_sectionSet($id);
		}
		if(!self::$sections[self::$section["id"]]["hasmode"])self::$section["mode"]=ADMIN_MODE_VIEW;
		switch(self::$section["id"])
		{
			case ADMIN_SECTION_CONTENT:
				self::$section=array_merge(self::$section,self::$sectionOpts[ADMIN_SECTION_CONTENT]);
				if(self::action(self::$class."-".self::$section["name"]."-mode-edit"))
				{
					self::$section["mode"]=ADMIN_MODE_EDIT;
					$id=0+self::post(self::$class."-".self::$section["name"]."-id");
					if($id)self::$content=array("id"=>$id);
				}
				if(self::action(self::$class."-".self::$section["name"]."-mode-list"))
				{
					self::$section["mode"]=ADMIN_MODE_VIEW;
					self::$content=array();
				}
				if(self::action(self::$class."-".self::$section["name"]."-alias-check"))self::_actionContentSilentItemAliasCheck();
				switch(self::$section["mode"])
				{
					case ADMIN_MODE_VIEW:
						if(self::action(self::$class."-".self::$section["name"]."-list-create"))self::_actionContentSilentItemCreate();
						if(self::action(self::$class."-".self::$section["name"]."-list-filter"))self::_actionContentListFilter();
						if(self::action(self::$class."-".self::$section["name"]."-list-quick-load"))self::_actionContentSilentItemQuickLoad();
						if(self::action(self::$class."-".self::$section["name"]."-list-quick"))self::_actionContentSilentItemQuick();
						if(self::action(self::$class."-".self::$section["name"]."-list-toggle"))self::_actionContentSilentStateToggle();
						if(self::action(self::$class."-".self::$section["name"]."-list-pager"))self::$section["optPage"]=0+self::post(self::$class."-".self::$section["name"]."-list-pager");
						break;
					case ADMIN_MODE_EDIT:
						if(self::action(self::$class."-".self::$section["name"]."-edit-apply"))self::_actionContentSilentItemUpdate();
						if(self::action(self::$class."-".self::$section["name"]."-edit-save"))self::_actionContentSilentItemUpdate();
						if(self::action(self::$class."-media-list"))self::_actionMediaSilentList();
						if(self::action(self::$class."-media-uploader-upload"))self::_actionMediaSilentXUpload();
						break;
				}
				break;
			case ADMIN_SECTION_LOGIN:
				if(self::action(self::$class."-login"))
				{
					if(self::access(self::post(self::$class."-login-name"),self::post(self::$class."-login-pass")))self::_sectionSet(ADMIN_SECTION_MODULES);
				}
				break;
			case ADMIN_SECTION_MEDIA:
				break;
			case ADMIN_SECTION_MODULES:
				self::$section=array_merge(self::$section,self::$sectionOpts[ADMIN_SECTION_MODULES]);
				if(self::action(self::$class."-".self::$section["name"]."-editor") && self::_moduleGet())self::$section["mode"]=ADMIN_MODE_EDIT;
				if(self::action(self::$class."-".self::$section["name"]."-list"))
				{
					self::_moduleEmpty();
					self::$section["mode"]=ADMIN_MODE_VIEW;
				}
				switch(self::$section["mode"])
				{
					case ADMIN_MODE_EDIT:
						if(self::$module["id"])
						{
							if(self::$module["hookInit"])@call_user_func(array(self::$module["class"],self::$module["hookInit"]),self::$module["class"]);
							if(self::$module["hookExec"])@call_user_func(array(self::$module["class"],self::$module["hookExec"]),self::$module["class"]);
							if(self::silent() && self::$module["hookSleep"])@call_user_func(array(self::$module["class"],self::$module["hookSleep"]));
						}
						break;
					default://list
						if(self::action(self::$class."-".self::$section["name"]."-list-filter"))self::_actionModulesListFilter();
						if(self::action(self::$class."-".self::$section["name"]."-list-pager"))self::$section["optPage"]=0+self::post(self::$class."-".self::$section["name"]."-list-pager");
						if(self::action(self::$class."-".self::$section["name"]."-invert-state"))self::_actionModuleInvertState();

				}
				break;
			case ADMIN_SECTION_INTRO:
				break;

		}
	}

	public static function _on3render()
	{
		$siteName=self::config("","siteName");
		if(!self::accessGot("render"))
		{
			self::_renderLoginBox($siteName." Admin: доступ ограничен");
			return;
		}
		$sectionTitle=self::$section["title"];
		switch(self::$section["id"])
		{
			case ADMIN_SECTION_MODULES:
				$sectionTitle="<span class=\"root\"".((self::$section["mode"]==ADMIN_MODE_EDIT)?" onclick=\"render.pluginGet('".self::$section["name"]."').list()\"":"").">Модули</span>".((self::$section["mode"]==ADMIN_MODE_EDIT)?(" :: ".(self::$module["id"]?self::$module["title"]:"Новый модуль")):"");
				break;
		}
		$t=tpl::get(self::$class,"main");
		$t->setVar("siteName",self::config("","siteName"));
		$t->setVar("userName",self::accessData("name"));
		$t->setVar("sectId",self::$section["id"]);
		$t->setVar("sectHasMode",self::$section["hasmode"]?" hasmode":"");
		$t->setVar("sectMode",self::$section["mode"]);
		$t->setVar("sectName",self::$section["name"]);
		$t->setVar("sectTitle",$sectionTitle);
		$t->setVar("sectIntroAct",self::$sections[ADMIN_SECTION_INTRO]["name"]==self::$section["name"]?" act":"");
		$t->setVar("sectContentAct",self::$sections[ADMIN_SECTION_CONTENT]["name"]==self::$section["name"]?" act":"");
		$t->setVar("sectMediaAct",self::$sections[ADMIN_SECTION_MEDIA]["name"]==self::$section["name"]?" act":"");
		$t->setVar("sectModulesAct",self::$sections[ADMIN_SECTION_MODULES]["name"]==self::$section["name"]?" act":"");
		$t->setVar("sectSettingsAct",self::$sections[ADMIN_SECTION_SETTINGS]["name"]==self::$section["name"]?" act":"");
		$t->setVar("sectStatAct",self::$sections[ADMIN_SECTION_STAT]["name"]==self::$section["name"]?" act":"");
		$t->setVar("sectSystemAct",self::$sections[ADMIN_SECTION_SYSTEM]["name"]==self::$section["name"]?" act":"");
		$t->setVar("sectHelpAct",self::$sections[ADMIN_SECTION_HELP]["name"]==self::$section["name"]?" act":"");
		$t->setVar("sectIntroTitle",self::$sections[ADMIN_SECTION_INTRO]["title"]);
		$t->setVar("sectContentTitle",self::$sections[ADMIN_SECTION_CONTENT]["title"]);
		$t->setVar("sectMediaTitle",self::$sections[ADMIN_SECTION_MEDIA]["title"]);
		$t->setVar("sectModulesTitle",self::$sections[ADMIN_SECTION_MODULES]["title"]);
		$t->setVar("sectSettingsTitle",self::$sections[ADMIN_SECTION_SETTINGS]["title"]);
		$t->setVar("sectStatTitle",self::$sections[ADMIN_SECTION_STAT]["title"]);
		$t->setVar("sectSystemTitle",self::$sections[ADMIN_SECTION_SYSTEM]["title"]);
		$t->setVar("sectHelpTitle",self::$sections[ADMIN_SECTION_HELP]["title"]);
		$t->setVar("sectIntroName",self::$sections[ADMIN_SECTION_INTRO]["name"]);
		$t->setVar("sectContentName",self::$sections[ADMIN_SECTION_CONTENT]["name"]);
		$t->setVar("sectMediaName",self::$sections[ADMIN_SECTION_MEDIA]["name"]);
		$t->setVar("sectModulesName",self::$sections[ADMIN_SECTION_MODULES]["name"]);
		$t->setVar("sectSettingsName",self::$sections[ADMIN_SECTION_SETTINGS]["name"]);
		$t->setVar("sectStatName",self::$sections[ADMIN_SECTION_STAT]["name"]);
		$t->setVar("sectSystemName",self::$sections[ADMIN_SECTION_SYSTEM]["name"]);
		$t->setVar("sectHelpName",self::$sections[ADMIN_SECTION_HELP]["name"]);
		$t->setVar("sectIntro",ADMIN_SECTION_INTRO);
		$t->setVar("sectContent",ADMIN_SECTION_CONTENT);
		$t->setVar("sectMedia",ADMIN_SECTION_MEDIA);
		$t->setVar("sectModules",ADMIN_SECTION_MODULES);
		$t->setVar("sectSettings",ADMIN_SECTION_SETTINGS);
		$t->setVar("sectStat",ADMIN_SECTION_STAT);
		$t->setVar("sectSystem",ADMIN_SECTION_SYSTEM);
		$t->setVar("sectHelp",ADMIN_SECTION_HELP);
		ob_start();
		switch(self::$section["id"])
		{
			case ADMIN_SECTION_CONTENT:
				self::_renderContent();
				break;
			case ADMIN_SECTION_MEDIA:
				self::_renderMedia();
				break;
			case ADMIN_SECTION_MODULES:
				self::_renderModules();
				break;
			case ADMIN_SECTION_SETTINGS:
				self::_renderSettings();
				break;
			case ADMIN_SECTION_STAT:
				echo"Модуль статистики не установлен.";
				break;
			case ADMIN_SECTION_SYSTEM:
				self::_renderSystem();
				break;
			default:
				self::_renderIntro();
		}
		$section=ob_get_contents();
		ob_end_clean();
		$t->setVar("section",$section);
		$t->_render();
	}

	public static function _on4sleep()
	{
		self::sessionSet("section",self::$section);
		self::sessionSet("sectionOpts",self::$sectionOpts);
		self::sessionSet("content",self::$content);
		self::sessionSet("module",self::$module);
	}
}
?>