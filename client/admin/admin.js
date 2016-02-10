/**
* Плагин Admin
*
* @author Bogdan Nazar <me@bogdan-nazar.ru>
*
*/
//...global wrapper starts...
(function(){

var __name_admin = "admin";
var __name_admin_media = __name_admin + "-media";
var __name_admin_modules = __name_admin + "-modules";
var __name_admin_content = __name_admin + "-content";
var __name_lib = "lib";
var __name_msgr = "msgr";
var __name_popup = "popup";
var __name_script = "admin.js";

//ищем core
if ((typeof render != "object") || (!render) || (typeof render.$name == "undefined")) {
	console.log(__name_script + " > Object [core] not found or is incompatible version.");
	return;
}
if (typeof render.pluginGet !="function") {
	console.log(__name_script + " > Object [core] has no method [pluginGet] or is incompatible version.");
	return;
}
if (typeof render.pluginRegister !="function") {
	console.log(__name_script + " > Object [core] has no method [pluginRegister] or is incompatible version.");
	return;
}

//плагин админ [static]
//...admin wrapper starts...
(function(){

var _admin = function() {
	this._callbacks			=	{};
	this._callbacksDef		=	["exit"];
	this._controls			=	[];
	this._initErr			=	false;
	this._inited			=	false;
	this._mode				=	0;
	this.$name				=	__name_admin;
	this._resizeFn			=	null;
	this._resizeEv			=	null;
	this._resizeSp			=	false;
	this._resizeTh			=	63;//title height
	this._resizeTm			=	null;
	this._section			=	"intro";
	this.elControl			=	null;
	this.elMode				=	null;
	this.elSectionId		=	null;
	this.elSectionInner		=	null;
	this.elSectionName		=	null;
	this.plBinds			=	null;
	this.plLib				=	null;
	this.plMsgr				=	null;
	this.plPu				=	null;
	this.plRender			=	null;
	this.plWorker				=	null;
};
_admin.prototype._init = function(last) {
	if (this._inited) return true;
	if (typeof last != "boolean") last = false;
	if (this.waitPlugin(__name_popup, "plPu", last)) return this._inited;
	if (this.waitPlugin(__name_lib, "plLib", last)) return this._inited;
	if (this.waitPlugin(__name_msgr, "plMsgr", last)) return this._inited;
	if (this.waitElement(this.$name + "-section-inner", "elSectionInner", last, "el")) return this._inited;
	if (this.waitElement(this.$name + "-section-control", "elControl", last, "el")) return this._inited;
	if (this.waitElement(this.$name + "-section-id", "elSectionId", last, "el")) return this._inited;
	if (this.waitElement(this.$name + "-section-name", "elSectionName", last, "el")) return this._inited;
	if (this.elSectionName.el.value != "login") {
		if (this.waitElement(this.$name + "-section-mode", "elMode", last, "el")) return this._inited;
	}
	this._section = this.elSectionName.el.value;
	this._mode = parseInt(this.elMode.el.value, 10);
	if (isNaN(this._mode)) this._mode = 1;
	switch (this._section) {
		case "content":
			switch (this._mode) {
				case 0://edit
					if (this.waitPluginInstance(__name_admin_content, "plWorker", last, true)) return this._inited;
					break;
				case 1://list
					if (this.waitPluginInstance(__name_admin_content, "plWorker", last, true)) return this._inited;
					break;
			}
			break;
		case "modules":
			switch (this._mode) {
				case 0://edit
					if (this.waitPluginInstance(__name_admin_modules, "plWorker", last, true)) return this._inited;
					break;
				case 1://list
					if (this.waitPluginInstance(__name_admin_modules, "plWorker", last, true)) return this._inited;
					break;
			}
			break;
	}
	this.controlBtnsRender();
	this._resizeFn = this.resize.bind(this);
	this.plLib.eventAdd(window, "resize", this.onWindowResize.bind(this));
	this.resize();
	this.elSectionInner.el.style.overflow = "auto";
	this._inited = true;
	return true;
};
_admin.prototype.callWorker = function(func, args) {
	if (this.plWorker) {
		if (typeof this.plWorker[func] == "function") {
			if (typeof args == "undefined") args = [0];
			try {
				this.plWorker[func].apply(this.plWorker, args);
			} catch(e) {
				this.console(__name_script + " > " + this.$name + ".callWorker(): Предупреждение, ошибка выполнения callback-функции [" + func + "]. Сообщение интерпретатора [" + e.name + "/" + e.message + "].");
			}
		}
	}
};
_admin.prototype.callbackAdd = function(event, func, cbSup) {
	if (typeof cbSup != "boolean") cbSup = false;
	if (typeof this._callbacks[event] == "undefined") this._callbacks[event] = [];
	this._callbacks[event].push({"func": func, acceptCb: cbSup, confirmed: false, cbSent: false, cbGot: false});
};
_admin.prototype.controlBtnAdd = function(title, bclass, func) {
	var b = document.createElement("DIV");
	b.className = "btn" + (typeof bclass == "string"  ? (" " + bclass) : "");
	if (typeof title == "string") b.title = title;
	if (typeof func == "function") this.plLib.eventAdd(b, "click", func);
	this._controls.push({"title": title, "bclass": bclass, "func": func, btn: b});
	return b;
};
_admin.prototype.controlBtnsRender = function() {
	if (this.elControl && this.elControl.el) {
		for (var c in this._controls) {
			if (!this._controls.hasOwnProperty(c)) continue;
			if (typeof this._controls[c].btn != "object") continue;
			this.elControl.el.appendChild(this._controls[c].btn);
		}
	}
};
_admin.prototype.controlRemove = function() {
	if (this.elControl && this.elControl.el) this.elControl.el.parentNode.removeChild(this.elControl.el);
};
_admin.prototype.getMode = function() {
	return this._mode;
};
_admin.prototype.getSection = function() {
	return this._section;
};
_admin.prototype.login = function() {
	this.plRender.action(this.$name + "-login");
};
_admin.prototype.resize = function() {
	if (this._resizeTm) {
		this._resizeTm = null;
		this._resizeEv = null;
	}
	var ps = this.plLib.pageSize();
	if (this._resizeSp === false) this._resizeSp = ps.ph - this.elSectionInner.el.parentNode.clientHeight + this._resizeTh;
	this.elSectionInner.el.style.height = "" + (ps.wh - this._resizeSp)  + "px";
};
_admin.prototype.section = function(sid, res) {
	if (!this.wrapNotify("exit", this.section.bind(this, sid), res)) return;
	this.elSectionId.el.value = sid;
	this.plRender.action(this.$name + "-section-set");
};
_admin.prototype.onWindowResize = function(e) {
	if (this._resizeTm) window.clearTimeout(this._resizeTm);
	this._resizeTm = window.setTimeout(this._resizeFn, 50);
	this._resizeEv = e;
};
_admin.prototype.wrapNotify = function(name, cb, cbRes) {
	var ev;
	var res = true;
	var breakOnCb = false;
	for (var c in this._callbacksDef) {
		if (!this._callbacksDef.hasOwnProperty(c)) continue;
		ev = this._callbacksDef[c];
		if (typeof ev != "string") continue;
		if (typeof this._callbacks[ev] != "object" || !this._callbacks[ev]) continue;
		for (var c1 in this._callbacks[ev]) {
			if (!this._callbacks[ev].hasOwnProperty(c1)) continue;
			if (typeof this._callbacks[ev][c1] != "object") continue;
			if (typeof this._callbacks[ev][c1]["func"] != "function") continue;
			try {
				if (this._callbacks[ev][c1].acceptCb) {
					if (this._callbacks[ev][c1].cbSent) {
						if (!this._callbacks[ev][c1].cbGot) {
							this._callbacks[ev][c1].cbGot = true;
							if (typeof cbRes != "boolean") continue;
							if (cbRes == false) {
								res = false;
								break;
							}
						}
					} else {
						this._callbacks[ev][c1].cbSent = true;
						this._callbacks[ev][c1].cbGot = false;
						res = this._callbacks[ev][c1].func(((this._callbacks[ev][c1].acceptCb && (typeof cb == "function")) ? cb : false));
						if (res === false) {
							breakOnCb = true;
							break;
						}
					}
				} else res = this._callbacks[ev][c1].func();
				if (res === false) {
					res = false;
					break;
				}
			} catch(e) {
				this.console(__name_script + " > [" + this.$name + "].wrapNotify(\"" + ev + "\"): Предупреждение, ошибка выполнения callback-функции. Сообщение интерпретатора [" + e.name + "/" + e.message + "].");
			}
		}
		if (!res) break;
	}
	if (!breakOnCb) {
		for (var c in this._callbacksDef) {
			if (!this._callbacksDef.hasOwnProperty(c)) continue;
			ev = this._callbacksDef[c];
			if (typeof ev != "string") continue;
			if (typeof this._callbacks[ev] != "object" || !this._callbacks[ev]) continue;
			for (var c1 in this._callbacks[ev]) {
				if (!this._callbacks[ev].hasOwnProperty(c1)) continue;
				if (typeof this._callbacks[ev][c1] != "object") continue;
				if (typeof this._callbacks[ev][c1]["func"] != "function") continue;
				this._callbacks[ev][c1].cbSent = false;
				this._callbacks[ev][c1].cbGot = false;
			}
		}
	}
	return res;
};

//плагин работы с контентом [prototype]
(function(){
var _content = function() {
	this._config			=	{
		_loaded:				false,
		ownctrls:				false
	};
	this._edFiles			=	[];
	this._initErr 			=	false;
	this._inited			=	false;
	this.$name				=	__name_admin_content;
	this.$nameOwner			=	__name_admin;
	this.$nameProto			=	this.$name;
	this._pu				=	-1;
	this.elCreatePu			=	null;
	this.elCreateTitle		=	null;
	this.elCreateAlias		=	null;
	this.elCreateBtnCa		=	null;
	this.elCreateBtnCh		=	null;
	this.elCreateBtnCr		=	null;
	this.elCreateBtnTl		=	null;
	this.elCreateBtns		=	null;
	this.elCreateMsg		=	null;
	this.elEdAlias			=	null;
	this.elEdBtnAliasCh		=	null;
	this.elEdBtnTitTrans	=	null;
	this.elEdCkeBody		=	null;
	this.elEdMetaD			=	null;
	this.elEdMetaK			=	null;
	this.elEdMoreBtns		=	null;
	this.elEdMoreOpts		=	null;
	this.elEdSwAct			=	null;
	this.elEdSwTitle		=	null;
	this.elEdSwLayout		=	null;
	this.elEdTitle			=	null;
	this.elFilter			= 	null;
	this.elHide				= 	null;
	this.elId 				= 	null;
	this.elPager			=	null;
	this.elQuickPu			=	null;
	this.elQuickTitle		=	null;
	this.elQuickAlias		=	null;
	this.elQuickBtnCa		=	null;
	this.elQuickBtnCh		=	null;
	this.elQuickBtnEd		=	null;
	this.elQuickBtnTl		=	null;
	this.elQuickBtns		=	null;
	this.elQuickMsg			=	null;
	this.elQuickMD			=	null;
	this.elQuickMK			=	null;
	this.elQuickSwAct		=	null;
	this.elQuickSwTitle		=	null;
	this.elQuickSwLayout	=	null;
	this.elShowCnt			=	null;
	this.elSortBy			=	null;
	this.elTbl				=	null;
	this.plAdmin			=	null;
	this.plLib				=	null;
	this.plMedia			=	null;
	this.plMsgr				=	null;
	this.plPu				=	null;
	this.plRender			=	null;
};
_content.prototype._configImport = function(config) {
	this._config._loaded = true;
	return true;
};
_content.prototype._init = function(last, config, parent) {
	if (this._inited) return true;
	if (typeof last != "boolean") last = false;
	if (!this.plAdmin) {
		if ((typeof parent == "object") && parent) {
			this.plAdmin = parent;
			this.plLib = parent.getPlLib();
			this.plPu = parent.getPlPu();
			this.plMsgr = parent.getPlMsgr();
			this._section = parent.getSection();
			this._mode = parent.getMode();
		}
	}
	if (this.waitConfig(config, last, "_configImport")) return this._inited;
	if (this.waitElement(this.$nameProto + "-id", "elId", last, "el")) return this._inited;
	switch (this._mode) {
		case 0://edit
			if (this.waitElement(this.$nameProto + "-edit-title", "elEdTitle", last, "el")) return this._inited;
			this.elEdTitle.value = this.elEdTitle.el.value;
			if (this.waitElement(this.$nameProto + "-edit-btn-translit", "elEdBtnTitTrans", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-edit-alias", "elEdAlias", last, "el")) return this._inited;
			this.elEdAlias.value = this.elEdAlias.el.value;
			if (this.waitElement(this.$nameProto + "-edit-btn-check", "elEdBtnAliasCh", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-edit-meta-description", "elEdMetaD", last, "el")) return this._inited;
			this.elEdMetaD.value = this.elEdMetaD.el.value;
			if (this.waitElement(this.$nameProto + "-edit-meta-keywords", "elEdMetaK", last, "el")) return this._inited;
			this.elEdMetaK.value = this.elEdMetaK.el.value;
			if (this.waitElement(this.$nameProto + "-edit-swact", "elEdSwAct", last, "el")) return this._inited;
			this.elEdSwAct.value = this.elEdSwAct.on = (this.elEdSwAct.el.className.indexOf("off") == -1) ? true : false;
			if (this.waitElement(this.$nameProto + "-edit-swtitle", "elEdSwTitle", last, "el")) return this._inited;
			this.elEdSwTitle.value = this.elEdSwTitle.on = (this.elEdSwTitle.el.className.indexOf("off") == -1) ? true : false;
			if (this.waitElement(this.$nameProto + "-edit-swlayout", "elEdSwLayout", last, "el")) return this._inited;
			this.elEdSwLayout.value = this.elEdSwLayout.on = (this.elEdSwLayout.el.className.indexOf("off") == -1) ? true : false;
			if (this.waitElement(this.$nameProto + "-edit-morebtns", "elEdMoreBtns", last, "el")) return this._inited;
			this.elEdMoreBtns.items = {};
			if (this.waitElement(this.$nameProto + "-edit-moreopts", "elEdMoreOpts", last, "el")) return this._inited;
			this.elEdMoreOpts.items = {};
			if (this.waitElement(this.$nameProto + "-edit-cke-body", "elEdCkeBody", last, "el")) return this._inited;
			if (typeof CKEDITOR == "undefined") {
				if (last) {
					this.console(__name_script + " > [" + this.$name + "]._init(): Ошибка инициализации: таймаут ожидания требуемого плагина [CKEDITOR].");
					this._initErr = true;
					this._inited = true;
					return true;
				}
				return false;
			} else {
				if ((typeof this.elEdCkeBody.obj != "object") || !this.elEdCkeBody.obj) {
					this.elEdCkeBody.el.contentEditable = "true";
					CKEDITOR.disableAutoInline = true;
					CKEDITOR.config.autoParagraph = false;
					CKEDITOR.config.allowedContent = true;
					CKEDITOR.config.toolbar = [
						["Source","-","Bold","Italic","Underline","Strike","-","JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock","-","Subscript","Superscript","RemoveFormat"],
						["Image","Link","Unlink","Anchor","NumberedList","BulletedList","-","Outdent","Indent","Blockquote","CreateDiv"],
						["Flash","Table","Cut","Copy","Paste","PasteText","PasteFromWord","-","Undo","Redo"],
						["Font","FontSize","TextColor","BGColor","Format"]
					];
					this.elEdCkeBody.obj = CKEDITOR.inline(this.$nameProto + "-edit-cke-body");
					this.elEdCkeBody.obj.on("dataReady", (function() {
						this.elEdCkeBody.value = this.plLib.base64.encode(this.elEdCkeBody.obj.getData());
						this.elEdCkeBody.inited = true;
						this.elEdCkeBody.obj.innerHTML = this.elEdCkeBody.value;
					}).bind(this));
				}
			}
			if (!this.elEdCkeBody.inited) {
				if (last) {
					this.console(__name_script + " > [" + this.$name + "]._init(): Ошибка инициализации: таймаут ожидания инициализации плагина [CKEDITOR].");
					this._initErr = true;
					this._inited = true;
					return true;
				}
				return false;
			}
			this.plAdmin.controlBtnAdd("К списку страниц", "list", this.editOnClickControl.bind(this, "leave"));
			this.plAdmin.controlBtnAdd("Сохранить изменения", "apply", this.editOnClickControl.bind(this, "apply"));
			this.plAdmin.controlBtnAdd("Сохранить и вернуться к списку", "save", this.editOnClickControl.bind(this, "save"));
			this.plAdmin.controlBtnAdd("Редактировать разметку (ранспоты)", "spots", this.editOnClickControl.bind(this, "spots"));
			//
			var editor = this;
			CKEDITOR.on("dialogDefinition", function(e) {
				if (e.editor.name != (editor.$nameProto + "-edit-cke-body")) return;
				if (e.data.name == "link") {
					editor.plCkeDlgLink = e.data;
					editor.plCkeDlgLink.definition.dialog.on("show", function() {
						if (editor._dialogItem) {
							try {
								editor.plCkeDlgLink.definition.dialog.setValueOf("info", "url", editor._dialogItem.url);
							}catch(e){};
							editor._dialogItem = null;
						}
					});
				}
				if (e.data.name == "image") {
					editor.plCkeDlgImage = e.data;
					editor.plCkeDlgImage.definition.dialog.on("show", function() {
						if (editor._dialogItem) {
							try {
							editor.plCkeDlgImage.definition.dialog.setValueOf("info", "txtUrl", editor._dialogItem.url);}catch(e){};
							try {
							editor.plCkeDlgImage.definition.dialog.setValueOf("info", "txtAlt", editor._dialogItem.title);}catch(e){};
							try {
							editor.plCkeDlgImage.definition.dialog.setValueOf("info", "txtWidth", editor._dialogItem.width);}catch(e){};
							try {
							editor.plCkeDlgImage.definition.dialog.setValueOf("info", "txtHeight", editor._dialogItem.height);}catch(e){};
							editor._dialogItem = null;
						}
					});
					editor.plCkeDlgImage.definition.dialog.on("hide", function() {
					});
				}
			});
			//
			this.plLib.eventAdd(this.elEdBtnTitTrans.el, "click", this.editOnClickTitleTranslit.bind(this));
			this.plLib.eventAdd(this.elEdAlias.el, "keyup", this.editOnChangeAlias.bind(this));
			this.plLib.eventAdd(this.elEdBtnAliasCh.el, "click", this.editOnClickAliasCheck.bind(this));
			this.plLib.eventAdd(this.elEdSwAct.el, "click", this.editOnClickSwitch.bind(this, this.elEdSwAct));
			this.plLib.eventAdd(this.elEdSwTitle.el, "click", this.editOnClickSwitch.bind(this, this.elEdSwTitle));
			this.plLib.eventAdd(this.elEdSwLayout.el, "click", this.editOnClickSwitch.bind(this, this.elEdSwLayout));
			//загрузчики / библиотека
			this.plAdmin.callbackAdd("exit", this.editOnExit.bind(this), true);
			this.editMediaActivate();
			break;
		case 1://list
			if (this.waitElement(this.$nameProto + "-list-filter", "elFilter", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-sortby", "elSortBy", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-showcnt", "elShowCnt", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-hide", "elHide", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-table", "elTbl", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-pager", "elPager", last, "el")) return this._inited;
			//create popup
			if (this.waitElement(this.$nameProto + "-list-create", "elCreatePu", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-create-title", "elCreateTitle", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-create-alias", "elCreateAlias", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-create-btn-translit", "elCreateBtnTl", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-create-btn-check", "elCreateBtnCh", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-create-msg", "elCreateMsg", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-create-btns", "elCreateBtns", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-create-btn-cancel", "elCreateBtnCa", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-create-btn-create", "elCreateBtnCr", last, "el")) return this._inited;
			//quick edit popup
			if (this.waitElement(this.$nameProto + "-list-quick", "elQuickPu", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-quick-title", "elQuickTitle", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-quick-alias", "elQuickAlias", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-quick-btn-translit", "elQuickBtnTl", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-quick-btn-check", "elQuickBtnCh", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-quick-meta-description", "elQuickMD", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-quick-meta-keywords", "elQuickMK", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-quick-swact", "elQuickSwAct", last, "el")) return this._inited;
			this.elQuickSwAct.on = (this.elQuickSwAct.el.className.indexOf("off") == -1) ? true : false;
			if (this.waitElement(this.$nameProto + "-list-quick-swtitle", "elQuickSwTitle", last, "el")) return this._inited;
			this.elQuickSwTitle.on = (this.elQuickSwTitle.el.className.indexOf("off") == -1) ? true : false;
			if (this.waitElement(this.$nameProto + "-list-quick-swlayout", "elQuickSwLayout", last, "el")) return this._inited;
			this.elQuickSwLayout.on = (this.elQuickSwLayout.el.className.indexOf("off") == -1) ? true : false;
			if (this.waitElement(this.$nameProto + "-list-quick-msg", "elQuickMsg", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-quick-btns", "elQuickBtns", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-quick-btn-cancel", "elQuickBtnCa", last, "el")) return this._inited;
			if (this.waitElement(this.$nameProto + "-list-quick-btn-edit", "elQuickBtnEd", last, "el")) return this._inited;
			//
			this.plLib.eventAdd(this.elSortBy.el, "change", this.listOnFilter.bind(this, this.elSortBy.el));
			this.plLib.eventAdd(this.elShowCnt.el, "change", this.listOnFilter.bind(this, this.elShowCnt.el));
			this.plLib.eventAdd(this.elHide.el, "change", this.listOnFilter.bind(this, this.elHide.el));
			this.plLib.eventAdd(this.elTbl.el, "click", this.listOnClick.bind(this));
			this.plLib.eventAdd(this.elPager.el.parentNode, "click", this.listOnClickPager.bind(this));
			//create popup
			this.plLib.eventAdd(this.elCreateBtnTl.el, "click", this.listOnClickCreateTranslit.bind(this));
			this.plLib.eventAdd(this.elCreateBtnCh.el, "click", this.listOnClickCreateCheck.bind(this));
			this.elCreateBtnCh.title = this.elCreateBtnCh.el.title;
			this.plLib.eventAdd(this.elCreateAlias.el, "keyup", this.listOnChangeCreateAlias.bind(this));
			this.plLib.eventAdd(this.elCreateAlias.el, "change", this.listOnChangeCreateAlias.bind(this));
			this.plLib.eventAdd(this.elCreateBtnCa.el, "click", this.listOnClickCreateCancel.bind(this));
			this.plLib.eventAdd(this.elCreateBtnCr.el, "click", this.listOnClickCreate.bind(this));
			this.elCreateAlias.state = 0;
			//quick edit popup
			this.plLib.eventAdd(this.elQuickBtnTl.el, "click", this.listOnClickQuickTranslit.bind(this));
			this.plLib.eventAdd(this.elQuickBtnCh.el, "click", this.listOnClickQuickCheck.bind(this));
			this.elQuickBtnCh.title = this.elQuickBtnCh.el.title;
			this.plLib.eventAdd(this.elQuickAlias.el, "keyup", this.listOnChangeQuickAlias.bind(this));
			this.plLib.eventAdd(this.elQuickAlias.el, "change", this.listOnChangeQuickAlias.bind(this));
			this.plLib.eventAdd(this.elQuickSwAct.el, "click", this.listOnClickSwitch.bind(this, this.elQuickSwAct));
			this.plLib.eventAdd(this.elQuickSwTitle.el, "click", this.listOnClickSwitch.bind(this, this.elQuickSwTitle));
			this.plLib.eventAdd(this.elQuickSwLayout.el, "click", this.listOnClickSwitch.bind(this, this.elQuickSwLayout));
			this.plLib.eventAdd(this.elQuickBtnCa.el, "click", this.listOnClickQuickCancel.bind(this));
			this.plLib.eventAdd(this.elQuickBtnEd.el, "click", this.listOnClickQuickEdit.bind(this));
			this.elQuickPu.id = 0;
			//
			this._pu = this.plPu.add({windowed: false, showcloser: false});
			this.elCreatePu.el.parentNode.parentNode.removeChild(this.elCreatePu.el.parentNode);
			this.elCreatePu.el = this.elCreatePu.el.parentNode;
			this.elCreatePu.el.className = "admin";
			this.elCreatePu.el.style.display = "block";
			this.elQuickPu.el.parentNode.parentNode.removeChild(this.elQuickPu.el.parentNode);
			this.elQuickPu.el = this.elQuickPu.el.parentNode;
			this.elQuickPu.el.className = "admin";
			this.elQuickPu.el.style.display = "block";
			this.plAdmin.controlBtnAdd("Создать страницу", "add", this.listOnClickControlNew.bind(this));
			break;
	}
	this._inited = true;
	return true;
};
_content.prototype._actionSilentAliasCheck = function(alias, cid, src) {
	if (typeof cid == "undefined") cid = "0";
	else {
		if (typeof cid != "number") {
			cid = parseInt(cid, 10);
			if (isNaN(cid)) return;
		}
		cid = "" + cid;
	}
	if ((typeof src != "string") || !src) src = "list-create";
	var r = this.plRender.silentReqBuild(this);
	r.action = this.$nameProto + "-alias-check";
	r.cbFunc = this._onSilentDone;
	r.cbBound = false;
	r.owner = this;
	r.owner_store.src = src;
	r.dataPOST[this.$nameProto + "-alias"] = alias;
	r.dataPOST[this.$nameProto + "-cid"] = cid;
	switch (src) {
		case "list-create":
			r.msgDisplay = false;
			this.elCreateBtnCh.el.className = "field-btn render-loader";
			this.elCreateBtns.el.style.visibility = "hidden";
			break;
		case "list-quick":
			r.msgDisplay = false;
			this.elQuickBtnCh.el.className = "field-btn render-loader";
			this.elQuickBtns.el.style.visibility = "hidden";
			break;
		case "edit":
			r.msgDisplay = true;
			this.elEdBtnAliasCh.el.className = "field-btn render-loader";
			this.plRender.waiterShow();
			break;
	}
	this.plRender.silent(r);
};
_content.prototype._editActionModeList = function() {
	this.plRender.action(this.$nameProto + "-mode-list","");
};
_content.prototype._editActionSilentApply = function() {
	var r = this.plRender.silentReqBuild(this);
	r.action = this.$nameProto + "-edit-apply";
	r.cbFunc = this._onSilentDone;
	r.cbBound = false;
	r.owner = this;
	r.dataPOST[this.$nameProto + "-id"] = this.elId.el.value;
	r.dataPOST[this.$nameProto + "-title"] = this.elEdTitle.el.value;
	r.dataPOST[this.$nameProto + "-alias"] = this.elEdAlias.el.value;
	r.dataPOST[this.$nameProto + "-meta-description"] = this.elEdMetaD.el.value;
	r.dataPOST[this.$nameProto + "-meta-keywords"] = this.elEdMetaK.el.value;
	r.dataPOST[this.$nameProto + "-act"] = (this.elEdSwAct.on ? "1" : "0");
	r.dataPOST[this.$nameProto + "-showtitle"] = (this.elEdSwTitle.on ? "1" : "0");
	r.dataPOST[this.$nameProto + "-nolayout"] = (this.elEdSwLayout.on ? "0" : "1");
	r.dataPOST[this.$nameProto + "-body"] = this.elEdCkeBody.obj.getData();
	r.msgDisplay = true;
	this.plRender.silent(r);
	this.plRender.waiterShow();
};
_content.prototype._editActionSilentSave = function() {
	var r = this.plRender.silentReqBuild(this);
	r.action = this.$nameProto + "-edit-save";
	r.cbFunc = this._onSilentDone;
	r.cbBound = false;
	r.owner = this;
	r.dataPOST[this.$nameProto + "-id"] = this.elId.value;
	r.dataPOST[this.$nameProto + "-title"] = this.elEdTitle.el.value;
	r.dataPOST[this.$nameProto + "-alias"] = this.elEdAlias.el.value;
	r.dataPOST[this.$nameProto + "-meta-description"] = this.elEdMetaD.el.value;
	r.dataPOST[this.$nameProto + "-meta-keywords"] = this.elEdMetaK.el.value;
	r.dataPOST[this.$nameProto + "-act"] = (this.elEdSwAct.on ? "1" : "0");
	r.dataPOST[this.$nameProto + "-showtitle"] = (this.elEdSwTitle.on ? "1" : "0");
	r.dataPOST[this.$nameProto + "-nolayout"] = (this.elEdSwLayout.on ? "0" : "1");
	r.dataPOST[this.$nameProto + "-body"] = this.elEdCkeBody.obj.getData();
	r.msgDisplay = true;
	this.plRender.silent(r);
	this.plRender.waiterShow();
};
_content.prototype._listActionFilter = function(el) {
	this.elFilter.el.value = el.id.replace((this.$nameProto + "-list-"), "");
	this.plRender.action(this.$nameProto + "-list-filter");
	this.plRender.waiterShow();
};
_content.prototype._listActionModeEdit = function(id) {
	this.elId.el.value = id;
	this.plRender.action(this.$nameProto + "-mode-edit");
};
_content.prototype._listActionPager = function(num) {
	this.elPager.el.value = num;
	this.plRender.action(this.$nameProto + "-list-pager");
	this.plRender.waiterShow();
};
_content.prototype._listActionSilentCreate = function(pu) {
	if (typeof pu != "number") pu = -1;
	var r = this.plRender.silentReqBuild(this);
	r.action = this.$nameProto + "-list-create";
	r.cbFunc = this._onSilentDone;
	r.cbBound = false;
	r.owner = this;
	r.dataPOST[this.$nameProto + "-title"] = this.elCreateTitle.el.value;
	r.dataPOST[this.$nameProto + "-alias"] = this.elCreateAlias.el.value;
	r.owner_store["pu"] = pu;
	r.msgDisplay = true;
	this.plRender.silent(r);
	if (pu != -1) this.plPu.hide(pu);
	this.plRender.waiterShow();
};
_content.prototype._listActionSilentQuick = function(pu) {
	if (typeof pu != "number") pu = -1;
	var r = this.plRender.silentReqBuild(this);
	r.action = this.$nameProto + "-list-quick";
	r.cbFunc = this._onSilentDone;
	r.cbBound = false;
	r.owner = this;
	r.dataPOST[this.$nameProto + "-id"] = this.elQuickPu.id;
	r.dataPOST[this.$nameProto + "-title"] = this.elQuickTitle.el.value;
	r.dataPOST[this.$nameProto + "-alias"] = this.elQuickAlias.el.value;
	r.dataPOST[this.$nameProto + "-meta-description"] = this.elQuickMD.el.value;
	r.dataPOST[this.$nameProto + "-meta-keywords"] = this.elQuickMK.el.value;
	r.dataPOST[this.$nameProto + "-act"] = (this.elQuickSwAct.on ? "1" : "0");
	r.dataPOST[this.$nameProto + "-showtitle"] = (this.elQuickSwTitle.on ? "1" : "0");
	r.dataPOST[this.$nameProto + "-nolayout"] = (this.elQuickSwLayout.on ? "0" : "1");
	r.owner_store.pu = pu;
	r.owner_store.suc = {};
	r.owner_store.suc.act = this.elQuickSwAct.on;
	r.owner_store.suc.alias = this.elQuickAlias.el.value;
	r.owner_store.suc.layout = this.elQuickSwLayout.on;
	r.owner_store.suc.showTitle = this.elQuickSwTitle.on;
	r.owner_store.suc.title = this.elQuickTitle.el.value;
	r.msgDisplay = false;
	this.elQuickBtns.el.style.visibility = "hidden";
	this.plRender.silent(r);
};
_content.prototype._listActionSilentQuickLoad = function(id) {
	var r = this.plRender.silentReqBuild(this);
	r.action = this.$nameProto + "-list-quick-load";
	r.cbFunc = this._onSilentDone;
	r.cbBound = false;
	r.owner = this;
	r.dataPOST[this.$nameProto + "-id"] = id;
	r.msgDisplay = false;
	this.plRender.silent(r);
};
_content.prototype._listActionSilentToggle = function(id, el, flag) {
	var r = this.plRender.silentReqBuild(this);
	r.action = this.$nameProto + "-list-toggle";
	r.cbFunc = this._onSilentDone;
	r.cbBound = false;
	r.owner = this;
	r.dataPOST[this.$nameProto + "-id"] = id;
	r.dataPOST[this.$nameProto + "-flag"] = flag;
	r.owner_store["elem"] = el;
	r.msgDisplay = true;
	this.plRender.silent(r);
	this.plRender.waiterShow();
};
_content.prototype._onSilentDone = function(r) {
	this.plRender.waiterHide();
	switch (r.action) {
		case (this.$nameProto + "-alias-check"):
			switch (r.owner_store.src) {
				case "list-create":
					this.elCreateBtns.el.style.visibility = "";
					this.elCreateMsg.el.innerHTML = "&nbsp;";
					if (r.response.res) {
						this.elCreateBtnCh.el.className = "field-btn ok";
						this.elCreateBtnCh.el.title = "Введено верно";
					} else {
						this.elCreateBtnCh.el.className = "field-btn err";
						this.elCreateBtnCh.el.title = "Введено неверно";
						if (r.response.msg) {
							this.elCreateMsg.el.innerHTML = r.response.msg;
						}
					}
					break;
				case "list-quick":
					this.elQuickBtns.el.style.visibility = "";
					this.elQuickMsg.el.innerHTML = "&nbsp;";
					if (r.response.res) {
						this.elQuickBtnCh.el.className = "field-btn ok";
						this.elQuickBtnCh.el.title = "Введено верно";
					} else {
						this.elQuickBtnCh.el.className = "field-btn err";
						this.elQuickBtnCh.el.title = "Введено неверно";
						if (r.response.msg) {
							this.elQuickMsg.el.innerHTML = r.response.msg;
						}
					}
					break;
				case "edit":
					if (r.response.res) {
						this.elEdBtnAliasCh.el.className = "field-btn ok";
						this.elEdBtnAliasCh.el.title = "Введено верно";
					} else {
						this.elEdBtnAliasCh.el.className = "field-btn err";
						this.elEdBtnAliasCh.el.title = "Введено неверно";
					}
					break;
			}
			break;
		case (this.$nameProto + "-list-create"):
			if (r.response.res) {
				this._listActionModeEdit(r.response.id);
				this.plRender.waiterShow();
			}
			break;
		case (this.$nameProto + "-list-quick"):
			this.elQuickBtns.el.style.visibility = "";
			if (r.response.res) {
				this.elQuickMsg.el.innerHTML = "Сохранено.";
				this.elQuickMsg.el.className = "silent-err-msg";
				this.elQuickPu.suc.saved = true;
				this.elQuickPu.suc.alias = r.owner_store.suc.alias;
				this.elQuickPu.suc.title = r.owner_store.suc.title;
				this.elQuickPu.suc.act = r.owner_store.suc.act;
				this.elQuickPu.suc.showTitle = r.owner_store.suc.showTitle;
				this.elQuickPu.suc.layout = r.owner_store.suc.layout;
				this.elQuickPu.suc.updated = r.response.updated;
			} else {
				this.elQuickMsg.el.className = "silent-err-msg err";
				this.elQuickMsg.el.innerHTML = r.response.msg;
			}
			if($) {
				$(this.elQuickMsg.el)
				.animate({opacity: 0}, 300)
				.animate({opacity: 1}, 100)
				.animate({opacity: 0}, 300)
				.animate({opacity: 1}, 100)
				.animate({opacity: 0}, 300)
				.animate({opacity: 1}, 100);
			}
			if (r.response.res) {
				var o = this.elQuickMsg;
				window.setTimeout(function(){
					if($)$(o.el).animate({opacity: 0}, 500, function(){
							this.innerHTML = "&nbsp;";
							this.style.opacity = 1;
						});
					else o.el.innerHTML = "&nbsp;";
				}, 4000);
			}
			break;
		case (this.$nameProto + "-list-quick-load"):
			this.elQuickBtns.el.style.visibility = "";
			if (r.response.res) {
				this.elQuickMsg.el.className = "silent-err-msg";
				this.elQuickMsg.el.innerHTML = "&nbsp;";
				this.elQuickTitle.el.value = r.response.title;
				this.elQuickAlias.el.value = r.response.alias;
				this.elQuickMD.el.value = r.response.metaDescription;
				this.elQuickMK.el.value = r.response.metaKeywords;
				this.elQuickSwAct.el.className = "item switch" + (r.response.act ? "" : " off");
				this.elQuickSwAct.el.innerHTML = (r.response.act ? "Да" : "Нет");
				this.elQuickSwAct.on = r.response.act ? true : false;
				this.elQuickSwTitle.el.className = "item switch" + (r.response.showTitle ? "" : " off");
				this.elQuickSwTitle.el.innerHTML = (r.response.showTitle ? "Да" : "Нет");
				this.elQuickSwTitle.on = r.response.showTitle ? true : false;
				this.elQuickSwLayout.el.className = "item switch" + (r.response.noLayout ? " off" : "");
				this.elQuickSwLayout.el.innerHTML = (r.response.noLayout ? "Нет" : "Да");
				this.elQuickSwLayout.on = r.response.noLayout ? false : true;
			} else {
				this.elQuickMsg.el.className = "silent-err-msg err";
				this.elQuickMsg.el.innerHTML = r.response.msg;
				this.elQuickBtnEd.el.style.display = "none";
				if($) {
					$(this.elQuickMsg.el)
					.animate({opacity: 0}, 300)
					.animate({opacity: 1}, 100)
					.animate({opacity: 0}, 300)
					.animate({opacity: 1}, 100)
					.animate({opacity: 0}, 300)
					.animate({opacity: 1}, 100);
				}
			}
			break;
		case (this.$nameProto + "-list-toggle"):
			if (!r.response.res) break;
			if (this.elHide.el.checked) {
				if (typeof r.owner_store["elem"] != "undefined")
					r.owner_store["elem"].parentNode.parentNode.parentNode.removeChild(r.owner_store["elem"].parentNode.parentNode);
				break;
			}
			if (typeof r.owner_store["elem"] != "undefined") {
				var cls = r.owner_store["elem"].className.split(" ");
				r.owner_store["elem"].innerHTML = r.response.txt;
				r.owner_store["elem"].className = cls[0] + (r.response.cl ? " " : "") + r.response.cl;
			}
			break;
		case (this.$nameProto + "-edit-apply"):
			if (r.response.res) {
				this.elEdSwAct.value = this.elEdSwAct.on;
				this.elEdSwLayout.value = this.elEdSwLayout.on;
				this.elEdSwTitle.value = this.elEdSwTitle.on;
				this.elEdAlias.value = this.elEdAlias.el.value;
				this.elEdTitle.value = this.elEdTitle.el.value;
				this.elEdMetaD.value = this.elEdMetaD.el.value;
				this.elEdMetaK.value = this.elEdMetaK.el.value;
				this.elEdCkeBody.value = this.plLib.base64.encode(this.elEdCkeBody.obj.getData());
			}
			break;
		case (this.$nameProto + "-edit-save"):
			if (r.response.res)	{
				this.plRender.waiterShow();
				this.plRender.action(this.$nameProto + "-mode-list","");
			}
			break;
	}
};
_content.prototype.editChangedCheck = function() {
	var ch1 = (this.elEdTitle.value == this.elEdTitle.el.value);
	var ch2 = (this.elEdAlias.value == this.elEdAlias.el.value);
	var ch3 = (this.elEdMetaD.value == this.elEdMetaD.el.value);
	var ch4 = (this.elEdMetaK.value == this.elEdMetaK.el.value);
	var ch5 = (this.elEdSwAct.value == this.elEdSwAct.on);
	var ch6 = (this.elEdSwTitle.value == this.elEdSwTitle.on);
	var ch7 = (this.elEdSwLayout.value == this.elEdSwLayout.on);
	var d = this.plLib.base64.encode(this.elEdCkeBody.obj.getData());
	var ch8 = (this.elEdCkeBody.value == d);
	return !(ch1 && ch2 && ch3 && ch4 && ch5 && ch6 && ch7 && ch8);
};
_content.prototype.editFieldsCheck = function() {
	if(!this._fields.title.obj.value) {
		alert("Введите заголовок страницы!");
		this._fields.title.obj.focus();
		return false;
	}
	if ((this.elId.el.value === "0") && this._fields.title.obj.value == "Новая страница") {
		if (!confirm("Использовать заголовок \"Новая страница\"?")) return false;
	}
	if(!this._fields.alias.obj.value) {
		alert("Введите алиас страницы!");
		this._fields.alias.obj.focus();
		return false;
	}
	return true;
};
_content.prototype.editMediaActivate = function() {
	if (!this.plMedia) {
		this.plMedia = this.plRender.pluginInstanceAllocate(__name_admin_media);
		if (!this.plMedia) return;
		var cid = parseInt(this.elId.el.value, 10);
		if (isNaN(cid) || !cid) return;
		this.elEdMoreBtns.items.fupload = document.createElement("DIV");
		this.elEdMoreBtns.items.fupload.className = "fupload render-loader";
		this.elEdMoreBtns.items.fupload.innerHTML = "Инициализация...";
		this.elEdMoreBtns.el.appendChild(this.elEdMoreBtns.items.fupload);
		this.plMedia._init(false, {
			cbOnCancel: this.editOnMediaEvent.bind(this, "cancel"),
			cbOnCreate: this.editOnMediaEvent.bind(this, "create"),
			cbOnDelete: this.editOnMediaEvent.bind(this, "delete"),
			cbOnEdit: this.editOnMediaEvent.bind(this, "edit"),
			cbOnEmbed: this.editOnMediaEvent.bind(this, "embed"),
			cbOnLink: this.editOnMediaEvent.bind(this, "link"),
			cbOnSelect: this.editOnMediaEvent.bind(this, "select"),
			cbOnInit: this.editOnMediaEvent.bind(this, "init"),
			entity: cid,
			fetchShared: true,
			folder: "" + cid,
			module: "content",
			tab: "list",
			titleList: "Список",
			titleUse: "Вставить",
			typeSet: "any",
			types: ["gif","jpeg","jpg","png","pdf","doc","docx","xls","xlsx","mp3","avi"]
		}, this);
		return;
	}
};
_content.prototype.editOnChangeAlias = function() {
	this.elEdBtnAliasCh.el.className = "field-btn check";
	this.elEdBtnAliasCh.el.title = this.elEdBtnAliasCh.title;
};
_content.prototype.editOnClickAliasCheck = function() {
	if (this.elEdBtnAliasCh.el.className.indexOf("check") == -1) return;
	if (!this.elEdAlias.el.value) {
		return;
	}
	this._actionSilentAliasCheck(this.elEdAlias.el.value, (0 + this.elId.el.value), "edit");
};
_content.prototype.editOnClickApply = function() {
	if (!this.editChangedCheck()) {
		this.plMsgr.dlgAlert("Вы не сделали никаких изменений!","wrn");
		return;
	}
	this._editActionSilentApply();
};
_content.prototype.editOnClickLeave = function(res) {
	if (typeof res != "boolean") {
		if (this.editChangedCheck()) {
			this.plMsgr.dlgConfirm("Некоторые поля редактора были изменены. Выйти без сохранения?", this.editOnClickLeave.bind(this), "Предупреждение", "300px");
			return;
		}
		res = true;
	}
	if (res) this._editActionModeList();
};
_content.prototype.editOnClickMediaShow = function() {
	this.plMedia.show();
};
_content.prototype.editOnClickSave = function() {
	if (!this.editChangedCheck()) {
		this.plMsgr.dlgAlert("Вы не сделали никаких изменений!","wrn");
		return;
	}
	this._editActionSilentSave();
};
_content.prototype.editOnClickControl = function(btn) {
	if (typeof btn != "string") return;
	switch (btn) {
		case "apply":
			this.editOnClickApply();
			break;
		case "leave":
			this.editOnClickLeave();
			break;
		case "save":
			this.editOnClickSave();
			break;
		case "spots":
			this.editOnClickSpots();
			break;
	}
};
_content.prototype.editOnClickSpots = function() {
	alert("В разработке...");
};
_content.prototype.editOnClickSwitch = function(sw) {
	sw.on = !sw.on;
	if (sw.on) {
		sw.el.className = "item switch";
		sw.el.innerHTML = "Да";
	} else {
		sw.el.className = "item switch off";
		sw.el.innerHTML = "Нет";
	}
};
_content.prototype.editOnClickTitleTranslit = function() {
	if (this.elEdBtnAliasCh.el.className.indexOf("render-loader") != -1) return;
	if (!this.elEdTitle.el.value) return;
	var v = this.elEdAlias.el.value;
	this.elEdAlias.el.value = (this.plLib.cyr2lat(this.elEdTitle.el.value)).toLowerCase();
	if (v != this.elEdAlias.el.value) this.editOnChangeAlias();
};
_content.prototype.editOnExit = function(cb) {
	if (this.editChangedCheck()) {
		if (typeof cb == "function") {
			this.plMsgr.dlgConfirm("Некоторые поля редактора были изменены. Выйти без сохранения?", cb, "Предупреждение", "300px");
			return false;
		} else {
			if (!confirm("Некоторые поля редактора были изменены. Выйти без сохранения?")) return false;
		}
	}
	return true;
};
_content.prototype.editOnMediaEvent = function(ev, data) {
	switch (ev) {
		case "cancel":
			break;
		case "create":
			break;
		case "delete":
			break;
		case "edit":
			break;
		case "embed":
			if (typeof data != "object" || !data) return;
			this._dialogItem = data;
			if (data.content_type.indexOf("image/") != -1) {
				this.elEdCkeBody.obj.execCommand("image");
			} else {
				this.elEdCkeBody.obj.execCommand("link");
			}
			break;
		case "init":
			this.elEdMoreBtns.items.fupload.className = "fupload ready";
			this.elEdMoreBtns.items.fupload.innerHTML = "Вставить/Загрузить файл";
			this.plLib.eventAdd(this.elEdMoreBtns.items.fupload, "click", this.editOnClickMediaShow.bind(this));
			break;
		case "link":
			this._dialogItem = data;
			this.elEdCkeBody.obj.execCommand("link");
			break;
		case "select":
			break;
	}
	return true;
};
_content.prototype.listOnChangeCreateAlias = function() {
	this.elCreateBtnCh.el.className = "field-btn check";
	this.elCreateBtnCh.el.title = this.elCreateBtnCh.title;
	this.elCreateMsg.el.innerHTML = "&nbsp;"
};
_content.prototype.listOnChangeQuickAlias = function() {
	this.elQuickBtnCh.el.className = "field-btn check";
	this.elQuickBtnCh.el.title = this.elQuickBtnCh.title;
	this.elQuickMsg.el.innerHTML = "&nbsp;"
};
_content.prototype.listOnClick = function(ev) {
	ev = this.plLib.eventFix(ev);
	var e = ev.target;
	if (e.nodeName == "SPAN") {
		if (typeof e.attributes["value"] == "undefined") return;
		var vals = e.attributes["value"].value.split(":");
		if (vals.length != 2) return;
		var id = parseInt(vals[1], 10);
		switch(vals[0]) {
			case "edit":
 				this._listActionModeEdit(id);
 				break;
			case "switch":
			case "title":
			case "layout":
				this._listActionSilentToggle(id, e, vals[0]);
				break;
			case "quick":
				this.listQuickShow(id);
				break;
			case "bind":
				//this.listCallBind();
				break;
		}
	}
};
_content.prototype.listOnClickControlNew = function() {
	if (this._pu == -1) {
		this.plMsgr.dlgAlert("Невозможно создать модальное окно!", "err");
		return;
	}
	this.plPu.content(this._pu, this.elCreatePu.el, this.elCreateBtnCa.el);
	this.plPu.show(this._pu);
};
_content.prototype.listOnClickCreate = function(confirmed, res) {
	if (typeof confirmed != "boolean") confirmed = false;
	if (typeof res != "boolean") res = false;
	if (!confirmed) {
		if ((this.elCreateTitle.el.value == "") && (this.elCreateAlias.el.value == "")) {
			this.plMsgr.dlgConfirm("Продолжить без заполнения полей?", this.listOnClickCreate.bind(this, true), "Предупреждение", "300px");
			return;
		}
	} else {
		if (!res) return;
	}
	this._listActionSilentCreate(this._pu);
};
_content.prototype.listOnClickCreateCancel = function() {
	this.plPu.hide(this._pu);
};
_content.prototype.listOnClickCreateCheck = function() {
	if (this.elCreateBtnCh.el.className.indexOf("check") == -1) return;
	if (!this.elCreateAlias.el.value) {
		return;
	}
	this._actionSilentAliasCheck(this.elCreateAlias.el.value, 0, "list-create");
};
_content.prototype.listOnClickCreateTranslit = function() {
	if (this.elCreateBtnCh.el.className.indexOf("render-loader") != -1) return;
	if (!this.elCreateTitle.el.value) return;
	var v = this.elCreateAlias.el.value;
	this.elCreateAlias.el.value = (this.plLib.cyr2lat(this.elCreateTitle.el.value)).toLowerCase();
	if (v != this.elCreateAlias.el.value) this.listOnChangeCreateAlias();
};
_content.prototype.listOnClickPager = function(e) {
	var ev = this.plLib.eventFix(e);
	var el = ev.target;
	if (el.nodeName == "SPAN") {
		if (el.className.indexOf("pact") != -1) return;
		var num = parseInt(el.innerHTML, 10);
		if (isNaN(num)) return;
		this._listActionPager(--num);
	}
};
_content.prototype.listOnClickQuickCancel = function() {
	this.plPu.hide(this._pu);
	if (this.elQuickPu.suc.saved) {
		var e = document.getElementById(this.$nameProto + "-list-title" + this.elQuickPu.id);
		if (e) e.innerHTML = this.elQuickPu.suc.title;
		var e = document.getElementById(this.$nameProto + "-list-alias" + this.elQuickPu.id);
		if (e) e.innerHTML = this.elQuickPu.suc.alias;
		var e = document.getElementById(this.$nameProto + "-list-act" + this.elQuickPu.id);
		if (e) {
			e.className = "admin-tune" + (this.elQuickPu.suc.act ? "" : " off");
			e.innerHTML = this.elQuickPu.suc.act ? "Да" : "Нет";
		}
		var e = document.getElementById(this.$nameProto + "-list-showtitle" + this.elQuickPu.id);
		if (e) {
			e.className = "admin-tune" + (this.elQuickPu.suc.showTitle ? "" : " off");
			e.innerHTML = this.elQuickPu.suc.showTitle ? "Да" : "Нет";
		}
		var e = document.getElementById(this.$nameProto + "-list-layout" + this.elQuickPu.id);
		if (e) {
			e.className = "admin-tune" + (this.elQuickPu.suc.layout ? "" : " off");
			e.innerHTML = this.elQuickPu.suc.layout ? "Да" : "Нет";
		}
		var e = document.getElementById(this.$nameProto + "-list-updated" + this.elQuickPu.id);
		if (e) e.innerHTML = this.elQuickPu.suc.updated;
	}
};
_content.prototype.listOnClickQuickCheck = function() {
	if (this.elQuickBtnCh.el.className.indexOf("check") == -1) return;
	if (!this.elQuickAlias.el.value) {
		return;
	}
	this._actionSilentAliasCheck(this.elQuickAlias.el.value, this.elQuickPu.id, "list-quick");
};
_content.prototype.listOnClickQuickEdit = function() {
	this.elQuickMsg.el.innerHTML = "&nbsp;";
	this.elQuickMsg.el.className = "silent-err-msg render-loader";
	this._listActionSilentQuick(this._pu);
};
_content.prototype.listOnClickSwitch = function(sw) {
	sw.on = !sw.on;
	if (sw.on) {
		sw.el.className = "item switch";
		sw.el.innerHTML = "Да";
	} else {
		sw.el.className = "item switch off";
		sw.el.innerHTML = "Нет";
	}
};
_content.prototype.listOnClickQuickTranslit = function() {
	if (this.elQuickBtnCh.el.className.indexOf("render-loader") != -1) return;
	if (!this.elQuickTitle.el.value) return;
	var v = this.elQuickAlias.el.value;
	this.elQuickAlias.el.value = (this.plLib.cyr2lat(this.elQuickTitle.el.value)).toLowerCase();
	if (v != this.elQuickAlias.el.value) this.listOnChangeCreateAlias();
};
_content.prototype.listOnFilter = function(el) {
	this._listActionFilter(el);
};
_content.prototype.listQuickShow = function(id) {
	if (this._pu == -1) {
		this.plMsgr.dlgAlert("Невозможно создать модальное окно!", "err");
		return;
	}
	this.elQuickPu.id = id;
	if (typeof this.elQuickPu.suc == "undefined") this.elQuickPu.suc = {};
	this.elQuickPu.suc.saved = false;
	this.elQuickPu.suc.alias = "";
	this.elQuickPu.suc.title = "";
	this.elQuickPu.suc.act = 0;
	this.elQuickPu.suc.showTitle = 1;
	this.elQuickPu.suc.layout = 1;
	this.elQuickPu.suc.updated = "";
	this.elQuickTitle.el.value = "";
	this.elQuickAlias.el.value = "";
	this.elQuickMD.el.value = "";
	this.elQuickMK.el.value = "";
	this.elQuickSwAct.el.className = "item switch";
	this.elQuickSwAct.el.innerHTML = "Да";
	this.elQuickSwTitle.el.className = "item switch";
	this.elQuickSwTitle.el.innerHTML = "Да";
	this.elQuickSwLayout.el.className = "item switch";
	this.elQuickSwLayout.el.innerHTML = "Да";
	this.elQuickMsg.el.className = "silent-err-msg render-loader";
	this.elQuickMsg.el.innerHTML = "Загрузка...";
	this.elQuickBtnCa.el.parentNode.style.visibility = "hidden";
	this.elQuickBtnEd.el.style.display = "";
	this.plPu.content(this._pu, this.elQuickPu.el, this.elQuickBtnCa.el);
	this.plPu.show(this._pu);
	this._listActionSilentQuickLoad(id);
};
render.pluginRegisterProto(_content, __name_admin_content);
})();

//плагин листинга модулей [prototype]
(function(){
var _modules = function() {
	this._chks		=	[];
	this._config	=	{
		_loaded:		false
	};
	this._controls	=	{};
	this._initErr	=	false;
	this._inited	=	false;
	this._mode		=	0;
	this.$name		=	__name_admin_modules;
	this.$nameOwner	=	__name_admin;//имя PHP модуля(!)
	this.$nameProto	=	__name_admin_modules;
	this._section	=	"";
	this.elBtnAdd	=	null;
	this.elBtnEdit	=	null;
	this.elBtnTurn	=	null;
	this.elChks		=	null;
	this.plAdmin	=	null;
	this.plLib		=	null;
	this.plRender	=	null;
};
_modules.prototype._configImport = function(config) {
	this._config._loaded = true;
	return true;
};
_modules.prototype._init = function(last, config, parent) {
	if (this._inited) return true;
	if (typeof last != "boolean") last = false;
	if (!this.plAdmin) {
		if ((typeof parent == "object") && parent) {
			this.plAdmin = parent;
			this.plLib = parent.getPlLib();
		}
	}
	if (this.waitConfig(config, last, "_configImport")) return this._inited;
	this._inited = true;
	this._section = this.plAdmin.getSection();
	this._mode = this.plAdmin.getMode();
	switch (this._mode) {
		case 0://edit
			this.elBtnList = {};
			this.elBtnList.el = this.plAdmin.controlBtnAdd("К списку модулей", "exit");
			this.elBtnList.func = this.onClickExit.bind(this);
			this.plLib.eventAdd(this.elBtnList.el, "click", this.elBtnList.func);
			break;
		case 1://list
			this.elBtnEdit = {};
			this.elBtnEdit.el = this.plAdmin.controlBtnAdd("Создать новый модуль", "add");
			this.elBtnEdit.func = this.listOnClickEdit.bind(this, 0);
			this.plLib.eventAdd(this.elBtnEdit.el, "click", this.elBtnEdit.func);
			this.elBtnAdd = {};
			this.elBtnAdd.el = this.plAdmin.controlBtnAdd("Установить модуль", "install");
			this.elBtnAdd.func = this.onClickInstall.bind(this);
			this.plLib.eventAdd(this.elBtnAdd.el, "click", this.elBtnAdd.func);
			this.elBtnTurn = {};
			this.elBtnTurn.el = this.plAdmin.controlBtnAdd("Инвертировать статус (Включен/Выключен) отмеченных модулей", "state");
			this.elBtnTurn.func = this.onClickTurn.bind(this);
			this.plLib.eventAdd(this.elBtnTurn.el, "click", this.elBtnTurn.func);
			break;
	}
	if (document.getElementById(this.elName("chks"))) {
		this.elChks = document.getElementById(this.elName("chks"));
		var ids = this.elChks.value.split(",");
		for (var id in ids) {
			if (document.getElementById(this.elName("ids") + ids[id]))
				this._chks.push(document.getElementById(this.elName("ids") + ids[id]));
		}
	}
	return true;
};
//list actions
_modules.prototype._actionListPager = function(num) {
	var pager = document.getElementById(this.$nameProto + "-list-pager");
	if (!pager) return;
	pager.value = num;
	this.plRender.action(this.$nameProto + "-list-pager");
	this.plRender.waiterShow();
};
_modules.prototype._actionListFilter = function(type) {
	var filter = document.getElementById(this.$nameProto + "-list-filter");
	if (!filter) return;
	filter.value = type;
	this.plRender.action(this.$nameProto + "-list-filter");
	this.plRender.waiterShow();
};
_modules.prototype._actionListItemEdit = function(pid) {
	document.getElementById(this.elName("id")).value = pid;
	this.plRender.action(this.elName("editor"));
	this.plRender.waiterShow();
};
_modules.prototype.actionList = function() {
	this.plRender.action(this.elName("list"));
	this.plRender.waiterShow();
};
_modules.prototype.actionTurn = function() {
	this.plRender.action(this.elName("invert-state"));
	this.plRender.waiterShow();
};
_modules.prototype.elName = render.sharedElementName;
_modules.prototype.listOnClickFilter = function(type) {
	this._actionListFilter(type);
};
_modules.prototype.listOnClickEdit = function(id) {
	this._actionListItemEdit(id);
};
_modules.prototype.listOnClickPager = function(num, el) {
	if (el.className.indexOf("pact") != -1) return;
	this._actionListPager(num);
};
_modules.prototype.onClickExit = function() {
	this.actionList();
};
_modules.prototype.onClickInstall = function() {
};
_modules.prototype.onClickTurn = function(id) {
	if (typeof id == "number") {
		this.selectAll(false);
		var cb = document.getElementById(this.elName("ids") + id);
		if (cb) cb.checked = true;
		else {
			alert("Некорректный параметр операции! [id: " + id + "]");
			return;
		}
	} else {
		var count = 0;
		for (var c in this._chks) {
			if (!this._chks.hasOwnProperty(c)) continue;
			if (this._chks[c].checked) count++;
		}
		if (!count) {
			alert("Ни один модуль не отмечен!");
			return;
		}
		if (count > 1) {
			if (!confirm("Вы собираетесь инвертировать статус нескольких модулей. Продолжить операцию?")) return;
		}
	}
	this.actionTurn();
};
_modules.prototype.selectAll = function(c) {
	if (typeof c == "boolean") c = true;
	for (var id in this._chks) {
		if (!this._chks.hasOwnProperty(c)) continue;
		this._chks[id].checked = c;
	}
};
render.pluginRegisterProto(_modules, __name_admin_modules);
})();

//плагин работы с файлами [prototype]
(function(){
var __name_admin_media_cropper = __name_admin_media + "-cropper";
var __name_admin_media_preview = __name_admin_media + "-preview";
var __name_admin_media_uploader = __name_admin_media + "-uploader";

var _media = function() {
	this._config			=	{
		_loaded:				false,
		cbOnCancel:				false,
		cbOnCreate:				false,
		cbOnDelete:				false,
		cbOnEdit:				false,
		cbOnEmbed:				false,
		cbOnLink:				false,
		cbOnSelect:				false,
		cbOnInit:				false,
		entity:					0,
		fetchShared:			false,
		folder:					"",
		module:					"",
		tab:					"list",
		tabs:					["list","item","upload"],
		tabsMore:				[],
		title:					"Библиотека файлов",
		titleList:				"Список файлов",
		titleItem:				"Предпросмотр",
		titleUpl:				"Загрузить файл",
		titleUse:				"Использовать",
		titleRes:				"Дополнительные размеры",
		types:					[],
		typeSet:				"any"
	};
	this._debug				=	false;
	this._domItemInfo		=	{
		imgInfo:				null,
		imgPreview:				null,
		main:					null,
		mime:					null,
		nameLocal:				null,
		nameSrv:				null,
		preview:				null,
		size:					null
	};
	this._domListEdit		=	{
		_i:						null,
		_pu:					-1,
		elExpert:				null,
		elBtnCancel:			null,
		elBtnExpert:			null,
		elBtnOk:				null,
		elMain:					null,
		elFieldCredit:			null,
		elFieldName:			null,
		elFieldNameView:		null,
		elFieldNoId:			null,
		elFieldNoSizes:			null,
		elFieldPath:			null,
		elFieldTitle:			null,
		elImgWait:				null
	};
	this._domUploadEdit		=	{
		_i:						null,
		elExpert:				null,
		elBtnExpert:			null,
		elMain:					null,
		elFieldCredit:			null,
		elFieldName:			null,
		elFieldNameView:		null,
		elFieldNoId:			null,
		elFieldNoSizes:			null,
		elFieldPath:			null,
		elFieldTitle:			null,
		elImgWait:				null
	};
	this._displayed			=	false;
	this._initErr			=	false;
	this._inited			=	false;
	this._list				=	{
		all:					[],
		expanded:				null,
		mapDt:					[],
		own:					[],
		pager:					{
			cur:				0,
			tot:				0,
			vis:				[]
		},
		shared:					[],
		total:					{any: [false,false], doc: [false,false], img: [false,false], mis: [false,false], snd: [false,false], vid: [false,false]},
		view:					[]
	}
	this._listed			=	[];
	this.$name				=	__name_admin_media;
	this.$nameOwner			=	__name_admin;
	this.$nameProto			=	this.$name;
	this._resize			=	{
		fn:						null,
		ev:						null,
		sp:						false,
		tm:						null
	}
	this._tab				=	"list";
	this._tabs				=	[
		{btn: null, cont: null, name: "list", title: "Список"},
		{btn: null, cont: null, name: "item", title: "Предпросмотр"},
		{btn: null, cont: null, name: "upload", title: "Загрузить файл"},
	];
	this._types				=	{
		any:				{id: 0, exts: [], title: "различные типы"},
		doc:				{id: 1, exts: ["doc","docx","pdf","ppt","pptx","rtf","txt","xls","xlsx"], title: "документы"},
		img:				{id: 2, exts: ["gif","jfif","jpeg","jpe","jpg","png"], title: "изображения"},
		mis:				{id: 3, exts: ["rar","zip"], title: "другие"},
		snd:				{id: 4, exts: ["mp3","ogg","wav"], title: "музыка (звуки)"},
		vid:				{id: 5, exts: ["avi","mov","mpg","mpeg","swf"], title: "видеоролики"}
	};
	this.elBtnExit			=	null;
	this.elMain				=	null;
	this.elList				=	null;
	this.elListBtnBack		=	null;
	this.elListBtnForw		=	null;
	this.elListFTypes		=	null;
	this.elListInfo			=	null;
	this.elListMsg			=	null;
	this.elListPerTime		=	null;
	this.elListSubset		=	null;
	this.elListTurnNum		=	null;
	this.elListWaiter		=	null;
	this.elUpload			=	null;
	this.fShow				=	null;
	this.plCropper			=	null;//для обрезки из списка кнопка пока не сделана
	this.plLib				=	null;
	this.plMsgr				=	null;
	this.plOwner			=	null;
	this.plPreview			=	null;
	this.plPu				=	null;
	this.plRender			=	null;
	this.plUploader			=	null;
	this.pliCropper			=	null;
};
_media.prototype._init = function(last, config, parent) {
	if (this._inited) return true;
	if (typeof last != "boolean") last = false;
	if (!this.plOwner) {
		if ((typeof parent == "object") && parent) {
			this.plOwner = parent;
			this.plLib = parent.getPlLib();
			this.plMsgr = parent.getPlMsgr();
			this.plPu = parent.getPlPu();
		}
	}
	if (this.waitConfig(config, last)) return this._inited;
	//if (this.waitPlugin(__name_admin_media_cropper, "plCropper", last));
	this.DOMMain();
	this.DOMTabList();
	this.DOMTabUpload();
	if (this.waitPluginInstance(__name_admin_media_preview, "plPreview", last, true, {
		wrapper: this.tabFind("item"),
		cbOnCrop: this.onCbPreview.bind(this, "crop"),
		cbOnEmbed: this.onCbPreview.bind(this, "embed"),
		cbOnLink: this.onCbPreview.bind(this, "link")
	}, this)) return this._inited;
	if (this.waitPluginInstance(__name_admin_media_uploader, "plUploader", last, true, {
		cbOnLoaded: this.onCbUploader.bind(this, "loaded"),
		cbOnLoadBefore: this.onCbUploader.bind(this, "load-before"),
		cbOnLoadStarted: this.onCbUploader.bind(this, "load-start"),
		cbOnReady: this.onCbUploader.bind(this, "ready"),
		destination: this._config.folder,
		entity: this._config.entity,
		module: this._config.module
	}, this)) return this._inited;
	this._pu = this.plPu.add({
		content: this.elMain.parentNode,
		showcloser:false,
		windowed:true
	});
	//всплывающий редактор инфо файла
	this._domListEdit = this.DOMListEdit(true);
	this._domListEdit._pu = this.plPu.add({
		content: this._domListEdit.elMain.parentNode,
		showcloser: false,
		windowed: true
	});
	this._inited = true;
	//вызываем onInit
	if (typeof this._config.cbOnInit == "function") {
		try {
			this._config.cbOnInit();
		} catch(e) {
			this.console(__name_script + " > " + this.$name + "._init(): Ошибка выполнения cbOnInit [" + e.name + "/" + e.message + "]");
		}
	}
	this._resize.fn = this.onWindowResize.bind(this);
	this.plLib.eventAdd(window, "resize", this._resize.fn);
	return true;
};
_media.prototype._actionSilentCrop = function(data) {
	var req = this.plRender.silentReqBuild(this);
	req.action = this.$nameProto + "-imgcrop";
	req.cbBound = false;
	req.cbFunc = this.onAction;
	req.dataPOST[this.$nameProto + "-files-module"] = this._config.module;
	req.dataPOST[this.$nameProto + "-files-entity"] = this._dom._i.entity;
	req.dataPOST[this.$nameProto + "-pid"] = this._dom._im.id;
	req.dataPOST[this.$nameProto + "-dim"] = data.x + "," + data.y + "," + data.w + "," + data.h;
	req.dataPOST[this.$nameProto + "-scale"] = data.scale;
	req.debug = this._debug;
	//req.json = true; //default
	req.owner_store.i = this._dom._i;
	this.plRender.silent(req);
};
_media.prototype._actionSilentDel = function() {
	/*
	req.cbBound = false;
	render.silent({
		action: this._parent.name + "-" + this.$name + "-imgdel",
		cbobj: this,
		cbFunc: this.uploadOnAction,
		data: {
			did: d.id,
			id: iid,
			mName: d.lib.name
		}
	});
	d.inAction = true;
	*/
};
_media.prototype._actionSilentEdit = function() {
	var req = this.plRender.silentReqBuild(this);
	req.action = this.$nameProto + "-file-edit";
	req.cbBound = false;
	req.cbFunc = this._onSilentDone;
	req.dataPOST[this.$nameProto + "-files-module"] = this._config.module;
	req.dataPOST[this.$nameProto + "-files-entity"] = this._config.entity;
	req.dataPOST[this.$nameProto + "-file-id"] = this._domListEdit._i.id;
	req.dataPOST[this.$nameProto + "-file-name"] = this._domListEdit.elFieldName.value;
	req.dataPOST[this.$nameProto + "-file-title"] = this._domListEdit.elFieldTitle.value;
	req.dataPOST[this.$nameProto + "-file-credit"] = this._domListEdit.elFieldCredit.value;
	req.dataPOST[this.$nameProto + "-file-noid"] = this._domListEdit.elFieldNoId.checked ? "1" : "0";
	req.dataPOST[this.$nameProto + "-file-nosizes"] = this._domListEdit.elFieldNoSizes.checked ? "1" : "0";
	req.debug = this._debug;
	this.plRender.silent(req);
};
_media.prototype._actionSilentList = function() {
	var r = this.plRender.silentReqBuild(this);
	r.action = this.$nameProto + "-list";
	r.cbBound = false;
	r.cbFunc = this._onSilentDone;
	r.dataPOST[this.$nameProto + "-module"] = this._config.module;
	r.dataPOST[this.$nameProto + "-entity"] = this._config.entity;
	r.debug = this._debug;
	this.plRender.silent(r);
};
_media.prototype._actionSilentMore = function(refid, subset, type, count) {
	if (typeof refid == "undefined") return;
	if (typeof subset == "undefined") return;
	if (typeof type == "undefined") return;
	if ((typeof count == "undefined") || !count) return;
	var ord = 0;
	if (subset != "own") ord = 1;
	if (this._list.total[type][ord]) return;
	var f = (subset == "own" ? this._list.own : this._list.shared);
	if (!f.length) return;
	var req = this.plRender.silentReqBuild(this);
	req.action = this.$nameProto + "-files-list-more";
	req.cbBound = false;
	req.cbFunc = this.onAction;
	req.dataPOST[this.$nameProto + "-files-count"] = count;
	req.dataPOST[this.$nameProto + "-files-module"] = this._config.module;
	req.dataPOST[this.$nameProto + "-files-refid"] = refid;
	req.dataPOST[this.$nameProto + "-files-entity"] = (subset == "own" ? this._config.entity : "0");
	req.dataPOST[this.$nameProto + "-files-type"] = type;
	req.debug = this._debug;
	req.owner_store.refid = refid;
	req.owner_store.subset = subset;
	req.owner_store.type = type;
	req.owner_store.count = count;
	req.sequential = true;
	this.plRender.silent(req);
};
_media.prototype._configImport = function(cfg) {
	if (typeof cfg != "object" || !cfg) return false;
	var setOnInit = false;
	var setEntity = false;
	var setModule = false;
	for (var c in this._config) {
		if (!this._config.hasOwnProperty(c)) continue;
		if (typeof cfg[c] != "undefined") {
			switch(c) {
				case "_loaded":
					break;
				case "cbOnCancel":
				case "cbOnCreate":
				case "cbOnDelete":
				case "cbOnEdit":
				case "cbOnEmbed":
				case "cbOnLink":
				case "cbOnSelect":
				case "cbOnInit":
					if (typeof cfg[c] == "function") {
						this._config[c] = cfg[c];
						if (c == "cbOnInit") setOnInit = true;
					}
					break;
				case "entity":
					if (typeof cfg.entity == "string") {
						var en = parseInt(cfg.entity, 10);
						if (!isNaN(en)) {
							this._config.entity = en;
							setEntity = true;
						}
					} else {
						if (typeof cfg.entity == "number") {
							this._config.entity = cfg.entity;
							setEntity = true;
						}
					}
					break;
				case "folder":
					if (typeof cfg.folder == "string") this._config.folder = cfg.folder;
					break;
				case "module":
					if (typeof cfg.module == "string") {
						this._config.module = cfg.module;
						setModule = true;
					}
					break;
				case "tab":
					if (typeof cfg.tab == "string") this._config.tab = cfg.tab;
					break;
				case "tabsMore":
					if ((typeof tabsMore != "undefined") && (tabsMore instanceof Array)) {
						var cnt = 0;
						for (var t in tabsMore) {
							if (!tabsMore.hasOwnProperty(t)) continue;
							if (typeof tabsMore[t].name != "undefined") {
								for (var it in this._tabs) {
									if (!this._tabs.hasOwnProperty(it)) continue;
									if (this._tabs[it].name == tabsMore[t].name) break;
								}
								cnt++;
								if (typeof tabsMore[t].title != "string") tabsMore[t].title = "ExtTab #" + cnt;
								tabsMore[t].btn = null;
								tabsMore[t].cont = null;
								this._tabs.push(tabsMore[t]);
							}
						}
					}
					break;
				case "title":
				case "titleList":
				case "titleItem":
				case "titleUpl":
				case "titleUse":
				case "titleRes":
					if (typeof cfg[c] == "string") this._config[c] = cfg[c];
					break;
				case "typeSet":
					if (typeof cfg.typeSet == "string") {
						for (var t in this._types) {
							if (!this._types.hasOwnProperty(t)) continue;
							if (cfg.typeSet == t) {
								this._config.typeSet = t;
								break;
							}
						}
					}
					break;
				case "types":
					if ((typeof cfg.types != "undefined") && (cfg.types instanceof Array)) {
						for (var t in cfg.types) {
							if (!cfg.types.hasOwnProperty(t)) continue;
							if (typeof cfg.types[t] == "string")
								this._config.types.push(cfg.types[t].toLowerCase());
						}
					}
					break;
				default:
					this._config[c] = cfg[c];
					break;
			}
		}
	}
	//обязательных параметров
	if (!setOnInit) {
		var msg = __name_script + " > [" + this.$name + "].configImport(): Невозможно показать диалог - обязательный параметр конфига cbOnReady не задан или задан неверно [" + typeof cfg.cbOnReady + "].";
		this.console(msg);
		alert(msg);
		return false;
	}
	if (!setModule) {
		var msg = __name_script + " > [" + this.$name + "].configImport(): Невозможно показать диалог - обязательный параметр конфига module не задан или задан неверно [" + typeof cfg.module + "].";
		this.console(msg);
		alert(msg);
		return false;
	}
	if (!setEntity) {
		var msg = __name_script + " > [" + this.$name + "].configImport(): Невозможно показать диалог - обязательный параметр конфига entity не задан или задан неверно [" + typeof cfg.module + "].";
		this.console(msg);
		alert(msg);
		return false;
	}
	//проверка начального таба
	var tf = false
	for (var c in this._tabs) {
		if (!this._tabs.hasOwnProperty(c)) continue;
		if (this._config.tab == this._tabs[c].name) {
			tf = true;
			break;
		}
	}
	//проверка типов
	if (this._config.types.length) {
		var valid = [];
		var found = 0;
		for (var c in this._config.types) {
			if (!this._config.types.hasOwnProperty(c)) continue;
			if (this._config.typeSet == "any") {
				for (var ts in this._types) {
					if (!this._types.hasOwnProperty(ts)) continue;
					if (ts == "any") continue;
					for (var te in this._types[ts].exts) {
						if (!this._types[ts].exts.hasOwnProperty(te)) continue;
						if (this._types[ts].exts[te] == this._config.types[c]) {
							valid.push(this._config.types[c]);
							found++;
							break;
						}
					}
				}
			} else {
				var ts = this._config.typeSet;
				for (var te in this._types[ts].exts) {
					if (!this._types[ts].exts.hasOwnProperty(te)) continue;
					if (this._types[ts].exts[te] == this._config.types[c]) {
						valid.push(this._config.types[c]);
						found++;
						break;
					}
				}
			}
		}
		if (found) {
			if (this._config.types.length != valid.length) this._config.types = valid;
		} else {
			if (this._config.typeSet != "any") {
				this._config.typeSet = "any";
				var msg = __name_script + " > [" + this.$name + "].configImport(): Предупреждение - ни один переданный не является допустимым, typeSet установлен в \"any\".";
				this.console(msg);
			}
		}
	} else {
		if (this._config.typeSet != "any") {
			this._config.types = this._types[this._config.typeSet].exts;
		}
	}
	if (!tf) this._config.tab = "list";
	this._config._loaded = true;
	return true;
};
_media.prototype._onSilentDone = function(req) {
	switch (req.action) {
		case this.$nameProto + "-file-edit":
			this._domListEdit.elFieldCredit.value = "";
			this._domListEdit.elFieldName.value = "";
			this._domListEdit.elFieldTitle.value = "";
			this._domListEdit.elFieldNameView.innerHTML = "";
			this._domListEdit.elBtnExpert.style.display = "block";
			this._domListEdit.elExpert.style.display = "none";
			this._domListEdit.elFieldNoId.checked = false;
			this._domListEdit.elFieldNoSizes.checked = false;
			this._domListEdit.elFieldNoSizes.parentNode.style.display = "block";
			this._domListEdit.elImgWait.style.display = "none";
			this._domListEdit.elBtnOk.parentNode.style.display = "block";
			this.plPu.hide(this._domListEdit._pu);
			if (req.response.res) {
				if (typeof this._list.all[req.response.item.id] != "undefined") {
					var i = this._list.all[req.response.item.id];
					i.name_id = req.response.item.name_id;
					i.name_sized = req.response.item.name_sized;
					i.name = req.response.item.name;
					i.title = req.response.item.title;
					i.credit = req.response.item.credit;
					i.dom.path.innerHTML = i.url;
					i.dom.path.title = (i.title ? (i.title + " ") : "" ) + (i.credit ? ("[Фото: " + i.credit + "]") : "");
				}
			}
			break;
		case this.$nameProto + "-list":
			/*
			bid: "25"
			binds: Object
			bytes: 54141
			childs: Object
			content_type: "image/jpeg"
			credit: ""
			directory: "data/_content/31/media"
			extension: "jpg"
			file_path: "data/_content/31/media/25-400x400.jpg"
			filename: "25-400x400.jpg"
			height: 400
			id: 25
			name: ""
			name_id: 1
			name_orig: "IMAG0321.jpg"
			name_sized: 1
			oid: "31"
			par1: ""
			par2: ""
			par3: ""
			pid: 0
			res: ""
			size_delim: "-"
			title: ""
			type: 2
			uploaded: "2014-05-22 12:57:15"
			url: "/data/_content/31/media/25-400x400.jpg"
			url_thumb: "/data/_media/thumbs/uploader/2014/05/25.jpg"
			width: 400
			*/
			this.elListWaiter.style.display = "none";
			if (!req.response.res) {
				this.elListMsg.innerHTML = req.response.msg ? req.response.msg : "Ошибка загрузки.";
				this.elListMsg.style.display = "block";
				return;
			} else {
				//обновляем листалку страниц
				this.listPagerUpdate(req.response.rowsShowDef);
				//сохраняем наборы
				this.listItemsUpdate(req.response);
				//обновляем интерфейс
				this.listViewUpdate();
			}
			break;
		case this.$nameProto + "-list-more":
			this.elListWaiter.style.display = "none";
			if(!req.response.res) {
				this.elListMsg.innerHTML = req.response.msg ? req.response.msg : "Ошибка загрузки.";
				this.elListMsg.style.display = "block";
				return;
			} else {
				var files, loadedInd;
				if (req.owner_store.subset == "own")  {
					loadedInd = 0;
					files = this._list.own;
				} else {
					loadedInd = 1;
					files = this._list.shared;
				}
				this._list.total[req.owner_store.type][loadedInd] = !req.response.items_more;
				var i;
				for (var c in req.response.items) {
					if (!req.response.items.hasOwnProperty(c)) continue;
					i = req.response.items[c];
					if (typeof this._list.all[i.id] != "undefined") continue;
					files.push(i);
					this._list.all[i.id] = i;
					i.entity = this._config.entity;
					this.findType(i);
					this.fileName(i);
					this.listDOMItem(i);
					if (i.dom) {
						i.childs = [];
						if (typeof this._list.mapDt[i.dts] == "undefined") this._list.mapDt[i.dts] = [];
						this._list.mapDt[i.dts].push(i.id);
						this.listItemInsert(i);
					}
				}
				//сохраняем последний референс для списка типа "все файлы"
				if (req.owner_store.type == "any") this._list.mapLast[req.owner_store.subset] = files[files.length - 1].id;
				//рефернс для других списков будет браться из активного списка [this._list.pager.vis]
				for (var c in req.response.childs) {
					if (!req.response.childs.hasOwnProperty(c)) continue;
					i = req.response.childs[c];
					i.entity = this._config.entity;
					this._list.all[i.id] = i;
					this.findType(i);
					this.fileName(i);
					this.listDOMItem(i);
					if (typeof this._list.all[i.pid] != "undefined") {
						i.parent = this._list.all[i.pid];
						if (i.parent.dom.childs) {
							this._list.all[i.pid].childs.push(i);
							i.parent.dom.childs.appendChild(i.dom.main);
							i.parent.dom.elCopies.className = "item-btn bchilds";
						}
					}
				}
				//листаем
				this.listViewUpdate();
				this._list.pager.cur++;
				if (this._list.pager.cur < 0) this._list.pager.cur = 0;
				if (this._list.pager.cur > (this._list.pager.tot - 1)) this._list.pager.cur = (this._list.pager.tot - 1)
				this.listViewUpdate();
			}
			break;
		case (this.$nameProto + "-imgcrop"):
			if (!req.response.res) return;
			else {
				var item = req.response.item;
				this._list.all[item.id] = item;
				item.entity = req.owner_store.i.entity;
				this.findType(item);
				this.fileName(item);
				this.listDOMItem(item);
				if (typeof this._list.all[item.pid] != "undefined") {
					item.parent = this._list.all[item.pid];
					if (item.parent.dom.childs) {
						item.parent.childs.push(item);
						if (item.parent.dom.childs.childNodes.length)
							item.parent.dom.childs.insertBefore(item.dom.main, item.parent.dom.childs.childNodes[0]);
						else
							item.parent.dom.childs.appendChild(item.dom.main);
						item.parent.dom.elCopies.className = "item-btn bchilds";
					}
				}
			}
			//вставляем превью
			if (this._dom._im && this._dom._im.id == item.pid) {
				this._dom.elCopiesWaiter.style.display = "none";
				var p = {dom: {elMain: null, elBtnDel: null, elBtnEdit: null, elImg: null}, funcDel: null, funcEdit: null, funcSet: null};
				p.funcDel = this.onClickBtnListDelete.bind(this, item);
				p.funcEdit = this.onClickBtnListEdit.bind(this, item);
				p.funcSet = this.previewReset.bind(this, item);
				this.DOMTabItemCopy(p, item);//preview.DOMEdit
				this.plLib.eventAdd(p.dom.elBtnEdit, "click", p.funcEdit);
				this.plLib.eventAdd(p.dom.elBtnEdit, "click", p.funcEdit);
				this.plLib.eventAdd(p.dom.elImg, "click", p.funcSet);
				var n = this._dom.elCopiesWaiter.nextSibling;
				if (n)
					this._dom.elCopies.insertBefore(p.dom.elMain, n);
				else
					this._dom.elCopies.appendChild(p.dom.elMain);
				this._dom._copies.push(p);
			}
			//предлагаем отредактировать
			this._domListEdit._i = i;
			this._domListEdit.elFieldCredit.value = i.credit;
			this._domListEdit.elFieldName.value = i.name;
			this._domListEdit.elFieldTitle.value = i.title;
			this.plPu.show(this._domListEdit._pu);
			break;
		case (this.$nameProto + "-file-delete"):
			if (!d) {
				alert("Невозможно обработать ответ операции [" + this._parent.$name + "-" + this.$name + "-imgcrop]: неверный ID диалога [" + r.did + "]");
				this.console(__name_script + " > [" + this.$name + "].onAction(): Неверный ID диалога [id: " + r.did + ", action: " + this._parent.$name + "-" + this.$name + "-imgcrop]");
				break;
			}
			var iob = null;
			for (var c in d.domps.imgs)
				if (d.domps.imgs[c].id == r.id) {
					iob = d.domps.imgs[c];
					break;
				}
			if (!iob) {
				if (!r.res && (!r.msg)) {
					alert("Ошибка удаления изображения: неизвестная ошибка.")
					this.console(__name_script + " > [" + this.$name + "].onAction(): Неизвестная ошибка, изображение не удалено [id: " + r.did + ", action: " + r.action + ", iob.id: <corrupted>]");
				} else {
					this.console(__name_script + " > [" + this.$name + "].onAction(): Неизвестная ошибка, изображение удалено, но соответствующий объект не найден [id: " + r.did + ", action: " + r.action + ", iob.id: <corrupted>]");
				}
				break;
			}
			if (!r.res) {
				this.plLib.eventAdd(iob.elBtn, "click", iob.fDel);
				iob.elWaiter.style.display = "none";
				iob.elImg.style.display = "block";
				if (!r.msg) {
					alert("Ошибка удаления изображения: неизвестная ошибка.")
					this.console(__name_script + " > [" + this.$name + "].onAction(): Неизвестная ошибка, изображение не удалено [id: " + r.did + ", action: " + r.action + ", iob.id: " + iob.id + "]");
				}
			} else {
				this.uploadDOMCroppedPreviewUnlink(d, iob);
				this.console(__name_script + " > [" + this.$name + "].onAction(): Изображение удалено [dlgId: " + r.did + ", action: " + r.action + ", iob.id: " + iob.id + "]");
			}
			break;
		default:
			this.console(__name_script + " > [" + this.$name + "].onAction(): Неизвестная команда [" + req.action + "].");
			return;
	}
};
_media.prototype.DOMListEdit = function(popup) {
	if (typeof popup != "boolean") popup = false;
	var listEdit = {};
	listEdit.elMain = document.createElement("DIV");
	var el, inner;
	if (popup) {
		listEdit.elMain.className = "media modal";
		el = document.createElement("DIV");
		el.className = __name_admin;
		el.appendChild(listEdit.elMain);
		inner = document.createElement("DIV");
		listEdit.elMain.appendChild(inner);
	} else inner = listEdit.elMain;
	inner.className = "media-list-edit";
	el = document.createElement("DIV");
	el.className = "pop-title";
	el.innerHTML = "Редактирование сведений о файле";
	inner.appendChild(el);
	//заметка
	el = document.createElement("DIV");
	el.className = "note";
	el.innerHTML = "Все поля можно оставить пустыми.";
	inner.appendChild(el);
	//поле названия файла
	el = document.createElement("DIV");
	el.className = "field-title";
	el.innerHTML = "Имя файла (латиница):";
	inner.appendChild(el);
	el = document.createElement("DIV");
	el.className = "inp-wrapper";
	inner.appendChild(el);
	listEdit.elFieldName = document.createElement("INPUT");
	listEdit.elFieldName.type = "text";
	listEdit.elFieldName.maxlength = 255;
	el.appendChild(listEdit.elFieldName);
	if (popup) {
		this.plLib.eventAdd(listEdit.elFieldName, "keyup", this.onChangeInputListEdit.bind(this));
		this.plLib.eventAdd(listEdit.elFieldName, "change", this.onChangeInputListEdit.bind(this));
	} else {
		this.plLib.eventAdd(listEdit.elFieldName, "keyup", this.onChangeInputUploadEdit.bind(this));
		this.plLib.eventAdd(listEdit.elFieldName, "change", this.onChangeInputUploadEdit.bind(this));
	}
	//поле названия
	el = document.createElement("DIV");
	el.className = "field-title";
	el.innerHTML = "Подпись/заголовок:";
	inner.appendChild(el);
	el = document.createElement("DIV");
	el.className = "inp-wrapper";
	inner.appendChild(el);
	listEdit.elFieldTitle = document.createElement("INPUT");
	listEdit.elFieldTitle.type = "text";
	listEdit.elFieldTitle.maxlength = 255;
	el.appendChild(listEdit.elFieldTitle);
	//поле авторства
	el = document.createElement("DIV");
	el.className = "field-title";
	el.innerHTML = "Авторство:";
	inner.appendChild(el);
	el = document.createElement("DIV");
	el.className = "inp-wrapper";
	inner.appendChild(el);
	listEdit.elFieldCredit = document.createElement("INPUT");
	listEdit.elFieldCredit.type = "text";
	listEdit.elFieldCredit.maxlength = 255;
	el.appendChild(listEdit.elFieldCredit);
	//кнопка Дополнительно
	listEdit.elBtnExpert = document.createElement("DIV");
	listEdit.elBtnExpert.className = "turn-expert";
	listEdit.elBtnExpert.innerHTML = "Дополнительно";
	inner.appendChild(listEdit.elBtnExpert);
	if (popup)
		this.plLib.eventAdd(listEdit.elBtnExpert, "click", this.onClickBtnListEditExpert.bind(this));
	else
		this.plLib.eventAdd(listEdit.elBtnExpert, "click", this.onClickBtnUploadEditExpert.bind(this));
	var el = document.createElement("SPAN");
	el.className = "icn";
	listEdit.elBtnExpert.insertBefore(el, listEdit.elBtnExpert.childNodes[0]);
	//блок с дополнительными настройками
	listEdit.elExpert = document.createElement("DIV");
	listEdit.elExpert.className = "expert";
	listEdit.elExpert.style.display = "none";
	inner.appendChild(listEdit.elExpert);
	//поле названия файла
	el = document.createElement("DIV");
	el.className = "field-title";
	el.innerHTML = "Полное название файла (превью):";
	listEdit.elExpert.appendChild(el);
	listEdit.elFieldNameView = document.createElement("DIV");
	listEdit.elFieldNameView.className = "name-preview";
	listEdit.elExpert.appendChild(listEdit.elFieldNameView);
	//поле отключения ID
	el = document.createElement("LABEL");
	el.className = "chbx-wrap";
	el.innerHTML = "не использовать ID в имени файла";
	listEdit.elExpert.appendChild(el);
	listEdit.elFieldNoId = document.createElement("INPUT");
	listEdit.elFieldNoId.type = "checkbox";
	listEdit.elFieldNoId.className = "ex-opt";
	el.insertBefore(listEdit.elFieldNoId, el.childNodes[0]);
	if (popup)
		this.plLib.eventAdd(listEdit.elFieldNoId, "click", this.onClickChkListEdit.bind(this));
	else
		this.plLib.eventAdd(listEdit.elFieldNoId, "click", this.onClickChkUploadEdit.bind(this));
	//поле отключения размеров
	el = document.createElement("LABEL");
	el.className = "chbx-wrap";
	el.innerHTML = "не использовать размеры в имени файла (для изображений)";
	listEdit.elExpert.appendChild(el);
	listEdit.elFieldNoSizes = document.createElement("INPUT");
	listEdit.elFieldNoSizes.type = "checkbox";
	listEdit.elFieldNoSizes.className = "ex-opt";
	el.insertBefore(listEdit.elFieldNoSizes, el.childNodes[0]);
	if (popup)
		this.plLib.eventAdd(listEdit.elFieldNoSizes, "click", this.onClickChkListEdit.bind(this));
	else
		this.plLib.eventAdd(listEdit.elFieldNoSizes, "click", this.onClickChkUploadEdit.bind(this));
	if (popup) {
		//waiter
		listEdit.elImgWait = document.createElement("IMG");
		listEdit.elImgWait.className = "wait";
		listEdit.elImgWait.style.display = "none";
		listEdit.elImgWait.src = this.plLib.getImage("loading");
		inner.appendChild(listEdit.elImgWait);
		//кнопки ок, отмена
		el = document.createElement("DIV");
		el.style.overflow = "hidden";
		el.style.paddingTop = "10px";
		inner.appendChild(el);
		listEdit.elBtnOk = document.createElement("SPAN");
		listEdit.elBtnOk.className = "btn";
		listEdit.elBtnOk.innerHTML = "OK";
		el.appendChild(listEdit.elBtnOk);
		listEdit.elBtnCancel = document.createElement("SPAN");
		listEdit.elBtnCancel.className = "btn";
		listEdit.elBtnCancel.innerHTML = "Отмена";
		el.appendChild(listEdit.elBtnCancel);
		this.plLib.eventAdd(listEdit.elBtnOk, "click", this.onClickBtnListEditConfirm.bind(this));
		this.plLib.eventAdd(listEdit.elBtnCancel, "click", this.onClickBtnListEditCancel.bind(this));
	}
	return listEdit;
};
_media.prototype.DOMMain = function() {
	if (this.elMain) return;
	var el = document.createElement("DIV");
	el.className = __name_admin;
	var el1 = document.createElement("DIV");
	el1.className = "media-title";
	el.appendChild(el1);
	var el2 = document.createElement("SPAN");
	el2.className = "tinner";
	el2.innerHTML = this._config.title;
	el1.appendChild(el2);
	this.elMain = document.createElement("DIV");
	this.elMain.className = "media inline";
	el.appendChild(this.elMain);
	//кнопки табов
	el = document.createElement("DIV");
	el.className = "tabs-btns-rel";
	this.elMain.appendChild(el);
	el1 = document.createElement("DIV");
	el1.className = "tabs-btns";
	el.appendChild(el1);
	for (var c in this._tabs) {
		this._tabs[c].btn = document.createElement("DIV");
		this._tabs[c].btn.className = "tab-btn" + (this._config.tab == this._tabs[c].name ? " act" : (this._tabs[c].name == "item" ? " dis" : ""));
		this._tabs[c].btn.innerHTML = this._tabs[c].title;
		el1.appendChild(this._tabs[c].btn);
		this.plLib.eventAdd(this._tabs[c].btn, "click", this.onClickBtnTab.bind(this, this._tabs[c]));
	}
	//кнопка закрытия окна
	this.elBtnExit = document.createElement("DIV");
	this.elBtnExit.className = "btn-exit";
	this.elBtnExit.innerHTML = "Закрыть";
	this.elBtnExit.title = "Закрыть окно";
	el.appendChild(this.elBtnExit);
	this.plLib.eventAdd(this.elBtnExit, "click", this.onClickBtnListExit.bind(this));
	el = document.createElement("DIV");
	el.className = "tabs-spacer-rel";
	this.elMain.appendChild(el);
	el1 = document.createElement("DIV");
	el1.className = "tabs-spacer";
	el.appendChild(el1);
	//контент табов
	el = document.createElement("DIV");
	el.className = "tabs";
	this.elMain.appendChild(el);
	for (var c in this._tabs) {
		this._tabs[c].cont = document.createElement("DIV");
		this._tabs[c].cont.className = "tab" + (this._config.tab == this._tabs[c].name ? " vis" : "");
		el.appendChild(this._tabs[c].cont);
	}
};
_media.prototype.DOMTabList = function() {
	if (this.elListFTypes) return;
	var tab = this.tabFind("list");
	if (tab === false) {
		var msg = __name_script + " > [" + this.$name + "].DOMTabList(): Невозможно показать список файлов - соответствующий DOM не найден.";
		this.console(msg);
		alert(msg);
		return;
	}
	//контроль списка
	var el = document.createElement("DIV");
	el.className = "list-ctrls";
	tab.appendChild(el);
	//набор
	var el1 = document.createElement("SPAN");
	el1.className = "filt-title";
	el1.innerHTML = "Набор:";
	el.appendChild(el1);
	this.elListSubset = document.createElement("SELECT");
	this.elListSubset.className = "filt-input1";
	this.elListSubset.options[0] = new Option("собственный [" + this._config.module + ":" + this._config.entity + "]", "own", true, true);
	this.elListSubset.options[1] = new Option("общий [" + this._config["module"] + "]", "shared", false, false);
	el.appendChild(this.elListSubset);
	this.plLib.eventAdd(this.elListSubset, "change", this.onChangeInputListSelect.bind(this));
	//типы
	el1 = document.createElement("SPAN");
	el1.className = "filt-title";
	el1.innerHTML = "Типы:";
	el.appendChild(el1);
	this.elListFTypes = document.createElement("SELECT");
	this.elListFTypes.className = "filt-input2";
	var cnt = 0;
	for (var c in this._types) {
		if (!this._types.hasOwnProperty(c)) continue;
		if (typeof this._types[c] == "object") {
			this.elListFTypes.options[cnt] = new Option(this._types[c].title, c, (!cnt ? true : false), (!cnt ? true : false));
		}
		cnt++;
	}
	el.appendChild(this.elListFTypes);
	this.plLib.eventAdd(this.elListFTypes, "change", this.onChangeInputListSelect.bind(this));
	//показывать за раз
	el1 = document.createElement("SPAN");
	el1.className = "filt-title";
	el1.innerHTML = "Показать:";
	el.appendChild(el1);
	this.elListPerTime = document.createElement("SELECT");
	this.elListPerTime.className = "filt-input3";
	this.elListPerTime.options[0] = new Option("5", "5", false, false);
	this.elListPerTime.options[1] = new Option("10", "10", false, false);
	this.elListPerTime.options[2] = new Option("15", "15", false, false);
	this.elListPerTime.options[3] = new Option("30", "30", false, false);
	this.elListPerTime.options[4] = new Option("50", "50", false, false);
	this.elListPerTime.options[5] = new Option("100", "100", false, false);
	el.appendChild(this.elListPerTime);
	this.plLib.eventAdd(this.elListPerTime, "change", this.onChangeInputListSelect.bind(this));
	//кнопка вперед
	this.elListBtnForw = document.createElement("DIV");
	this.elListBtnForw.className = "btn-turn forw dis";
	el.appendChild(this.elListBtnForw);
	this.plLib.eventAdd(this.elListBtnForw, "click", this.onClickBtnListTurn.bind(this, -1));
	//номер страницы
	this.elListTurnNum = document.createElement("DIV");
	this.elListTurnNum.className = "turn-num";
	this.elListTurnNum.innerHTML = "1/1";
	el.appendChild(this.elListTurnNum);
	//кнопка назад
	this.elListBtnBack = document.createElement("DIV");
	this.elListBtnBack.className = "btn-turn back dis";
	el.appendChild(this.elListBtnBack);
	this.plLib.eventAdd(this.elListBtnBack, "click", this.onClickBtnListTurn.bind(this, 1));
	//всплывающее инфо файла
	this.elListInfo = document.createElement("DIV");
	this.elListInfo.className = "item-info"
	this.elListInfo.style.display = "none";
	tab.appendChild(this.elListInfo);
	el = document.createElement("DIV");
	el.className = "body";
	this.elListInfo.appendChild(el);
	//список
	this.elList = document.createElement("DIV");
	this.elList.className = "list-area";
	tab.appendChild(this.elList);
	this.elListWaiter = document.createElement("DIV");
	this.elListWaiter.className = "waiter render-loader";
	this.elListWaiter.innerHTML = "загрузка списка...";
	this.elList.appendChild(this.elListWaiter);
	this.elListMsg = document.createElement("DIV");
	this.elListMsg.style.display = "none";
	this.elList.appendChild(this.elListMsg);
};
_media.prototype.DOMTabPreview = function() {
	//пока что тут пусто
};
_media.prototype.DOMTabUpload = function() {
	if (this.elUpload) return;
	var tab = this.tabFind("upload");
	if (tab === false) {
		var msg = __name_script + " > [" + this.$name + "].DOMTabUpload(): Невозможно создать закладку загрузки файла - соответствующий DOM не найден.";
		this.console(msg);
		alert(msg);
		return;
	}
	this.elUpload = document.createElement("DIV");
	this.elUpload.className = "upload-area";
	tab.appendChild(this.elUpload);
	// ---------------------------- info ---------------------------------
	this._domUploadEdit = this.DOMListEdit();
	this.onClickChkUploadEdit();
	this.elUpload.appendChild(this._domUploadEdit.elMain);
};
_media.prototype.exit = function() {
	this.plPu.hide(this._pu);
	if (typeof this._config.cbOnCancel == "function") {
		try {
			this._config.cbOnCancel();
		} catch(e) {
			this.console(__name_script + " > [" + this.$name + "].exit(): Ошибка выполнения callback-функции при закрытии окна.");
		}
	}
};
_media.prototype.exitDone = function(i, action) {
	if (typeof action != "string") action = "embed";
	this.plPu.hide(this._pu);
	try {
		switch(action) {
			case "embed":
				if (typeof this._config.cbOnEmbed == "function") this._config.cbOnEmbed(i);
				break;
			case "link":
				if (typeof this._config.cbOnLink == "function") this._config.cbOnLink(i);
				break;
			case "select":
				if (typeof this._config.cbOnSelect == "function") this._config.cbOnSelect(i);
				break;
			default:
				this.console(__name_script + " > [" + this.$name + "].exitDone(): Unknown action passed!");
				break;
		}
	} catch(e) {
		this.console(__name_script + " > [" + this.$name + "].exitDone(): Ошибка передачи выбранного ресурса контроллеру диалога.");
	}
};
_media.prototype.findType = function(i) {
	if (typeof i.type == "string") return i.type;
	var tp = "any";
	for (var c in this._types) {
		if (!this._types.hasOwnProperty(c)) continue;
		if (c == "any") continue;
		if (this._types[c].id === i.type) {
			tp = c;
			break;
		}
	}
	i.type = tp;
	return tp;
};
_media.prototype.listDOMItem = function(i) {
	var d = {};
	d.dom = {};
	d.dom.main = document.createElement("DIV");
	d.dom.main.className = "item" + (i.pid ? "" : " main");
	if (!i.pid) {
		d.dom.self = document.createElement("DIV");
		d.dom.main.appendChild(d.dom.self);
	} else d.dom.self = d.dom.main;
	//иконка
	var el = document.createElement("SPAN");
	el.className = "icon media-icn " + i.extension;
	d.dom.self.appendChild(el);
	//кнопка инфо
	d.dom.info = document.createElement("DIV");
	d.dom.info.className = "item-btn info";
	d.dom.self.appendChild(d.dom.info);
	//кнопка вставки
	d.dom.btnUse = document.createElement("DIV");
	d.dom.btnUse.className = "item-btn use";
	d.dom.btnUse.innerHTML = this._config.titleUse;
	d.dom.self.appendChild(d.dom.btnUse);
	//кнопка предпросмотра
	d.dom.btnPreview = document.createElement("DIV");
	d.dom.btnPreview.className = "item-btn view";
	d.dom.btnPreview.title = "Посмотреть";
	d.dom.self.appendChild(d.dom.btnPreview);
	//кнопка редактирования
	d.dom.btnTitle = document.createElement("DIV");
	d.dom.btnTitle.className = "item-btn edit";
	d.dom.btnTitle.title = "Редактировать";
	d.dom.self.appendChild(d.dom.btnTitle);
	if (!i.pid) {
		//кнопка отображения копий
		d.dom.elCopies = document.createElement("DIV");
		d.dom.elCopies.className = "item-btn bchilds dis";
		d.dom.elCopies.title = "Показать копии";
		d.dom.self.appendChild(d.dom.elCopies);
	}
	//имя файла
	d.dom.path = document.createElement("DIV");
	d.dom.path.className = "item-path";
	d.dom.self.appendChild(d.dom.path);
	d.dom.path.innerHTML = i.filename;
	d.dom.path.title = (i.title ? (i.title + " ") : "" ) + (i.credit ? ("[Фото: " + i.credit + "]") : "");
	//кнопка удаления
	d.dom.btnDel = document.createElement("DIV");
	d.dom.btnDel.className = "item-btn del";
	d.dom.btnDel.title = "Удалить";
	d.dom.self.appendChild(d.dom.btnDel);
	//контейнер копий
	if (!i.pid) {
		d.dom.childs = document.createElement("DIV");
		d.dom.childs.className = "childs";
		d.dom.main.appendChild(d.dom.childs);
	}
	//события
	var l = this.plLib;
	d.e = [];
	l.eventAdd(d.dom.info, "mouseover", this.listItemInfoShow.bind(this, i, d.dom.info), d.e);
	l.eventAdd(d.dom.info, "mouseout", this.listItemInfoHide.bind(this, i), d.e);
	l.eventAdd(d.dom.btnUse, "click", this.onClickBtnListUse.bind(this, i), d.e);
	l.eventAdd(d.dom.btnPreview, "click", this.onClickBtnListPreview.bind(this, i), d.e);
	l.eventAdd(d.dom.btnTitle, "click", this.onClickBtnListEdit.bind(this, i), d.e);
	l.eventAdd(d.dom.elCopies, "click", this.onClickBtnListChilds.bind(this, i), d.e);
	l.eventAdd(d.dom.btnDel, "click", this.onClickBtnListDelete.bind(this, i), d.e);
	return d;
};
_media.prototype.listDOMItemUpdate = function(i) {
	if (typeof this._list[i.id] == "undefined") return;
	var d = this._list[i.id];
	d.dom.path.innerHTML = i.filename;
	d.dom.path.title = (i.title ? (i.title + " ") : "" ) + (i.credit ? ("[Автор: " + i.credit + "]") : "");
};
_media.prototype.listItemDataUpdate = function() {

};
_media.prototype.listItemInfoHide = function() {
	this.elListInfo.style.display = "none";
	this.elListInfo.childNodes[0].innerHTML = "";
};
_media.prototype.listItemInfoShow = function(i, btn) {
	i.dom.self.insertBefore(this.elListInfo, btn.nextSibling);
	if (typeof i.hoverInfo == "undefined") {
		i.hoverInfo = document.createElement("DIV");
		i.hoverInfo.innerHTML =
		"<b>Файл: " + i.filename + "</b><br />" +
		"Размер: " + i.bytes + " байт<br />" +
		"Разрешение: " + i.width + "x" + i.height + "<br />" +
		"Загружен: " + i.uploaded + "<br />" +
		"Превью: " + (i.type != "img" ? "недоступно" : "<br />");
		if (i.type == "img") {
			var el = document.createElement("DIV");
			el.style.maxWidth = "300px";
			el.style.maxHeight = "300px";
			el.style.overflow = "hidden";
			i.hoverInfo.appendChild(el);
			var im = document.createElement("IMG");
			im.style.display = "block";
			im.style.width = "160px";
			im.style.margin = "0 auto";
			im.src = i.url_thumb;
			el.appendChild(im);
		}
	}
	this.elListInfo.childNodes[0].appendChild(i.hoverInfo);
	this.elListInfo.style.display = "inline-block";
};
_media.prototype.listItemInsert = function(i) {
	var dts;
	for (var c in this._list.mapDt) {
		if (!this._list.mapDt.hasOwnProperty(c)) continue;
		dts = parseInt(c, 10);
		if (dts > i.dts) {
			var l = this._list.mapDt[dts].length;
			if ((l > 0) && (typeof this._list.mapDt[dts][l - 1] != "undefined")) {
				var id = this._list.mapDt[dts][l - 1];
				if ((typeof this._list.all[id] != "undefined") && this._list.all[id].dom.main.nextSibling) {
					this._list.all[id].dom.main.parentNode.insertBefore(i.dom.main, this._list.all[id].dom.main.nextSibling);
					return;
				}
			}
		}
	}
	this.elList.appendChild(i.dom.main);
};
_media.prototype.listItemsUpdate = function(l) {
	for (var c in this._listed) {
		if (!this._listed.hasOwnProperty(c)) continue;
		for (var c1 in this._listed[c].e) {
			if (!this._listed[c].e.hasOwnProperty(c)) continue;
			this.plLib.eventRemove(this._listed[c].e[c1]);
		}
	}
	var len = this._listed.length;
	for (var c = len; c > -1; c--) delete his._listed[c];
	this._listed = l;
	for (var c in this._listed) {
		if (!this._listed.hasOwnProperty(c)) continue;
		this.elList.appendChild(this._listed[c].dom.main);
	}
};
_media.prototype.listPagerUpdate = function(def) {
	var d = def.toString();
	var l = this.elListPerTime.options.length;
	var pos = -1;
	var f = false;
	for (var c = 0; c < l; c++) {
		if ((pos == -1) && (parseInt(this.elListPerTime.options[c].value, 10) > def)) pos = c;
		if (this.elListPerTime.options[c].value == d) {
			this.elListPerTime.options[c].selected = true;
			f = true;
			break;
		}
	}
	if (!f) this.elListPerTime.insertBefore(new Option(def, def, true, true), this.elListPerTime.childNodes[pos]);
};
_media.prototype.listViewUpdate = function() {
	var subset = this.elListSubset.value;
	var subsetOrd, hi, si;
	if (subset == "own") {
		subsetOrd = 0;
		hi = this._list.shared;
		si = this._list.own;
	} else {
		subsetOrd = 1;
		hi = this._list.own;
		si = this._list.shared;
	}
	for (var c in hi) {
		if (!hi.hasOwnProperty(c)) continue;
		hi[c].dom.main.style.display = "none";
	}
	var count = 0;
	var type = this.elListFTypes.value;
	var ipp = parseInt(this.elListPerTime.value, 10);
	if (this._list.pager.vis.length) this._list.pager.vis.splice(0, this._list.pager.vis.length);
	var list = [];
	this._list.pager.vis = [];
	for (var c in si) {
		if (!si.hasOwnProperty(c)) continue;
		if ((si[c].type == type) || (type == "any")) {
			count++;
			list.push(si[c]);
			if (((count - 1) >= (ipp * this._list.pager.cur)) && ((count - 1) < (ipp * this._list.pager.cur + ipp)))
				si[c].dom.main.style.display = "";
			else
				si[c].dom.main.style.display = "none";
		} else {
			si[c].dom.main.style.display = "none";
		}
	}
	this._list.pager.tot = parseInt(count/ipp, 10);
	if (this._list.pager.tot > 0) {
		if (this._list.pager.tot * ipp < count) this._list.pager.tot++;
		if ((this._list.pager.tot - 1) < this._list.pager.cur)
			this._list.pager.cur = this._list.pager.tot - 1;
		for (var c = this._list.pager.cur * ipp; c < (this._list.pager.cur * ipp + ipp); c++) {
			if (typeof list[c] == "undefined") break;
			list[c].dom.main.style.display = "";
			this._list.pager.vis.push(list[c]);
		}
		this.elListTurnNum.innerHTML = "" + (this._list.pager.cur + 1) + "/" + (this._list.total[type][subsetOrd] ? this._list.pager.tot : "...");
		this.elListBtnForw.className = "btn-turn forw" + ((this._list.pager.cur + 1) > 1 ? "" : " dis");
		this.elListBtnBack.className = "btn-turn back" + ((this._list.pager.cur + 1) < this._list.pager.tot ? "" : (this._list.total[type][subsetOrd] ? " dis" : ""));
	} else {
		this._list.pager.cur = -1;
		this.elListTurnNum.innerHTML = "0/" + (this._list.total[type][subsetOrd] ? "0" : "...");
		this.elListBtnForw.className = "btn-turn forw dis";
		this.elListBtnBack.className = "btn-turn back" + (this._list.total[type][subsetOrd] ? " dis" : "");
	}
	return (this._list.pager.tot * ipp - count);
};
_media.prototype.onCbPreview = function(action, data) {
	switch(action) {
		case "crop":
			this._actionSilentCrop(data);
			break;
		case "embed":
			this.tabSet("list");
			this.exitDone(data, "embed");
			break;
		case "link":
			this.tabSet("list");
			this.exitDone(data, "link");
			break;
	}
};
_media.prototype.onCbUploader = function(action, data) {
	switch(action) {
		case "loaded":
			var tab;
			var it = false;
			for (var c in this._tabs) {
				if (!this._tabs.hasOwnProperty(c)) continue;
				if (this._tabs[c].name == "upload") continue;
				if (this._tabs[c].name == "item") it = this._tabs[c];
				this._tabs[c].btn.className = "tab-btn";
			}
			if ((it !== false) && !this.plPreview.rendered()) it.btn.className = it.btn.className + " dis";
			if (data.res) {
				var item = data.item;
				item.childs = [];
				if (data.entity && (data.entity == this._config.entity))
					this._list.own.splice(0, 0, item);
				else {
					if (data.entity !== 0) {
						this.console(__name_script + " > [" + this.$name + "].onCbUploader('loaded'): Предупреждение - получены мета-данные файла, принадлежащего другому объекту модуля [" + data.entity + "].");
						return;
					}
					this._list.shared.splice(0, 0, item);
				}
				this._list.all[item.id] = item;
				this.findType(item);
				this.fileName(item);
				this.listDOMItem(item);
				if (this.elList.childNodes.length)
					this.elList.insertBefore(item.dom.main, this.elList.childNodes[0]);
				else
					this.elList.appendChild(item.dom.main);
				this.listViewUpdate();
				this.tabSet("item");
				this.plPreview.render(item);
				this._domUploadEdit.elFieldCredit.value = "";
				this._domUploadEdit.elFieldName.value = "";
				this._domUploadEdit.elFieldNoId.checked = false;
				this._domUploadEdit.elFieldNoSizes.checked = false;
				this._domUploadEdit.elFieldTitle.value = "";
				this.onClickChkUploadEdit();
			}
			break;
		case "load-before":
			var parts = data.toLowerCase().split(".");
			if (!parts.length) return {canuse: false, msg: "Выбран неверный тип файла!"};
			var ext = parts[parts.length - 1];
			var found = false;
			for (var c in this._config.types) {
				if (!this._config.types.hasOwnProperty(c)) continue;
				if (this._config.types[c] == ext) {
					found = true;
					break;
				}
			}
			if (!found) return {canuse: false, msg: "Выбран неверный тип файла! Разрешены [" + this._types[this._config.typeSet].title + "/(" + this._config.types.join(",") + ")]"};
			var res = {};
			res.canuse = true;
			res.credit = this._domUploadEdit.elFieldCredit.value;
			res.name = this._domUploadEdit.elFieldName.value;
			res.noid = this._domUploadEdit.elFieldNoId.checked ? "1" : "0";
			res.nosizes = this._domUploadEdit.elFieldNoSizes.checked ? "1" : "0";
			res.title = this._domUploadEdit.elFieldTitle.value;
			return res;
		case "load-start":
			var tab;
			for (var c in this._tabs) {
				if (!this._tabs.hasOwnProperty(c)) continue;
				if (this._tabs[c].name == "upload") continue;
				this._tabs[c].btn.className = "tab-btn dis";
			}
			break;
		case "ready":
			this.elUpload.appendChild(this.plUploader.dom());
			break;
	}
};
_media.prototype.onCbCropper = function() {
	//пока что не реализован
};
_media.prototype.onChangeInputListEdit = function() {
	this.onClickChkListEdit();
};
_media.prototype.onChangeInputListSelect = function() {
	if (this._list.pager.cur == -1) this._list.pager.cur = 0;
	this.listViewUpdate();
};
_media.prototype.onChangeInputUploadEdit = function() {
	this.onClickChkUploadEdit();
};
_media.prototype.onClickBtnListChilds = function(i) {
	if (i.dom.elCopies.className.indexOf("dis") != -1) return;
	if ((i != this._list.expanded) && (this._list.expanded)) {
		this._list.expanded.dom.main.className = "item main";
		this._list.expanded = i;
	}
	if (i.dom.main.className.indexOf("expanded") == -1)
		i.dom.main.className = "item main expanded";
	else
		i.dom.main.className = "item main";

};
_media.prototype.onClickBtnListDelete = function(i) {
};
_media.prototype.onClickBtnListEdit = function(i) {
	if (this._domListEdit._pu == -1) {
		var msg = "Ошибка создания модального окна [" + __name_popup + "]";
		alert(msg);
		this.console(__name_script + " > [" + this.$name + "].onClickBtnListEdit(): " + msg);
		return;
	}
	if (typeof i != "object") return;
	this._domListEdit._i = i;
	this._domListEdit.elFieldCredit.value = i.credit;
	this._domListEdit.elFieldName.value = i.name;
	this._domListEdit.elFieldTitle.value = i.title;
	this._domListEdit.elFieldNameView.innerHTML = i.filename;
	this._domListEdit.elFieldNoId.checked = !i.name_id;
	this._domListEdit.elFieldNoSizes.checked = false;
	if (i.type != "img") {
		this._domListEdit.elFieldNoSizes.parentNode.style.display = "none";
	} else this._domListEdit.elFieldNoSizes.checked = !i.name_sized;
	this.plPu.show(this._domListEdit._pu);
};
_media.prototype.onClickBtnListEditCancel = function() {
	this._domListEdit._i = null;
	this._domListEdit.elFieldCredit.value = "";
	this._domListEdit.elFieldName.value = "";
	this._domListEdit.elFieldTitle.value = "";
	this._domListEdit.elFieldNameView.innerHTML = "";
	this._domListEdit.elBtnExpert.style.display = "block";
	this._domListEdit.elExpert.style.display = "none";
	this._domListEdit.elFieldNoId.checked = false;
	this._domListEdit.elFieldNoSizes.checked = false;
	this._domListEdit.elFieldNoSizes.parentNode.style.display = "block";
	this.plPu.hide(this._domListEdit._pu);
};
_media.prototype.onClickBtnListEditConfirm = function() {
	if (!this._domListEdit.elFieldName.value && this._domListEdit.elFieldNoId.checked) {
		alert("Невозможно исключить ID из полного имени файла, если пользовательское имя не задано!");
		this._domListEdit.elFieldNoId.checked = false;
		if (!confirm("Продолжить операцию с использованием ID?")) return;
	}
	this._domListEdit.elImgWait.style.display = "block";
	this._domListEdit.elBtnOk.parentNode.style.display = "none";
	this._actionSilentEdit();
};
_media.prototype.onClickBtnListEditExpert = function() {
	this._domListEdit.elBtnExpert.style.display = "none";
	this._domListEdit.elExpert.style.display = "block";
};
_media.prototype.onClickBtnListExit = function() {
	this.exit();
};
_media.prototype.onClickBtnListPreview = function(i) {
	this.tabSet("item");
	this.plPreview.render(i);
};
_media.prototype.onClickBtnListUse = function(i) {
	this.exitDone(i);
};
_media.prototype.onClickBtnListTurn = function(inc, e) {
	e = this.plLib.eventFix(e);
	if (e.target.className.indexOf("dis") != -1) return;
	if (inc === 1) {
		if (this._list.pager.cur == (this._list.pager.tot - 1)) {
			e.target.className = e.target.className + " dis";
			var type = this.elListFTypes.value;
			var subset = (this.elListSubset.value == "own" ? 0 : 1);
			if (!this._list.total[type][subset]) {
				if (this._list.pager.cur == -1) {
					var refid = 0;
					var count = parseInt(this.elListPerTime.value, 10);
				} else {
					var len = this._list.pager.vis.length;
					var refid = ((type == "any") ? this._list.mapLast[this.elListSubset.value] : this._list.pager.vis[len - 1].id);
					var ipp = parseInt(this.elListPerTime.value, 10);
					var count = ipp + (ipp - len);
				}
				this._actionSilentMore(refid, this.elListSubset.value, type, count);
			}
			return;
		}
	}
	this._list.pager.cur += inc;
	if (this._list.pager.cur < 0) this._list.pager.cur = 0;
	if (this._list.pager.cur > (this._list.pager.tot - 1)) this._list.pager.cur = (this._list.pager.tot - 1)
	this.listViewUpdate();
};
_media.prototype.onClickBtnTab = function(tab) {
	if (tab.btn.className.indexOf("dis") != -1) return;
	this.tabSet(tab.name);
};
_media.prototype.onClickBtnUploadEditExpert = function() {
	this._domUploadEdit.elBtnExpert.style.display = "none";
	this._domUploadEdit.elExpert.style.display = "block";
};
_media.prototype.onClickChkListEdit = function() {
	if (!this._domListEdit.elFieldName.value && this._domListEdit.elFieldNoId.checked) {
		alert("Невозможно исключить ID из полного имени файла, если пользовательское имя не задано!");
		this._domListEdit.elFieldNoId.checked = false;
	}
	this._domListEdit.elFieldNameView.innerHTML = (this._domListEdit.elFieldName.value ? (((!this._domListEdit.elFieldNoId.checked) ? (this._domListEdit._i.id + this._domListEdit._i.size_delim) : "") + this._domListEdit.elFieldName.value) : this._domListEdit._i.id) + (this._domListEdit._i.type == "img" ? ((!this._domListEdit.elFieldNoSizes.checked) ? (this._domListEdit._i.size_delim + this._domListEdit._i.width + "x" + this._domListEdit._i.height) : "") : "") + "." + this._domListEdit._i.extension;
};
_media.prototype.onClickChkUploadEdit = function() {
	if (!this._domUploadEdit.elFieldName.value && this._domUploadEdit.elFieldNoId.checked) {
		alert("Невозможно исключить ID из полного имени файла, если пользовательское имя не задано!");
		this._domUploadEdit.elFieldNoId.checked = false;
	}
	this._domUploadEdit.elFieldNameView.innerHTML = (this._domUploadEdit.elFieldName.value ? (((!this._domUploadEdit.elFieldNoId.checked) ? ("id-") : "") + this._domUploadEdit.elFieldName.value) : "id") + ((!this._domUploadEdit.elFieldNoSizes.checked) ? ("-NNNxNNN") : "") + ".ext";
};
_media.prototype.onWindowResize = function(e) {
	if (typeof e == "undefined") {
		if (this._resize.tm) {
			this._resize.tm = null;
			this._resize.ev = null;
		}
		var ps = this.plLib.pageSize();
		this.elMain.style.width = "" + Math.round(ps.ww / 2) + "px";
		for (var c in this._tabs) {
			if (!this._tabs.hasOwnProperty(c)) continue;
			if (typeof this._tabs[c].cont != "undefined") this._tabs[c].cont.style.height = "" + (ps.wh - 120) + "px";
		}
		this.elList.style.height = "" + (ps.wh - 120 - 36) + "px";
		this.plPreview.resize(ps.wh - 120);
	} else {
		if (this._resize.tm) window.clearTimeout(this._resize.tm);
		this._resize.tm = window.setTimeout(this._resize.fn, 50);
		this._resize.ev = e;
	}
};
_media.prototype.show = function() {
	if (!this._inited || this._initErr) {
		var msg = __name_script + " > [" + this.$name + "].show(): Невозможно показать диалог - плагин еще не инициализирован или инициализирован с ошибкой.";
		this.console(msg);
		this.dlgAlert(msg, "err");
		return;
	}
	if (this._pu == -1) {
		var msg = __name_script + " > [" + this.$name + "].show(): Невозможно показать диалог - оишбка создания модального окна.";
		this.console(msg);
		this.dlgAlert(msg, "err");
		return;
	}
	this.plPu.show(this._pu);
	this.onWindowResize();
	if (!this._displayed) {
		this._displayed = true;
		this._actionSilentList();
	}
};
_media.prototype.tabFind = function(name, obj) {
	if (typeof obj != "boolean") obj = false;
	var ind = -1;
	for (var c in this._tabs) {
		if (!this._tabs.hasOwnProperty(c)) continue;
		if (this._tabs[c].name == name) {
			ind = parseInt(c, 10);
			break;
		}
	}
	if (ind == -1 || isNaN(ind)) return false;
	if (obj) return this._tabs[ind];
	else return this._tabs[ind].cont;
};
_media.prototype.tabSet = function(tab, pTabDis) {
	if (typeof pTabDis != "boolean") pTabDis = false;
	var pTab = this.tabFind(this._tab, true);
	var nTab = this.tabFind(tab, true);
	if (!pTab || !nTab) return;
	pTab.btn.className = "tab-btn" + (pTabDis ? " dis" : "");
	pTab.cont.className = "tab";
	nTab.btn.className = "tab-btn act";
	nTab.cont.className = "tab vis";
	this._tab = tab;
};
render.pluginRegisterProto(_media, __name_admin_media);
//-----------------------  /plugin -------------------------//

// ---------------- plugin media-preview -------------------//
(function(){
var _preview = function() {
	this._config			=	{
		_loaded:				false,
		cbOnCrop:				false,
		cbOnEmbed:				false,
		cbOnLink:				false,
		wrapper:				false
	};
	this._dom 				=	{
		_i:						null,
		_im:					null,
		_copies:				[],
		_data:					{
			drag:				false,
			curX:				0,
			curY:				0,
			startX:				0,
			startY:				0,
			zoom:				100
		},
		funcAlign:				null,
		funcDrag:				null,
		funcFit:				null,
		funcLink:				null,
		funcOnZoomEnd:			null,
		funcOrig:				null,
		funcZIn:				null,
		funcZOut:				null,
		elCopies:				null,
		elCopiesWaiter:			null,
		elCrop:					null,
		elImg:					null,
		elInfo:					null,
		elInfoBtnUse:			null,
		elInfoMime:				null,
		elInfoName:				null,
		elInfoPath:				null,
		elInfoSize:				null,
		elMain:					null,
		elMove:					null,
		elOrig:					null,
		elOrigImg:				null,
		elOrigBtnCrop:			null,
		elTitle:				null,
		elTools:				null,
		elToolBtnAlign:			null,
		elToolBtnOrig:			null,
		elToolBtnFit:			null,
		elToolBtnZIn:			null,
		elToolBtnZOut:			null
	};
	this._initErr			=	false;
	this._inited			=	false;
	this.$name				=	__name_admin_media_preview;
	this.$nameOwner			=	__name_admin_media;
	this.$nameProto			=	this.$name;
	this._pu				=	-1;
	this._rendered			=	false;
	this.plCropper			=	null;
	this.plLib				=	null;
	this.plMsgr				=	null;
	this.plOwner			=	null;
	this.plPu				=	null;
	this.plRender			=	null;
	this.pliCropper			=	null;
};
_preview.prototype._configImport = function(cfg) {
	if ((typeof cfg == "object") && cfg) {
		for (var c in this._config) {
			if (!this._config.hasOwnProperty(c)) continue;
			if (typeof cfg[c] != "undefined") {
				switch(c) {
					case "_loaded":
						break;
					case "cbOnCrop":
					case "cbOnEmbed":
					case "cbOnLink":
						if (typeof cfg[c] == "function") this._config[c] = cfg[c];
						break;
					case "wrapper":
						if (typeof cfg["wrapper"] == "object") this._config.wrapper = cfg.wrapper;
						break;
				}
			}
		}
	} else return false;
	this._config._loaded = true;
	return true;
};
_preview.prototype._init = function(last, config, parent) {
	if (this._inited) return true;
	if (typeof last != "boolean") last = false;
	if (!this.plOwner) {
		if ((typeof parent == "object") && parent) {
			this.plOwner = parent;
			this.plLib = parent.getPlLib();
			this.plMsgr = parent.getPlMsgr();
			this.plPu = parent.getPlPu();
		}
	}
	if (typeof config == "boolean") config = {};
	if (this.waitConfig(config, last, "_configImport")) return this._inited;
	if (this.waitPlugin(__name_admin_media_cropper, "plCropper", last));
	this.DOM();
	this._inited = true;
	return true;
};
_preview.prototype.DOM = function() {
	if (!this._config.wrapper) {
		var msg = "Невозможно создать предпросмотр - контейнер не задан!";
		this.console(__name_script + " > [" + this.$name + "].DOM(): " + msg);
		this.dlgAlert(msg, "err");
		return;
	}
	// -------------------------- перьвью --------------------------------
	this._dom.elMain = document.createElement("DIV");
	this._dom.elMain.className = "preview no-tools";
	this._config.wrapper.appendChild(this._dom.elMain);
	// -------------------------- copies -------------------------------
	this._dom.elCrop = document.createElement("DIV");
	this._dom.elCrop.className = "copies";
	this._dom.elCrop.style.display = "none";
	this._dom.elMain.appendChild(this._dom.elCrop);
	var el1 = document.createElement("DIV");
	el1.className = "title";
	el1.innerHTML = "Оригинал";
	this._dom.elCrop.appendChild(el1);
	this._dom.elOrig = document.createElement("DIV");
	this._dom.elOrig.className = "orig";
	this._dom.elCrop.appendChild(this._dom.elOrig);
	//кнопка создания копии
	var el3 = document.createElement("DIV");
	el3.className = "rel";
	this._dom.elOrig.appendChild(el3);
	this._dom.elOrigBtnCrop = document.createElement("DIV");
	this._dom.elOrigBtnCrop.className = "btn-crop";
	this._dom.elOrigBtnCrop.title = "Создать экземпляр";
	el3.appendChild(this._dom.elOrigBtnCrop);
	this.plLib.eventAdd(this._dom.elOrigBtnCrop, "click", this.onClickBtnCrop.bind(this));
	//главное изображение
	this._dom.elOrigImg = document.createElement("IMG");
	this._dom.elOrigImg.src = this.plLib.getImage("empty");
	this._dom.elOrig.appendChild(this._dom.elOrigImg);
	this.plLib.eventAdd(this._dom.elOrigImg, "click", this.onClickImgOrig.bind(this));
	//заголовок копий
	el1 = document.createElement("DIV");
	el1.className = "title";
	el1.innerHTML = "Экземпляры";
	this._dom.elCrop.appendChild(el1);
	this._dom.elCopies = document.createElement("DIV");
	this._dom.elCopies.className = "clist";
	this._dom.elCrop.appendChild(this._dom.elCopies);
	this._dom.elCopiesWaiter = document.createElement("DIV");
	this._dom.elCopiesWaiter.className = "copy";
	//this._dom.elCopiesWaiter.style.display = "none";
	var img = document.createElement("IMG");
	img.src = this.plLib.getImage("loading");
	img.style.width = "16px";
	img.style.padding = "82px";
	img.style.backgroundColor = "#fff";
	img.style.cursor = "default";
	this._dom.elCopiesWaiter.appendChild(img);
	this._dom.elCopiesWaiter.style.display = "none";
	this._dom.elCopies.appendChild(this._dom.elCopiesWaiter);
	// -------------------------- /copies ------------------------------
	// ------------------------- preview big ------------------------------
	el = document.createElement("DIV");
	el.className = "big";
	this._dom.elMain.appendChild(el);
	this._dom.elTitle = document.createElement("DIV");
	this._dom.elTitle.className = "title";
	el.appendChild(this._dom.elTitle);
	this._dom.elCanvas = document.createElement("DIV");
	this._dom.elCanvas.className = "canvas";
	el.appendChild(this._dom.elCanvas);
	//обработчик перетаскиваний
	this._dom.funcDrag = (function() {
		if (this._dom.elMain.className != "preview") return;
		var e = arguments.callee.arguments[1];
		e = this.plLib.eventFix(e);
		switch (e.type) {
			case "mousedown":
				this._dom._data.drag = true;
				if (!this._dom.elImg.style.left) this._dom._data.curX = 0;
				else this._dom._data.curX = parseInt(this._dom.elImg.style.left, 10);
				if (!this._dom.elImg.style.top) this._dom._data.curY = 0;
				else this._dom._data.curY = parseInt(this._dom.elImg.style.top, 10);
				this._dom._data.startX = e.offsetX;
				this._dom._data.startY = e.offsetY;
				break;
			case "mousemove":
				if (this._dom._data.drag) {
					var x = this._dom._data.curX + (e.offsetX - this._dom._data.startX);
					if (x < 0) x = "-" + (x*-1);
					var y = this._dom._data.curY + (e.offsetY - this._dom._data.startY);
					if (y < 0) y = "-" + (y*-1);
					this._dom.elImg.style.left = x + "px";
					this._dom.elImg.style.top = y + "px";
				}
				break;
			case "mouseout":
				this._dom._data.drag = false;
				break;
			case "mouseup":
				this._dom._data.drag = false;
				break;
		}
	}).bind(this);
	//обработчик кликов по кнопками канвы
	var f = function(btn) {
		var cmd = btn.innerHTML;
		if (cmd == "LT") {
			this._dom.elImg.style.left = "0";
			this._dom.elImg.style.top = "0";
			return;
		}
		var cw = this._dom.elCanvas.clientWidth;
		var z = this._dom._data.zoom;
		var nz = 100;
		switch (cmd) {
			case "+":
				nz = parseInt((parseInt(z/5, 10) * 5), 10) + 5;
				break;
			case "-":
				nz = parseInt((parseInt(z/5, 10) * 5), 10) - 5;
				break;
			case "Fit":
				nz = Math.round((cw/this._dom._i.width) * 10000) / 100;
				break;
			case "100%":
				nz = 100;
				break;
		}
		if (nz > 200) nz = 200;
		if (nz < 10) nz = 10;
		this._dom._data.zoom = nz;
		var curX, curY, curW, curH;
		if (!this._dom.elImg.style.left) curX = 0;
		else curX = parseInt(this._dom.elImg.style.left, 10);
		if (!this._dom.elImg.style.top) curY = 0;
		else curY = parseInt(this._dom.elImg.style.top, 10);
		curW = this._dom.elImg.width;
		curH = this._dom.elImg.height;
		var newX, newY, newW, newH;
		newW = nz * this._dom._i.width / 100;
		newH = nz * this._dom._i.height / 100;
		newX = curX - ((newW - curW) / 2);
		if (newX < 0) newX = "-" + (newX*-1);
		newY = curY - ((newH - curH) / 2);
		if (newY < 0) newY = "-" + (newY*-1);
		this._dom.elImg.width = newW;
		if (cmd == "Fit") {
			this._dom.elImg.style.left = "0";
			this._dom.elImg.style.top = "0";
		} else {
			this._dom.elImg.style.left = newX + "px";
			this._dom.elImg.style.top = newY + "px";
		}
		this._dom.elZoomSpan.innerHTML = nz + "%";
		$(this._dom.elZoom).stop(true, true);
		this._dom.elZoom.style.opacity = 1;
		this._dom.elZoom.style.display = "block";
		$(this._dom.elZoom).animate({opacity: 0}, 2000, this._dom.funcOnZoomEnd);
	};
	this.plLib.eventAdd(this._dom.elCanvas, "mousedown", this._dom.funcDrag);
	this.plLib.eventAdd(this._dom.elCanvas, "mouseout", this._dom.funcDrag);
	this.plLib.eventAdd(this._dom.elCanvas, "mouseup", this._dom.funcDrag);
	this._dom.elImg = document.createElement("IMG");
	this._dom.elCanvas.appendChild(this._dom.elImg);
	//zoom label
	this._dom.elZoom = document.createElement("DIV");
	this._dom.elZoom.className = "zoom";
	this._dom.elZoom.style.display = "none";
	this._dom.elZoom.style.opacity = "0";
	this._dom.elCanvas.appendChild(this._dom.elZoom);
	//функция funcOnZoomEnd
	this._dom.funcOnZoomEnd = (function(el){
		el.style.display = "none";
	}).bind(this, this._dom.elZoom);
	//---
	this._dom.elZoomSpan = document.createElement("SPAN");
	this._dom.elZoom.appendChild(this._dom.elZoomSpan);
	//обработчик перетаскивания
	this._dom.elMove = document.createElement("DIV");
	this._dom.elMove.className = "move";
	this._dom.elCanvas.appendChild(this._dom.elMove);
	//тулбар
	this._dom.elTools = document.createElement("DIV");
	this._dom.elTools.className = "tools";
	this._dom.elCanvas.appendChild(this._dom.elTools);
	//кнопка Выровнять
	this._dom.elToolBtnAlign = document.createElement("DIV");
	this._dom.elToolBtnAlign.className = "img-btn";
	this._dom.elToolBtnAlign.title = "Выровнять по левому верхнему углу";
	this._dom.elToolBtnAlign.innerHTML = "LT";
	this._dom.elTools.appendChild(this._dom.elToolBtnAlign);
	this._dom.funcAlign = f.bind(this, this._dom.elToolBtnAlign);
	this.plLib.eventAdd(this._dom.elToolBtnAlign, "click", this._dom.funcAlign);
	//разделитель
	el3 = document.createElement("DIV");
	el3.className = "img-btn-sect";
	this._dom.elTools.appendChild(el3);
	//кнопка Исходный размер
	this._dom.elToolBtnOrig = document.createElement("DIV");
	this._dom.elToolBtnOrig.className = "img-btn";
	this._dom.elToolBtnOrig.title = "Исходный размер";
	this._dom.elToolBtnOrig.innerHTML = "100%";
	this._dom.elTools.appendChild(this._dom.elToolBtnOrig);
	this._dom.funcOrig = f.bind(this, this._dom.elToolBtnOrig);
	this.plLib.eventAdd(this._dom.elToolBtnOrig, "click", this._dom.funcOrig);
	//разделитель
	el3 = document.createElement("DIV");
	el3.className = "img-btn-sect";
	this._dom.elTools.appendChild(el3);
	//кнопка Подогнать
	this._dom.elToolBtnFit = document.createElement("DIV");
	this._dom.elToolBtnFit.className = "img-btn";
	this._dom.elToolBtnFit.title = "Подогнать по рамке";
	this._dom.elToolBtnFit.innerHTML = "Fit";
	this._dom.elTools.appendChild(this._dom.elToolBtnFit);
	this._dom.funcFit = f.bind(this, this._dom.elToolBtnFit);
	this.plLib.eventAdd(this._dom.elToolBtnFit, "click", this._dom.funcFit);
	//разделитель
	el3 = document.createElement("DIV");
	el3.className = "img-btn-sect";
	this._dom.elTools.appendChild(el3);
	//кнопка Уменьшить
	this._dom.elToolBtnZOut = document.createElement("DIV");
	this._dom.elToolBtnZOut.className = "img-btn bigger";
	this._dom.elToolBtnZOut.title = "Уменьшить (-5%)";
	this._dom.elToolBtnZOut.innerHTML = "-";
	this._dom.elTools.appendChild(this._dom.elToolBtnZOut);
	this._dom.funcZOut = f.bind(this, this._dom.elToolBtnZOut);
	this.plLib.eventAdd(this._dom.elToolBtnZOut, "click", this._dom.funcZOut);
	//разделитель
	el3 = document.createElement("DIV");
	el3.className = "img-btn-sect";
	this._dom.elTools.appendChild(el3);
	//кнопка Увеличить
	this._dom.elToolBtnZIn = document.createElement("DIV");
	this._dom.elToolBtnZIn.className = "img-btn bigger";
	this._dom.elToolBtnZIn.title = "Увеличить (+5%)";
	this._dom.elToolBtnZIn.innerHTML = "+";
	this._dom.elTools.appendChild(this._dom.elToolBtnZIn);
	this._dom.funcZIn = f.bind(this, this._dom.elToolBtnZIn);
	this.plLib.eventAdd(this._dom.elToolBtnZIn, "click", this._dom.funcZIn);
	// ------------------------- /preview ------------------------------
	// ---------------------------- info ---------------------------------
	this._dom.elInfo = document.createElement("DIV");
	this._dom.elInfo.className = "info";
	this._dom.elCanvas.appendChild(this._dom.elInfo);
	//имя файла
	el = document.createElement("DIV");
	el.className = "field";
	this._dom.elInfo.appendChild(el);
	el1 = document.createElement("DIV");
	el1.className = "fname";
	el1.innerHTML = "Имя файла:";
	el.appendChild(el1);
	this._dom.elInfoName = document.createElement("DIV");
	this._dom.elInfoName.className = "fvalue";
	el.appendChild(this._dom.elInfoName);
	//размер
	el = document.createElement("DIV");
	el.className = "field";
	this._dom.elInfo.appendChild(el);
	el1 = document.createElement("DIV");
	el1.className = "fname";
	el1.innerHTML = "Размер:";
	el.appendChild(el1);
	this._dom.elInfoSize = document.createElement("DIV");
	this._dom.elInfoSize.className = "fvalue";
	el.appendChild(this._dom.elInfoSize);
	//путь на сервере
	el = document.createElement("DIV");
	el.className = "field";
	this._dom.elInfo.appendChild(el);
	el1 = document.createElement("DIV");
	el1.className = "fname";
	el1.innerHTML = "Путь на сервере:";
	el.appendChild(el1);
	this._dom.elInfoPath = document.createElement("DIV");
	this._dom.elInfoPath.className = "fvalue";
	el.appendChild(this._dom.elInfoPath);
	//MIME, расширение
	el = document.createElement("DIV");
	el.className = "field";
	this._dom.elInfo.appendChild(el);
	el1 = document.createElement("DIV");
	el1.className = "fname";
	el1.innerHTML = "MIME-тип, расширение:";
	el.appendChild(el1);
	this._dom.elInfoMime = document.createElement("DIV");
	this._dom.elInfoMime.className = "fvalue";
	el.appendChild(this._dom.elInfoMime);
	//кнопка вставки
	el = document.createElement("DIV");
	el.className = "field";
	this._dom.elInfo.appendChild(el);
	this._dom.elInfoBtnUse = document.createElement("DIV");
	this._dom.elInfoBtnUse.className = "btn-use";
	this._dom.elInfoBtnUse.innerHTML = "Вставить ссылку";
	el.appendChild(this._dom.elInfoBtnUse);
	this._dom.funcLink = (function() {
		if (typeof this._config.cbOnLink == "function") this._config.cbOnLink(this._dom._i);
	}).bind(this);
	this.plLib.eventAdd(this._dom.elInfoBtnUse, "click", this._dom.funcLink);
	// ---------------------------- /info ---------------------------------
};
_preview.prototype.DOMEdit = function(p, i) {
	p.dom.elMain = document.createElement("DIV");
	p.dom.elMain.className = "copy";
	p.dom.elImg = document.createElement("IMG");
	p.dom.elImg.src = i.url_thumb;
	p.dom.elMain.appendChild(p.dom.elImg);
	//кнопка редактирования
	p.dom.elBtnEdit = document.createElement("DIV");
	p.dom.elBtnEdit.className = "btn-edit";
	p.dom.elBtnEdit.title = "Редактировать";
	p.dom.elMain.appendChild(p.dom.elBtnEdit);
	//кнопка редактирования
	p.dom.elBtnDel = document.createElement("DIV");
	p.dom.elBtnDel.className = "btn-del";
	p.dom.elBtnDel.title = "Удалить";
	p.dom.elMain.appendChild(p.dom.elBtnDel);
};
_preview.prototype.copies = function(i) {
	if (this._dom._im && this._dom._im.type == "img") {
		this._dom.elOrigImg.src = this.plLib.getImage("empty");
		var it;
		for (var c in this._dom._copies) {
			if (!this._dom._copies.hasOwnProperty(c)) continue;
			it = this._dom._copies[c];
			this.plLib.eventRemove(it.dom.elBtnDel, "click", it.funcDel);
			this.plLib.eventRemove(it.dom.elBtnEdit, "click", it.funcEdit);
			this.plLib.eventRemove(it.dom.elImg, "click", it.funcSet);
			delete it.funcDel;
			delete it.funcEdit;
			delete it.funcSet;
			it.dom.elMain.parentNode.removeChild(it.dom.elMain);
		}
		this._dom._copies = [];
		this._dom._im = null;
	}
	if (i) {
		if (i.type != "img") return;
		this._dom._im = i;
		this._dom.elOrigImg.src = i.url_thumb;
		var it;
		var p;
		for (var c in this._dom._im.childs) {
			if (!this._dom._im.childs.hasOwnProperty(c)) continue;
			it = this._dom._im.childs[c];
			p = {dom: {elMain: null, elBtnDel: null, elBtnEdit: null, elImg: null}, funcDel: null, funcEdit: null, funcSet: null};
			//p.funcDel = this.onClickBtnListDelete.bind(this, it);
			//p.funcEdit = this.onClickBtnListEdit.bind(this, it);
			p.funcSet = this.reset.bind(this, it);
			this.DOMTabItemCopy(p, it);
			//this.plLib.eventAdd(p.dom.elBtnDel, "click", p.funcDel);
			//this.plLib.eventAdd(p.dom.elBtnEdit, "click", p.funcEdit);
			this.plLib.eventAdd(p.dom.elImg, "click", p.funcSet);
			this._dom.elCopies.appendChild(p.dom.elMain);
			this._dom._copies.push(p);
		}
	}
};
_preview.prototype.onClickBtnCrop = function() {
	if (!this.pliCropper)
		this.pliCropper = this.plCropper.create({
			cbOnCancel: this.onCbCropper.bind(this, "cancel"),
			cbOnDone: this.onCbCropper.bind(this, "crop"),
			imgUrl: this._dom._i.url,
			imgSize: {w: this._dom._i.width, h: this._dom._i.height},
			title: "Обрезка изображения"
		});
	else
		this.pliCropper.reInit({
			imgUrl: this._dom._i.url,
			imgSize: {w: this._dom._i.width, h: this._dom._i.height},
		});
	this.pliCropper.show();
};
_preview.prototype.onClickBtnCroppedDel = function(i) {
	//this.actionImgCroppedDel(i);
};
_preview.prototype.onClickImgOrig = function() {
	if (this._dom._i == this._dom._im) return;
	this.reset(this._dom._im);
};
_preview.prototype.onCbCropper = function(action, data) {
	switch (action) {
		case "crop":
			if (typeof this._config.cbOnCrop == "function") {
				try {
					this._config.cbOnCrop(data);
					this._dom.elCopiesWaiter.style.display = "block";
				} catch(e) {
					this.console(__name_script + " > " + this.$name + ".onCbCropper('crop'): Ошибка выполнения callback-функции [initiator].cbOnCrop() [" + e.name + "/" + e.message + "]");
				}
			}
			break;
		case "cancel":
			break;
	}
};
_preview.prototype.render = function(i) {
	this._rendered = true;
	if (this._dom._i == i) return;
	this.reset(i);
	this.copies(i);
};
_preview.prototype.rendered = function() {
	return this._rendered;
};
_preview.prototype.reset = function(i) {
	if (typeof i == "undefined") i = false;
	if (this._dom._i) {
		if (this._dom._i.type == "img") {
			this.plLib.eventRemove(this._dom.elCanvas, "mousemove", this._dom.funcDrag);
			this._dom._data.drag = false;
			this._dom._data.curX = 0;
			this._dom._data.curY = 0;
			this._dom._data.startX = 0;
			this._dom._data.startY = 0;
			this._dom._data.zoom = 100;
			this._dom.elImg.style.left = "0";
			this._dom.elImg.style.top = "0";
			this._dom.elImg.src = this.plLib.getImage("empty");
		}
		this._dom.elMain.className = "preview no-tools";
		this._dom.elInfo.style.display = "block";
		this._dom.elCrop.style.display = "none";
		this._dom.elTitle.innerHTML = "";
		this._dom.elInfoName.innerHTML = "";
		this._dom.elInfoPath.innerHTML = "";
		this._dom.elInfoSize.innerHTML = "";
		this._dom.elInfoMime.innerHTML = "";
	}
	if (i) {
		this._dom._i = i;
		var brn = Math.round(i.bytes / 1024);
		var hds = Math.round((i.bytes / 1024 - brn) * 100);
		if (hds < 10) hds = "0" + hds;
		else hds = "" + hds;
		//this._dom.elMain.style.display = "block";
		this._dom.elTitle.innerHTML = i.filename + " <span class=\"info\">[" + (i.type == "img" ? (i.width + " x " + i.height + ", ") : "") + i.content_type + ", (*." + i.extension + "), " + brn + "." + hds + " кб]</span>";
		if (i.type == "img") {
			this._dom.elMain.className = "preview";
			this._dom.elInfo.style.display = "none";
			this._dom.elCrop.style.display = "block";
			this.plLib.eventAdd(this._dom.elCanvas, "mousemove", this._dom.funcDrag);
			if (i.width > this._dom.elCanvas.clientWidth) {
				this._dom._data.zoom = Math.round((this._dom.elCanvas.clientWidth / i.width) * 10000) / 100;
				this._dom.elImg.width = this._dom.elCanvas.clientWidth;
			} else {
				this._dom.elImg.width = i.width;
			}
			this._dom.elImg.src = i.url;
		} else {
			this._dom.elInfoName.innerHTML = i.filename;
			this._dom.elInfoPath.innerHTML = "<a href=\"" + i.url + "\" target=\"_blank\" title=\"Открыть в новом окне\">" + i.url + "</a>";
			this._dom.elInfoSize.innerHTML = "" + brn + "." + hds + " кб, (" + i.bytes + " байт)";
			this._dom.elInfoMime.innerHTML = i.content_type + ", (*." + i.extension + ")";
		}
	}
};
_preview.prototype.resize = function(tabHeight) {
	this._dom.elCanvas.style.height = "" + (tabHeight - 25 - 2) + "px";
	this._dom.elCopies.style.height = "" + (tabHeight - 25 - 90 - 25) + "px";
};
render.pluginRegisterProto(_preview, __name_admin_media_preview);

})();
//-----------------------  /plugin -------------------------//

// ---------------- plugin media-uploader ------------------//
(function(){

var _uploader = function() {
	this._config			=	{
		_loaded:			false,
		cbOnLoaded:			null,
		cbOnLoadBefore:		null,
		cbOnLoadStarted:	null,
		cbOnReady:			null,
		destination:		"",
		entity:				0,
		fileMaxSize:		10485760,
		module:				"",
		title:				"Загрузка файла",
		titleBtn:			"Загрузить",
		titleShow:			true,
		titleShowPath:		true,
	};
	this._debug				=	true;
	this._initErr			=	false;
	this._inited			=	false;
	this._file				=	{},
	this.$name				=	__name_admin_media_uploader;
	this.$nameOwner			=	__name_admin_media;
	this.$nameProto			=	this.$name;
	this.elFileInput		=	null;
	this.elFileWrap			=	null;
	this.elMain				=	null,
	this.elMsg				=	null,
	this.elTitle			=	null,
	this.elWaiter			=	null,
	this.fOnFileSelect		=	null;
	this.plLib				=	null;
	this.plRender			=	null;
};
_uploader.prototype._init = function(last, config, parent) {
	if (this._inited) return true;
	if (typeof last != "boolean") last = false;
	if (!this.plOwner) {
		if ((typeof parent == "object") && parent) {
			this.plOwner = parent;
			this.plLib = parent.getPlLib();
		}
	}
	if (this.waitConfig(config, last, "_configImport")) return this._inited;
	this._inited = true;
	this.fOnFileSelect = this.onFileSelect.bind(this);
	this.DOMMain();
	if (typeof this._config.cbOnReady == "function") {
		try {
			this._config.cbOnReady();
		} catch(e) {
			this.console(__name_script + " > " + this.$name + "._init(): Ошибка выполнения cbOnReady [" + e.name + "/" + e.message + "]");
		}
	}
	return true;
};
_uploader.prototype._actionSilentUpload = function() {
	var req = this.plRender.silentXReqBuild(this);
	req.action = this.$nameProto + "-upload";
	req.cbBound = false;
	req.cbFunc = this._onAction;
	req.dataPOST[this.$nameProto + "-destination"] = this._config.destination;
	req.dataPOST[this.$nameProto + "-entity"] = this._config.entity;
	req.dataPOST[this.$nameProto + "-file"] = this.elFileInput;
	req.dataPOST[this.$nameProto + "-file-credit"] = this._file.credit;
	req.dataPOST[this.$nameProto + "-file-name"] = this._file.name;
	req.dataPOST[this.$nameProto + "-file-noid"] = this._file.noid ? "1" : "0";
	req.dataPOST[this.$nameProto + "-file-nosizes"] = this._file.name.nosizes ? "1" : "0";
	req.dataPOST[this.$nameProto + "-file-title"] = this._file.title;
	req.dataPOST[this.$nameProto + "-module"] = this._config.module;
	req.debug = this._debug;
	//req.json = true; //default
	req.statusUrl = ""; //тот же
	this.plRender.silentX(req);
	if (typeof this._config.cbOnLoadStarted == "function") {
		try {
			this._config.cbOnLoadStarted();
		} catch(e) {
			var msg = "Ошибка выполнения callback-функции cbOnLoadStarted.";
			this.console(__name_script + " > [" + this.$name + "].actionFileUpload(): " + msg + " [" + e.name + "/" + e.message + "]");
		}
	}
};
_uploader.prototype._configImport = function(cfg) {
	var setDestination = false;
	var setEntity = false;
	var setModule = false;
	if (typeof cfg != "object" || !cfg) return false;
	for (var c in this._config) {
		if (!this._config.hasOwnProperty(c)) continue;
		if (typeof cfg[c] != "undefined") {
			switch(c) {
				case "_loaded":
					break;
				case "cbOnLoaded":
				case "cbOnLoadBefore":
				case "cbOnLoadStarted":
				case "cbOnReady":
					if (typeof cfg[c] == "function") {
						this._config[c] = cfg[c];
					}
					break;
				case "destination":
					if (typeof cfg.destination == "string") {
						this._config.destination = cfg.destination;
						setDestination = true;
					}
					break;
				case "entity":
				case "fileMaxSize":
					var num = -1;
					if (typeof cfg[c] == "string") {
						num = parseInt(cfg[c], 10);
						if (!isNaN(num)) this._config[c] = num;
					} else {
						if (typeof cfg[c] == "number") num = cfg[c];
					}
					if (num != -1) {
						this._config[c] = num;
						if (c == "entity") setEntity = true;
					}
					break;
				case "module":
				case "title":
				case "titleBtn":
					if (typeof cfg[c] == "string") {
						if (c == "module") setModule = true;
						this._config[c] = cfg[c];
					}
					break;
				case "titleShow":
				case "titleShowPath":
					if (typeof cfg[c] == "boolean") this._config[c] = cfg[c];
					break;
				default:
					this._config[c] = cfg[c];
					break;
			}
		}
	}
	//обязательных параметров
	if (!setDestination) {
		var msg = "Невозможно показать загрузчик, обязательный параметр конфига destination не задан или задан неверно [" + typeof cfg.destination + "].";
		this.console(__name_script + " > [" + this.$name + "].configImport(): " + msg);
		alert(msg);
		return false;
	}
	if (!setEntity) {
		var msg = "Невозможно показать загрузчик, обязательный параметр конфига entity не задан или задан неверно [" + typeof cfg.entity + "].";
		this.console(__name_script + " > [" + this.$name + "].configImport(): " + msg);
		alert(msg);
		return false;
	}
	if (!setModule) {
		var msg = "Невозможно показать загрузчик, обязательный параметр конфига module не задан или задан неверно [" + typeof cfg.module + "].";
		this.console(__name_script + " > [" + this.$name + "].configImport(): " + msg);
		alert(msg);
		return false;
	}
	this._config._loaded = true;
	return true;
};
_uploader.prototype._onAction = function(req) {
	switch(req.action) {
		case this.$nameProto + "-upload":
			if (typeof this._config.cbOnLoaded == "function") {
				req.response.entity = this._config.entity;
				try {
					this._config.cbOnLoaded(req.response);
				} catch(e) {
					var msg = "Ошибка выполнения callback-функции cbOnLoaded.";
					this.console(__name_script + " > [" + this.$name + "].onAction(): " + msg + " [" + e.name + "/" + e.message + "]");
				}
			}
			this._file = {};
			this.DOMFileInput();
			this.elFileWrap.style.display = "block";
			if (!req.response.res) {
				this.elWaiter.style.display = "none";
				this.elMsg.className = "msg err";
				this.elMsg.innerHTML = req.response.msg;
			} else this.elWaiter.parentNode.style.display = "none";
			break;
	}
};
_uploader.prototype.DOMFileInput = function() {
	if (this.elFileInput)
		this.plLib.eventAdd(this.elFileInput, "change", this.fOnFileSelect);
	this.elFileWrap.innerHTML = "";
	var el = document.createElement("SPAN");
	el.className = "filebrowse-btn";
	this.elFileWrap.appendChild(el);
	var el1 = document.createElement("DIV");
	el1.className = "bgicon"
	el.appendChild(el1);
	el1 = document.createElement("SPAN");
	el1.className = "btn-title"
	el1.innerHTML = "Выбрать и загрузить";
	el.appendChild(el1);
	this.elFileInput = document.createElement("INPUT");
	this.elFileInput.type = "file";
	el.appendChild(this.elFileInput);
	this.plLib.eventAdd(this.elFileInput, "change", this.fOnFileSelect);
};
_uploader.prototype.DOMMain = function() {
	this.elMain = document.createElement("DIV");
	//this.elMain.className = "media";
	var el = document.createElement("DIV");
	el.className = "media-uploader";
	this.elMain.appendChild(el);
	/*
	//невидимый блок
	this._dom.elHidden = document.createElement("DIV");
	this._dom.elHidden.style.display = "none";
	document.body.appendChild(this.elHidden);
	//фрейм для загрузки файла
	this._dom.elFrame = document.createElement("IFRAME");
	this._dom.elFrame.id = this._parent.$name + "-" + this.$nameProto + "-frame" + d.id;
	this._dom.elFrame.name = this._parent.$name + "-" + this.$nameProto + "-frame" +  d.id;
	this._dom.main.appendChild(dom.frame);
	*/
	//заголовок
	if (this._config.titleShow) {
		this.elTitle = document.createElement("DIV");
		this.elTitle.className = "title";
		this.elTitle.innerHTML = this._config.title + (this._config.titleShowPath ? (" в [" + this.plRender.getRoot() + this.plRender.getDir("userdata") + "/_" + this._config.module + "/" + this._config.destination + "]") : "");
		el.appendChild(this.elTitle);
	}
	var el1 = document.createElement("DIV");
	el1.style.display = "none";
	el.appendChild(el1);
	//индикатор ожидания
	this.elWaiter = document.createElement("IMG");
	this.elWaiter.src = this.plLib._imgsData.loading;
	this.elWaiter.className = "upl-wait";
	el1.appendChild(this.elWaiter);
	//поле вывода ошибки
	this.elMsg = document.createElement("DIV");
	this.elMsg.className = "msg";
	el1.appendChild(this.elMsg);
	//поле выбора файла
	this.elFileWrap = document.createElement("DIV");
	this.elFileWrap.className = "filebrowse-fld";
	el.appendChild(this.elFileWrap);
	this.DOMFileInput();
};
_uploader.prototype.dom = function() {
	return this.elMain;
};
_uploader.prototype.onFileSelect = function() {
	if (this._initErr) {
		alert("Невозможно выполнить загрузку, плагин инициализирован с ошибкой.");
		return;
	}
	if (typeof this._config.cbOnLoadBefore == "function") {
		var res;
		this._file.credit = "";
		this._file.name = "";
		this._file.noid = "1";
		this._file.nosizes = "0";
		this._file.title = "";
		try {
			res = this._config.cbOnLoadBefore(this.elFileInput.value);
			switch (typeof res) {
				case "undefined":
					res = true;
					break;
				case "boolean":
					break;
				case "object":
					var msg = false;
					if (typeof res.msg == "string") {
						msg = true;
						alert(res.msg);
					}
					var r;
					if (typeof res.canuse == "boolean") r = res.canuse;
					else {
						if (msg) r = false;
						else r = true;
					}
					if (r)
					for (var c in this._file) {
						if (!this._file.hasOwnProperty(c)) continue;
						if (typeof res[c] != "undefined") this._file[c] = res[c];
					}
					res = r;
					break;
				default:
					res = false;
			}
		} catch(e) {
			res = false;
			var msg = "Невозможно осуществить загрузку, проверка файла не удалась [ошибка контроллера].";
			this.console(__name_script + " > [" + this.$name + "].onFileSelect(): " + msg);
			alert(msg);
		}
	} else res = true;
	if (res) {
		this.elFileWrap.style.display = "none";
		this.elWaiter.style.display = "inline-block";
		this.elMsg.className = "msg";
		this.elMsg.innerHTML = "файл загружается...";
		this.elWaiter.parentNode.style.display = "block";
		this._actionSilentUpload();
	} else this.DOMFileInput();
};
render.pluginRegisterProto(_uploader, __name_admin_media_uploader);

})();
//-----------------------  /plugin -------------------------//

// ------------------ plugin img-cropper -------------------//
(function(){

var _ic = function() {
	this._inited		=	false;
	this.$name			=	__name_admin_media_cropper;
	this._opts			=	{
		cssRootClass:	this.$name,
		cssPrefClass:	"ic",
		heightTitle: 	24,
		heightToolbar:	34,
		imgBorder:		1,
		zoomMin:		5,
		zoomMax:		200,
		zoomStep:		5
	};
	this._parent		=	__name_admin_media;
	this._workers		=	[];
	this._workerSample	=	{
		_completed:		true,
		_parent:		this,
		cbOnCancel:		(function(){return true;}),
		cbOnDone:		(function(){return true;}),
		crop:			{
			cropping:	false,
			realX:		0,
			realY:		0,
			realW:		0,
			realX:		0,
			sized:		false,
			startX:		0,
			startY:		0,
			zoom:		100
		},
		dom:			{
			btnCancel:	null,
			btnCrop:	null,
			btnDone:	null,
			btnZoom:	null,
			btnZoom100:	null,
			btnShiftWd:	null,
			btnShiftHt:	null,
			canvas:		null,
			crop:		null,
			event:		null,
			fldWd:		null,
			fldHt:		null,
			fldFinWd:	null,
			fldFinHt:	null,
			main:		null,
			title:		null,
			titleInner:	null,
			tools:		null,
			zoom:		null,
			zoomSpan:	null
		},
		id:				-1,
		image:			{
			dragging:	false,
			dragged:	false,
			moveCurX:	0,
			moveCurY:	0,
			moveStartX:	0,
			moveStartY:	0,
			viewX:		0,
			viewY:		0,
			zoom:		100
		},
		imgUrl:			"",
		pu:				-1,
		title:			"Обрезка фото",
		tool:			"zoom",
		//functions
		cancel:			null,
		done:			null,
		hide:			null,
		onComplete:		null,
		onResize:		null,
		reInit:			null,
		resize:			null,
		reset:			null,
		show:			null,
		toolSet:		null,
		zoom:			null
	}
	this.plLib			=	null;
	this.plPU			=	null;
	this.plRender		=	null;
};
_ic.prototype._init = function(last) {
	if (this._inited) return true;
	if (typeof last != "boolean") last = false;
	if (!this.plLib) {
		this.plLib = render.pluginGet(__name_lib);
		if (!this.plLib) {
			if (last) this.console(__name_script + " > Ошибка инициализации плагина [" + this.$name + "]: требуемый плагин [" + __name_lib + "] не зарегистрирован в ядре.");
			return false;
		}
	}
	if (!this.plPU) {
		this.plPU = render.pluginGet(__name_popup);
		if (!this.plPU) {
			if (last) this.console(__name_script + " > Ошибка инициализации плагина [" + this.$name + "]: требуемый плагин [" + __name_popup + "] не зарегистрирован в ядре.");
			return false;
		}
	}
	this._inited = true;
	return true;
};
_ic.prototype.create = function(opts) {
	if (!this._inited) {
		this.console(__name_script + " > Невозможно создать обрезчик фото [" + this.$name + "]: плагин не инициализирован");
		return null;
	}
	if (typeof opts != "object" || (!opts)) {
		alert("Невозможно создать обрезчик фото [" + this.$name + "]: не указан набор параметров [opts]");
		this.console(__name_script + " > Невозможно создать обрезчик фото [" + this.$name + "]: не указан набор параметров [opts]");
		return null;
	}
	var w = {
		cbOnCancel: (function(){return true;}),
		cbOnDone: (function(){return true;}),
		imgUrl: "",
		imgSize: {w:800, h:600},
		title: "Обрезка фото",
	};
	for (var opt in opts) {
		if (typeof w[opt] != "undefined" && (typeof w[opt] == typeof opts[opt]))
			w[opt] = opts[opt];
	}
	if (!w.imgUrl) {
		alert("Невозможно создать обрезчик фото [" + this.$name + "]: получены некорректные параметры диалога, свойство [imgUrl] обязательно для передачи в параметрах.");
		this.console(__name_script + " > Невозможно создать обрезчик фото [" + this.$name + "]: получены некорректные параметры диалога, свойство [imgUrl] обязательно для передачи в параметрах.");
		return null;
	}
	w._parent = this;
	w._completed = true;
	w.id = this._workers.length;
	w.crop = {
		cropping:	false,
		sized:		false,
		realX:		0,
		realY:		0,
		realW:		0,
		realX:		0,
		scale:		1,
		startX:		0,
		startY:		0,
		zoom:		100
	};
	w.image = {
		dragging:	false,
		dragged:	false,
		moveCurX:	0,
		moveCurY:	0,
		moveStartX:	0,
		moveStartY:	0,
		viewX:		0,
		viewY:		0,
		zoom:		100
	};
	w.tool = "zoom";
	//создаем DOM
	this.itemDOMCreate(w);
	//привязываем методы и события
	var fc = this.workerCancel.bind(w);
	var fd = this.workerDone.bind(w);
	w.cancel = fc;
	w.done = fd;
	w.hide = this.workerHide.bind(w);
	w.onComplete = this.workerOnComplete.bind(w);
	w.onResize = this.workerOnWindowsResize.bind(w);
	w.reInit = this.workerReInit.bind(w);
	w.reset = this.workerReset.bind(w);
	w.resize = this.workerResize.bind(w);
	w.resizeEv = null;
	w.resizeTm = null;
	w.show = this.workerShow.bind(w);
	w.toolSet = this.workerToolSet.bind(w);
	w.zoom = this.workerZoom.bind(w);
	//всплывающее модальное окно
	this.plLib.eventAdd(w.dom.btnCancel, "click", fc);
	this.plLib.eventAdd(w.dom.btnDone, "click", fd);
	this.plLib.eventAdd(w.dom.btnZoom, "click", this.workerOnClickBtn.bind(w));
	this.plLib.eventAdd(w.dom.btnZoom, "contextmenu", this.workerOnClickZoom.bind(w));
	this.plLib.eventAdd(w.dom.btnCrop, "click", this.workerOnClickBtn.bind(w));
	this.plLib.eventAdd(w.dom.btnZoom100, "click", this.workerOnClickZoom.bind(w));
	this.plLib.eventAdd(w.dom.btnShiftWd, "click", this.workerOnClickShift.bind(w));
	this.plLib.eventAdd(w.dom.btnShiftHt, "click", this.workerOnClickShift.bind(w));
	this.plLib.eventAdd(w.dom.fldFinWd, "keyup", this.workerOnKeyUpScale.bind(w));
	this.plLib.eventAdd(w.dom.fldFinHt, "keyup", this.workerOnKeyUpScale.bind(w));
	this.plLib.eventAdd(w.dom.fldFinWd, "blur", this.workerOnBlurScale.bind(w));
	this.plLib.eventAdd(w.dom.fldFinHt, "blur", this.workerOnBlurScale.bind(w));
	this.plLib.eventAdd(w.dom.event, "click", this.workerOnEvent.bind(w));
	this.plLib.eventAdd(w.dom.event, "dblclick", this.workerOnEvent.bind(w));
	this.plLib.eventAdd(w.dom.event, "contextmenu", this.workerOnEvent.bind(w));
	this.plLib.eventAdd(w.dom.event, "mousedown", this.workerOnEvent.bind(w));
	this.plLib.eventAdd(w.dom.event, "mouseup", this.workerOnEvent.bind(w));
	this.plLib.eventAdd(w.dom.event, "mouseout", this.workerOnEvent.bind(w));
	this.plLib.eventAdd(w.dom.event, "mousemove", this.workerOnEvent.bind(w));
	var p = this.plPU.add({
		content:w.dom.main.parentNode.parentNode,
		showcloser:false,
		windowed:true
	});
	if (p == -1) {
		this.console("Ошибка создания модального окна!");
		return null;
	}
	w.pu = p;
	//сохраняем в стек
	this._workers.push(w);
	return w;
};
_ic.prototype.itemDOMCreate = function(w) {
	var dom = {};
	w.dom = dom;
	var el = document.createElement("DIV");
	el.className = "media";
	dom.main = document.createElement("DIV");
	dom.main.className = "image-cropper";
	el.appendChild(dom.main);
	el = document.createElement("DIV");
	el.className = "admin";
	el.appendChild(dom.main.parentNode);
	//заголовок
	var cp = this._opts.cssPrefClass;
	dom.title = document.createElement("DIV");
	dom.title.className = cp + "-title";
	dom.main.appendChild(dom.title);
	dom.titleInner = document.createElement("DIV");
	dom.titleInner.className = cp + "-title-inner";
	dom.titleInner.innerHTML = w.title;
	dom.title.appendChild(dom.titleInner);
	//----------тулбар-------------
	dom.tools = document.createElement("DIV");
	dom.tools.className = cp + "-toolbar";
	dom.main.appendChild(dom.tools);
	//кнопка "Отмена"
	dom.btnCancel = document.createElement("DIV");
	dom.btnCancel.className = cp + "-btn-cancel";
	dom.btnCancel.innerHTML = "Отмена";
	dom.tools.appendChild(dom.btnCancel);
	//разделитель
	el = document.createElement("DIV");
	el.className = cp + "-btn-sp";
	dom.tools.appendChild(el);
	//кнопка "Сохранить"
	dom.btnDone = document.createElement("DIV");
	dom.btnDone.className = cp + "-btn-done-dis";
	dom.btnDone.innerHTML = "OK";
	dom.tools.appendChild(dom.btnDone);
	//внутренняя частю тулбара
	dom.toolsInner = document.createElement("DIV");
	dom.toolsInner.className = "tb-inner";
	dom.tools.appendChild(dom.toolsInner);
	//разделитель
	el = document.createElement("DIV");
	el.className = cp + "-btn-sp-grad";
	dom.toolsInner.appendChild(el);
	//кнопка масштаба/перетаскивания
	dom.btns = [];
	dom.btnZoom = document.createElement("DIV");
	dom.btnZoom.className = cp + "-btn-act btn-zoom";
	dom.btnZoom.title = "Масштабировать/Передвинуть";
	dom.btns.push(dom.btnZoom);
	dom.toolsInner.appendChild(dom.btnZoom);
	//разделитель
	el = document.createElement("DIV");
	el.className = cp + "-btn-sp";
	dom.toolsInner.appendChild(el);
	//кнопка выделения зоны обрезки
	dom.btnCrop = document.createElement("DIV");
	dom.btnCrop.className = cp + "-btn btn-crop";
	dom.btnCrop.title = "Выделить область";
	dom.btns.push(dom.btnCrop);
	dom.toolsInner.appendChild(dom.btnCrop);
	//разделитель
	el = document.createElement("DIV");
	el.className = cp + "-btn-sp";
	dom.toolsInner.appendChild(el);
	//кнопка масштаб 100%
	dom.btnZoom100 = document.createElement("DIV");
	dom.btnZoom100.className = cp + "-btn btn-zoom100";
	dom.btnZoom100.title = "Оригинальный размер";
	dom.toolsInner.appendChild(dom.btnZoom100);
	//разделитель
	el = document.createElement("DIV");
	el.className = cp + "-btn-sp";
	el.style.width = "20px";
	dom.toolsInner.appendChild(el);
	//название поля - Ширина
	el = document.createElement("DIV");
	el.className = "fld-name";
	el.innerHTML = "Шир.:";
	dom.toolsInner.appendChild(el);
	//поле размера выделения - ширина
	dom.fldWd = document.createElement("DIV");
	dom.fldWd.className = "fld-val";
	dom.fldWd.innerHTML = "-";
	dom.toolsInner.appendChild(dom.fldWd);
	dom.btnShiftWd = document.createElement("DIV");
	dom.btnShiftWd.className = cp + "-btn btn-shift-dis";
	dom.toolsInner.appendChild(dom.btnShiftWd);
	el = document.createElement("DIV");
	el.className = "drop-ceil";
	el.title = "Подогнать ширину";
	dom.btnShiftWd.appendChild(el);
	var el1 = document.createElement("DIV");
	el1.className = "fields";
	el.appendChild(el1);
	var el2 = document.createElement("SPAN");
	el2.className = "shift-val wd";
	el2.innerHTML = "+1";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val wd";
	el2.innerHTML = "-1";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val wd";
	el2.innerHTML = "+5";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val wd";
	el2.innerHTML = "-5";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val wd";
	el2.innerHTML = "+10";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val wd";
	el2.innerHTML = "-10";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val wd";
	el2.innerHTML = "+50";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val wd";
	el2.innerHTML = "-50";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val wd";
	el2.innerHTML = "+100";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val wd";
	el2.innerHTML = "-100";
	el1.appendChild(el2);
	//разделитель
	el = document.createElement("DIV");
	el.className = cp + "-btn-sp";
	dom.toolsInner.appendChild(el);
	//название поля - Высота
	el = document.createElement("DIV");
	el.className = "fld-name";
	el.innerHTML = "Выс.:";
	dom.toolsInner.appendChild(el);
	//поле размера выделения - высота
	dom.fldHt = document.createElement("DIV");
	dom.fldHt.className = "fld-val";
	dom.fldHt.innerHTML = "-";
	dom.toolsInner.appendChild(dom.fldHt);
	dom.btnShiftHt = document.createElement("DIV");
	dom.btnShiftHt.className = cp + "-btn btn-shift-dis";
	dom.toolsInner.appendChild(dom.btnShiftHt);
	el = document.createElement("DIV");
	el.className = "drop-ceil";
	el.title = "Подогнать высоту";
	dom.btnShiftHt.appendChild(el);
	el1 = document.createElement("DIV");
	el1.className = "fields";
	el.appendChild(el1);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val ht";
	el2.innerHTML = "+1";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val ht";
	el2.innerHTML = "-1";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val ht";
	el2.innerHTML = "+5";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val ht";
	el2.innerHTML = "-5";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val ht";
	el2.innerHTML = "+10";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val ht";
	el2.innerHTML = "-10";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val ht";
	el2.innerHTML = "+50";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val ht";
	el2.innerHTML = "-50";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val ht";
	el2.innerHTML = "+100";
	el1.appendChild(el2);
	el2 = document.createElement("SPAN");
	el2.className = "shift-val ht";
	el2.innerHTML = "-100";
	el1.appendChild(el2);
	//разделитель
	el = document.createElement("DIV");
	el.className = cp + "-btn-sp";
	dom.toolsInner.appendChild(el);
	//название полей - Конечные размеры
	el = document.createElement("DIV");
	el.className = "fld-name";
	el.innerHTML = "Конечные размеры:";
	dom.toolsInner.appendChild(el);
	//шир
	dom.fldFinWd = document.createElement("INPUT");
	dom.fldFinWd.type = "text";
	dom.fldFinWd.maxlength = 4;
	dom.fldFinWd.disabled = "disabled";
	dom.fldFinWd.className = "fin-sizes wd";
	dom.fldFinWd.value = "-";
	dom.fldFinWd.title = "Enter - применить";
	dom.toolsInner.appendChild(dom.fldFinWd);
	//замок
	el = document.createElement("DIV");
	el.className = "lock";
	dom.toolsInner.appendChild(el);
	//выс
	dom.fldFinHt = document.createElement("INPUT");
	dom.fldFinHt.type = "text";
	dom.fldFinHt.maxlength = 4;
	dom.fldFinHt.disabled = "disabled";
	dom.fldFinHt.className = "fin-sizes ht";
	dom.fldFinHt.value = "-";
	dom.fldFinHt.title = "Enter - применить";
	dom.toolsInner.appendChild(dom.fldFinHt);
	//----------канва-------------
	dom.canvas = document.createElement("DIV");
	dom.canvas.className = "canvas";
	dom.main.appendChild(dom.canvas);
	dom.image = document.createElement("IMG");
	dom.image.src = w.imgUrl;
	dom.image.className = "crop-image";
	dom.image.style.left = "0";
	dom.image.style.top = "0";
	dom.canvas.appendChild(dom.image);
	//слой отображения масштаба
	dom.zoom = document.createElement("DIV");
	dom.zoom.className = "crop-zoom";
	dom.zoom.style.display = "none";
	dom.canvas.appendChild(dom.zoom);
	dom.zoomSpan = document.createElement("SPAN");
	dom.zoom.appendChild(dom.zoomSpan);
	//слой выделения зоны обрезки
	el = document.createElement("DIV");
	dom.crop = document.createElement("DIV");
	dom.crop.className = "crop-select";
	dom.crop.style.display = "none";
	dom.crop.appendChild(el);
	dom.canvas.appendChild(dom.crop);
	//слой-обработчик
	dom.event = document.createElement("DIV");
	dom.event.className = "crop-event";
	dom.event.style.cursor = "move";
	dom.canvas.appendChild(dom.event);
};
_ic.prototype.workerCancel = function() {
	return this.onComplete("event_cancel");
};
_ic.prototype.workerDone = function() {
	return this.onComplete("event_done");
};
_ic.prototype.workerHide = function() {
	this._parent.plPU.hide(w.pu);
	this._parent.plLib.eventRemove(window, "resize", this.onResize);
};
_ic.prototype.workerOnBlurScale = function(e) {
	this.dom.fldFinWd.value = "" + Math.floor(this.crop.scale * this.crop.realW);
	this.dom.fldFinHt.value = "" + Math.floor(this.crop.scale * this.crop.realH);
};
_ic.prototype.workerOnComplete = function(event, e) {
	var ev = arguments.callee.caller.arguments[0];
	ev = this._parent.plLib.eventFix(ev);
	if (ev.target.className.indexOf("dis") != -1) return;
	if (event == "event_cancel") {
		var res;
		try {
			res = this.cbOnCancel();
		} catch(e){
			res = true;
		}
		if (res === false) return false;
		this._completed = true;
	}
	if (event == "event_done") {
		if (this.dom.fldWd.innerHTML == "-") {
			alert("Неверные данные ");
		} else {
			var data = {
				x: this.crop.realX,
				y: this.crop.realY,
				w: this.crop.realW,
				h: this.crop.realH,
				scale: this.crop.scale
			};
			try {
				res = this.cbOnDone(data);
			} catch(e){
				res = true;
			}
			if (res === false) return false;
		}
		this._completed = true;
	}
	if (this._completed) {
		this.reset();
		this._parent.plPU.hide(this.pu);
		this._parent.plLib.eventRemove(window, "resize", this.onResize);
		return true;
	}
	this.console(__name_script + " > " + this.$name +".workerOnComplete(): Неверное событие, действие проигнорировано");
	return false;
};
_ic.prototype.workerOnClickBtn = function(e) {
	var ev = this._parent.plLib.eventFix(e);
	var btn = ev.srcElement;
	var btnIsAct = (btn.className.indexOf("-act") != -1);
	if (btnIsAct) {
		if (this.tool == "zoom") this.zoom("+");
		return;
	}
	var cp = this._parent._opts.cssPrefClass;
	var cls = btn.className.split(" ");
	if (cls.length != 2) return;
	var btnPrev = null;
	var toolPrev = null;
	var clsPrev = null;
	var l = this.dom.btns.length;
	for (var c = 0; c < l; c++) {
		if (this.dom.btns[c] == btn) continue;
		if (this.dom.btns[c].className.indexOf("-act") != -1) {
			clsPrev = this.dom.btns[c].className.split(" ");
			if (clsPrev.length == 2) {
				btnPrev = this.dom.btns[c];
				toolPrev = clsPrev[1].replace(/btn-/g, "");
				break;
			}
		}
	}
	if (btnPrev)
		btnPrev.className = cp + "-btn btn-" + toolPrev;
	var tool = cls[1].replace(/btn-/g, "");
	btn.className = cp + "-btn-act btn-" + tool;
	this.toolSet(tool);
};
_ic.prototype.workerOnClickShift = function(e) {
	var ev = this._parent.plLib.eventFix(e);
	var el = ev.srcElement;
	if (el.nodeName != "SPAN") return;
	var cl = el.className.replace(/shift-val /g, "");
	var sh = parseInt(el.innerHTML, 10);
	if (!sh || sh == "NaN") return;
	if (cl == "wd") {
		if (!this.crop.realW) return;
		if ((sh * 2) >= this.crop.realW) return;
		var rem = this.crop.realW % sh;
		this.crop.realW = this.crop.realW + (rem ? (sh > 0 ? (sh - rem) : -rem) : sh);
		this.dom.crop.style.width = "" + Math.floor(this.crop.realW * this.image.zoom / 100) + "px";
		this.dom.fldWd.innerHTML = this.crop.realW;
		this.dom.fldFinWd.value = "" + Math.floor(this.crop.scale * this.crop.realW);
	}
	if (cl == "ht") {
		if (!this.crop.realH) return;
		if ((sh * 2) >= this.crop.realH) return;
		var rem = this.crop.realH % sh;
		this.crop.realH = this.crop.realH + (rem ? (sh > 0 ? (sh - rem) : -rem) : sh);
		this.dom.crop.style.height = "" + Math.floor(this.crop.realH * this.image.zoom / 100) + "px";
		this.dom.fldHt.innerHTML = this.crop.realH;
		this.dom.fldFinHt.value = "" + Math.floor(this.crop.scale * this.crop.realH);
	}
};
_ic.prototype.workerOnClickZoom = function(e) {
	var ev = this._parent.plLib.eventFix(e);
	var btn = ev.srcElement;
	if ((ev.type == "contextmenu") && (btn.className.indexOf("-zoom") != -1) && (btn.className.indexOf("-zoom100") == -1)) {
		this._parent.plLib.eventPreventDefault(e);
		this.zoom("-");
		return;
	}
	if (btn.className.indexOf("-zoom100") != -1) {
		this.zoom("100%");
		return;
	}
};
_ic.prototype.workerOnEvent = function(e) {
	var ev = this._parent.plLib.eventFix(e);
	var cp = this._parent._opts.cssPrefClass;
	if (this.tool == "zoom") {
		switch(ev.type) {
			case "contextmenu":
				this._parent.plLib.eventPreventDefault(e);
				this.zoom("-");
				break;
			case "mousedown":
				if (ev.button != 0) break;
				this.image.dragging = true;
				this.image.dragged = false;
				this.image.moveCurX = this.image.viewX;
				this.image.moveCurY = this.image.viewY;
				this.image.moveStartX = ev.offsetX;
				this.image.moveStartY = ev.offsetY;
				break;
			case "mousemove":
				if (this.image.dragging) {
					this.image.dragged = true;
					var x = this.image.moveCurX + (ev.offsetX - this.image.moveStartX);
					this.image.viewX = x;
					var y = this.image.moveCurY + (ev.offsetY - this.image.moveStartY);
					this.image.viewY = y;
					if (this.dom.crop.style.display == "block") {
						this.crop.realX = Math.floor((this.crop.startX - this.image.viewX) * 100 / this.image.zoom);
						this.crop.realY = Math.floor((this.crop.startY - this.image.viewY) * 100 / this.image.zoom);
					}
					if (x < 0) x = "-" + (x * -1);
					if (y < 0) y = "-" + (y * -1);
					this.dom.image.style.left = "" + x + "px";
					this.dom.image.style.top = "" + y + "px";
				}
				break;
			case "mouseup":
				if (ev.button != 0) break;
				this.image.dragging = false;
				break;
			case "mouseout":
				if (this.image.dragging) {
					this.image.dragging = false;
					this.image.dragged = false;
					this.image.left = parseInt(this.dom.image.style.left, 10);
					this.image.top = parseInt(this.dom.image.style.top, 10);
				}
				break;
			case "click":
				if (ev.button != 0) break;
				if (this.image.dragged) {
					this.image.dragged = false;
					break;
				}
				this.zoom("+");
				break;
			case "dblclick":
				if (ev.button != 0) break;
				if (this.image.dragged) {
					this.image.dragged = false;
					break;
				}
				this.image.dragging = false;
				this.zoom("Fit");
				break;
		}
	}
	if (this.tool == "crop") {
		switch(ev.type) {
			case "contextmenu":
				this._parent.plLib.eventPreventDefault(e);
			case "mousedown":
				if (ev.button != 0) break;
				this.crop.cropping = true;
				this.crop.sized = false;
				this.crop.startX = ev.offsetX;
				this.crop.startY = ev.offsetY;
				this.crop.realX = Math.floor((this.crop.startX - this.image.viewX) * 100 / this.image.zoom);
				this.crop.realY = Math.floor((this.crop.startY - this.image.viewY) * 100 / this.image.zoom);
				this.crop.realW = 0;
				this.crop.realH = 0;
				this.dom.crop.style.left = this.crop.startX + "px";
				this.dom.crop.style.top = this.crop.startY + "px";
				this.dom.crop.style.width = "0";
				this.dom.crop.style.height = "0";
				this.dom.crop.style.display = "block";
				this.dom.btnDone.className = cp + "-btn-done-dis";
				this.dom.fldWd.innerHTML = "-";
				this.dom.fldHt.innerHTML = "-";
				this.dom.btnShiftWd.className = cp + "-btn btn-shift-dis";
				this.dom.btnShiftHt.className = cp + "-btn btn-shift-dis";
				this.dom.fldFinWd.disabled = "disabled";
				this.dom.fldFinWd.value = "-";
				this.dom.fldFinHt.disabled = "disabled";
				this.dom.fldFinHt.value = "-";
				break;
			case "mousemove":
				if (this.crop.cropping) {
					var w = ev.offsetX - this.crop.startX;
					if (w <= 0) w = 3;
					var h = ev.offsetY - this.crop.startY;
					if (h <= 0) h = 3;
					this.crop.realW = Math.floor(w * 100 / this.image.zoom);
					this.crop.realH = Math.floor(h * 100 / this.image.zoom);
					this.dom.crop.style.width = "" + w + "px";
					this.dom.crop.style.height = "" + h + "px";
					this.dom.fldWd.innerHTML = "" + this.crop.realW;
					this.dom.fldHt.innerHTML = "" + this.crop.realH;
					this.dom.fldFinWd.value = Math.floor(this.crop.realW * this.crop.scale);
					this.dom.fldFinHt.value = Math.floor(this.crop.realH * this.crop.scale);
					if (!this.sized) {
						this.dom.btnDone.className = cp + "-btn-done";
						this.dom.btnShiftWd.className = cp + "-btn btn-shift";
						this.dom.btnShiftHt.className = cp + "-btn btn-shift";
						this.dom.fldFinWd.disabled = "";
						this.dom.fldFinHt.disabled = "";
					}
					this.crop.sized = true;
				}
				break;
			case "mouseup":
				if (ev.button != 0) break;
				this.crop.cropping = false;
				break;
			case "mouseout":
				if (this.crop.cropping) {
					this.crop.cropping = false;
					this.crop.sized = false;
				}
				break;
			case "click":
				if (ev.button != 0) break;
				if (this.crop.sized) {
					this.crop.sized = false;
					break;
				}
				break;
			case "dblclick":
				if (ev.button != 0) break;
				if (this.crop.sized) {
					this.crop.sized = false;
					break;
				}
				this.crop.cropping = false;
				break;
		}
	}
};
_ic.prototype.workerOnKeyUpScale = function(e) {
	var ev = this._parent.plLib.eventFix(e);
	if (ev.keyCode != 13) return;
	var el = ev.srcElement;
	if (el.nodeName != "INPUT") return;
	var cl = el.className.replace(/fin-sizes /g, "");
	if (cl == "wd") {
		var val = parseInt(el.value, 10);
		if ((val <= 0) || (val == "NaN")) return;
		this.crop.scale = val / this.crop.realW;
		this.dom.fldFinHt.value = Math.floor(this.crop.scale * this.crop.realH);
		return;
	}
	if (cl == "ht") {
		var val = parseInt(el.value, 10);
		if ((val <= 0) || (val == "NaN")) return;
		this.crop.scale = val / this.crop.realH;
		this.dom.fldFinWd.value = Math.floor(this.crop.scale * this.crop.realW);
		return;
	}
};
_ic.prototype.workerOnWindowsResize = function(e) {
	if (this.resizeTm) window.clearTimeout(this.resizeTm);
	this.resizeTm = window.setTimeout(this.resize, 50);
	this.resizeEv = e;
};
_ic.prototype.workerReInit = function(opts) {
	if (!this._completed) {
		this.console(__name_script + " > workerReInit: невозможно ре-инициализировать объект плагина [" + this._parent.$name + "], объект еще не завершил текущую операцию");
		return false;
	}
	if (typeof opts != "object" || (!opts)) {
		this.console(__name_script + " > workerReInit: невозможно ре-инициализировать объект обрезчика [" + this.$name + "], неверные параметры ре-инициализации [opts]");
		return false;
	}
	if (typeof opts["imgUrl"] == "undefined") {
		alert("Невозможно создать обрезчик фото [" + this.$name + "]: получены некорректные параметры диалога, свойство [imgUrl] обязательно для передачи в параметрах.");
		this.console(__name_script + " > workerReInit: невозможно ре-инициализировать объект обрезчика [" + this.$name + "], получены некорректные параметры диалога, свойство [imgUrl] обязательно для передачи в параметрах.");
		return false;
	}
	if (typeof opts["imgSize"] == "undefined") {
		alert("Невозможно создать обрезчик фото [" + this.$name + "]: получены некорректные параметры диалога, свойство [imgSize] обязательно для передачи в параметрах.");
		this.console(__name_script + " > workerReInit: невозможно ре-инициализировать объект обрезчика [" + this.$name + "], получены некорректные параметры диалога, свойство [imgUrl] обязательно для передачи в параметрах.");
		return false;
	}
	this.imgUrl = opts["imgUrl"];
	this.imgSize = opts["imgSize"];
	this.dom.image.src = this.imgUrl;
	return true;
};
_ic.prototype.workerReset = function() {
	var cp = this._parent._opts.cssPrefClass;
	this.zoom("100%");
	this.dom.image.src = this._parent.plLib.getImage("empty");
	this.dom.image.style.left = "0";
	this.dom.image.style.top = "0";
	this.dom.crop.style.left = "0";
	this.dom.crop.style.top = "0";
	this.dom.crop.style.width = "0";
	this.dom.crop.style.height = "0";
	this.dom.crop.style.display = "none";
	this.dom.btnDone.className = cp + "-btn-done-dis";
	this.dom.fldWd.innerHTML = "-";
	this.dom.fldHt.innerHTML = "-";
	this.dom.btnShiftWd.className = cp + "-btn btn-shift-dis";
	this.dom.btnShiftHt.className = cp + "-btn btn-shift-dis";
	this.dom.fldFinWd.disabled = "disabled";
	this.dom.fldFinWd.value = "-";
	this.dom.fldFinHt.disabled = "disabled";
	this.dom.fldFinHt.value = "-";
	var l = this.dom.btns.length;
	if (this.tool != "zoom") {
		for (var c = 0; c < l; c++) {
			if (this.dom.btns[c] == this.dom.btnZoom) continue;
			var clsPrev = this.dom.btns[c].className.split(" ");
			if (clsPrev.length == 2)
				this.dom.btns[c].className = cp + "-btn " + clsPrev[1];
		}
		this.dom.btnZoom.className = cp + "-btn-act btn-zoom";
		this.toolSet("zoom");
	}
	this.crop = {
		cropping:	false,
		sized:		false,
		realX:		0,
		realY:		0,
		realW:		0,
		realX:		0,
		scale:		1,
		startX:		0,
		startY:		0,
		zoom:		100
	};
	this.image = {
		dragging:	false,
		dragged:	false,
		moveCurX:	0,
		moveCurY:	0,
		moveStartX:	0,
		moveStartY:	0,
		viewX:		0,
		viewY:		0,
		zoom:		100
	};
	this.tool = "zoom";
};
_ic.prototype.workerResize = function() {
	var ws = this._parent.plLib.pageSize();
	var bs = 24;
	var w, h;
	if (typeof this._parent.plPU._borderSize != "undefined")
		bs = this._parent.plPU._borderSize;
	if ((this.imgSize.w + (bs * 2)) > ws.ww) w = ws.ww - (bs * 2);
	else w = this.imgSize.w;
	if ((this.imgSize.h + (bs * 2)) > ws.wh) h = ws.wh - (bs * 2);
	else h = this.imgSize.h;
	if (this.resizeTm) {
		this.resizeTm = null;
		this.resizeEv = null;
	}
	if (w < 800) w = 800;
	if (h < 500) h = 500;
	this.dom.main.style.width = "" + w + "px";
	this.dom.main.style.height = "" + h + "px";
	var wplus = this._parent._opts.imgBorder * 2;
	var hplus = this._parent._opts.heightTitle + this._parent._opts.heightToolbar + (this._parent._opts.imgBorder * 2);
	this.dom.canvas.style.width = "" + (w - wplus) + "px";
	this.dom.canvas.style.height = "" + (h - hplus) + "px";
	this.dom.event.style.width = "" + (w - wplus - (this._parent._opts.imgBorder * 2)) + "px";
	this.dom.event.style.height = "" + (h - hplus - (this._parent._opts.imgBorder * 2)) + "px";
};
_ic.prototype.workerShow = function() {
	if (!this._completed) {
		this.console(__name_script + " > workerShow: невозможно показать окно объекта плагина [" + this._parent.$name + "], требуется повторная инициализация [ic.reInit]");
		return false;
	}
	this.resize();
	this._parent.plPU.show(this.pu);
	this._parent.plLib.eventAdd(window, "resize", this.onResize);
	return true;
};
_ic.prototype.workerToolSet = function(tool) {
	switch (this.tool) {
		case "zoom":
			break;
		case "crop":
			break;
	}
	this.tool = tool;
	switch (this.tool) {
		case "zoom":
			this.dom.event.style.cursor = "move";
			break;
		case "crop":
			this.dom.event.style.cursor = "pointer";
			break;
	}
};
_ic.prototype.workerZoom = function(cmd) {
	var z = this.image.zoom;
	var zs = this._parent._opts.zoomStep;
	var zmax = this._parent._opts.zoomMax;
	var zmin = this._parent._opts.zoomMin;
	var nz = 100;
	var canvasW = parseInt(this.dom.canvas.style.width, 10);
	switch (cmd) {
		case "+":
			nz = parseInt((parseInt(z/zs, 10) * zs), 10) + zs;
			break;
		case "-":
			nz = parseInt((parseInt(z/zs, 10) * zs), 10) - zs;
			break;
		case "Fit":
			nz = Math.floor((canvasW/this.imgSize.w)*10000)/100;
			break;
		case "100%":
			nz = 100;
			break;
	}
	if (nz > zmax) nz = zmax;
	if (nz < zmin) nz = zmin;
	var newW, newH;
	newW = Math.floor(nz * this.imgSize.w / 100);
	newH = Math.floor(nz * this.imgSize.h / 100);
	this.dom.image.width = newW;
	this.dom.image.height = newH;
	if (cmd == "Fit") {
		this.dom.image.style.left = "0";
		this.dom.image.style.top = "0";
		this.image.viewX = 0;
		this.image.viewY = 0;
	}
	if (this.dom.crop.style.display == "block") {
		this.dom.crop.style.left = "" + (this.image.viewX + Math.floor(this.crop.realX * nz / 100)) + "px";
		this.dom.crop.style.top = "" + (this.image.viewY + Math.floor(this.crop.realY * nz / 100)) + "px";
		if (this.crop.realW > 0)
			this.dom.crop.style.width = "" + Math.floor(this.crop.realW * nz / 100) + "px";
		if (this.crop.realH > 0)
			this.dom.crop.style.height = "" + Math.floor(this.crop.realH * nz / 100) + "px";
	}
	this.image.zoom = nz;
	this.dom.zoomSpan.innerHTML = nz + "%";
	$(this.dom.zoom).stop(true, true);
	this.dom.zoom.style.opacity = 1;
	this.dom.zoom.style.display = "block";
	$(this.dom.zoom).animate({opacity: 0}, 2000, (function(el){
		el.style.display = "none";
	}).bind(this, this.dom.zoom));
};
render.pluginRegister(_ic, true);

})();
//-----------------------  /plugin -------------------------//

})();

render.pluginRegister(_admin, true);

})();
//...admin wrapper ends...

})();
//...global wrapper ends...
