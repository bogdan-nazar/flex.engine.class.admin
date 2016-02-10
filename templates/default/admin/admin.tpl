<!--/*fet:%main%*/-->
<div class="<!--/*fet:def:parent*/-->">
	<div class="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/--> icons32" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->">
		<div class="<!--/*fet:def:parent*/-->-leftcol">
			<div class="session">Пользователь: <!--/*fet:var:%userName%*/-->&nbsp;&nbsp;[<div class="logoff" onclick="render.pluginGet('auth').logoff()">выйти</div>]</div>
			<input type="hidden" id="<!--/*fet:def:parent*/-->-section-id" name="<!--/*fet:def:parent*/-->-section-id" value="<!--/*fet:var:%sectId%*/-->" />
			<input type="hidden" id="<!--/*fet:def:parent*/-->-section-mode" name="<!--/*fet:def:parent*/-->-section-mode" value="<!--/*fet:var:%sectMode%*/-->" />
			<input type="hidden" id="<!--/*fet:def:parent*/-->-section-name" name="<!--/*fet:def:parent*/-->-section-name" value="<!--/*fet:var:%sectName%*/-->" />
			<div class="asect-btn asect-<!--/*fet:var:%sectIntroName%*/--><!--/*fet:var:%sectIntroAct%*/-->" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').section(<!--/*fet:var:%sectIntro%*/-->)">
				<div class="icons icon gray-out"></div><div class="title"><!--/*fet:var:%sectIntroTitle%*/--></div>
			</div>
			<div class="asect-btn asect-<!--/*fet:var:%sectContentName%*/--><!--/*fet:var:%sectContentAct%*/-->" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').section(<!--/*fet:var:%sectContent%*/-->)">
				<div class="icons icon gray-out"></div><div class="title"><!--/*fet:var:%sectContentTitle%*/--></div>
			</div>
			<div class="asect-btn asect-<!--/*fet:var:%sectMediaName%*/--><!--/*fet:var:%sectMediaAct%*/-->" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').section(<!--/*fet:var:%sectMedia%*/-->)">
				<div class="icons icon gray-out"></div><div class="title"><!--/*fet:var:%sectMediaTitle%*/--></div>
			</div>
			<div class="asect-btn asect-<!--/*fet:var:%sectModulesName%*/--><!--/*fet:var:%sectModulesAct%*/-->" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').section(<!--/*fet:var:%sectModules%*/-->)">
				<div class="icons icon gray-out"></div><div class="title"><!--/*fet:var:%sectModulesTitle%*/--></div>
			</div>
			<div class="asect-btn asect-<!--/*fet:var:%sectSettingsName%*/--><!--/*fet:var:%sectSettingsAct%*/-->" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').section(<!--/*fet:var:%sectSettings%*/-->)">
				<div class="icons icon gray-out"></div><div class="title"><!--/*fet:var:%sectSettingsTitle%*/--></div>
			</div>
			<div class="asect-btn asect-<!--/*fet:var:%sectStatName%*/--><!--/*fet:var:%sectStatAct%*/-->" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').section(<!--/*fet:var:%sectStat%*/-->)">
				<div class="icons icon gray-out"></div><div class="title"><!--/*fet:var:%sectStatTitle%*/--></div>
			</div>
			<div class="asect-btn asect-<!--/*fet:var:%sectSystemName%*/--><!--/*fet:var:%sectSystemAct%*/-->" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').section(<!--/*fet:var:%sectSystem%*/-->)">
				<div class="icons icon gray-out"></div><div class="title"><!--/*fet:var:%sectSystemTitle%*/--></div>
			</div>
			<div class="asect-btn asect-<!--/*fet:var:%sectHelpName%*/--><!--/*fet:var:%sectHelpAct%*/-->" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').section(<!--/*fet:var:%sectHelp%*/-->)">
				<div class="icons icon gray-out"></div><div class="title"><!--/*fet:var:%sectHelpTitle%*/--></div>
			</div>
		</div>
		<div class="<!--/*fet:def:parent*/-->-bar"><a class="goindex" href="<!--/*fet:def:appRoot*/-->" target="_blank" title="Открыть сайт в новом окне"><!--/*fet:var:%siteName%*/--></a>: Модуль администратора системы</div>
		<div class="<!--/*fet:def:parent*/-->-workarea">
			<div class="section <!--/*fet:var:%sectName%*/--><!--/*fet:var:%sectHasMode%*/-->">
				<div class="section-title">
					<div class="icon"></div><div class="text"><!--/*fet:var:%sectTitle%*/--></div>
				</div>
				<div class="section-inner" id="<!--/*fet:def:parent*/-->-section-inner">
					<div id="<!--/*fet:def:parent*/-->-section-control" class="<!--/*fet:def:parent*/-->-control"></div>
					<div class="<!--/*fet:def:parent*/-->-data">
						<!--/*fet:var:%section%*/-->
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!--/*/fet:%main%*/-->

<!--/*fet:%content-list%*/-->
<div class="<!--/*fet:def:section*/-->">
	<input type="hidden" id="<!--/*fet:def:parent*/-->-<!--/*fet:var:%sectName%*/-->-id" name="<!--/*fet:def:parent*/-->-<!--/*fet:var:%sectName%*/-->-id" value="" />
	<div class="filters">
		<input type="hidden" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-filter" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-filter" value="" />
		Сортировать по:&nbsp;
		<select id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-sortby" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-sortby">
		<option value="date-cr:DESC"<!--/*fet:var:%sortby-created-DESC%*/-->>дата создания [по убываню]</option>
		<option value="date-cr:ASC"<!--/*fet:var:%sortby-created-ASC%*/-->>дата создания [по нарастанию]</option>
		<option value="title:ASC"<!--/*fet:var:%sortby-title-ASC%*/-->>название [А-Я], по умолчанию</option>
		<option value="title:DESC"<!--/*fet:var:%sortby-title-DESC%*/-->>название [Я-А]</option>
		<option value="alias:ASC"<!--/*fet:var:%sortby-alias-ASC%*/-->>алиас [A-Z]</option>
		<option value="alias:DESC"<!--/*fet:var:%sortby-alias-DESC%*/-->>алиас [Z-A]</option>
		<option value="date-up:DESC"<!--/*fet:var:%sortby-updated-DESC%*/-->>дата обновления [по убываню]</option>
		<option value="date-up:ASC"<!--/*fet:var:%sortby-updated-ASC%*/-->>дата обновления [по нарастанию]</option>
		</select>
		&nbsp;&nbsp;&nbsp;&nbsp;
		Показывать на странице:
		<select id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-showcnt" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-showcnt">
		<option value="10"<!--/*fet:var:%showcnt-10%*/-->>10, по умолчанию</option>
		<option value="20"<!--/*fet:var:%showcnt-20%*/-->>20</option>
		<option value="30"<!--/*fet:var:%showcnt-30%*/-->>30</option>
		<option value="40"<!--/*fet:var:%showcnt-40%*/-->>40</option>
		<option value="50"<!--/*fet:var:%showcnt-50%*/-->>50</option>
		<option value="100"<!--/*fet:var:%showcnt-100%*/-->>100</option>
		<option value="">все</option>
		</select>
		&nbsp;&nbsp;&nbsp;&nbsp;
		<label><input type="checkbox" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-hide" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-hide"<!--/*fet:var:%hide%*/--> /> скрыть отключенные</label>
	</div>
	<table class="<!--/*fet:def:parent*/-->-table" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-table" cellpadding="3" cellspacing="0">
	<thead><tr>
	<th>&nbsp;</th>
	<th>Название страницы</th>
	<th>Алиас [часть URL]</th>
	<th style="width:90px;">Включена</th>
	<th style="width:90px;">Заголовок</th>
	<th style="width:90px;">Разметка</th>
	<th style="width:90px;">Байндинги</th>
	<th style="width:90px;">Создана</th>
	<th style="width:90px;">Обновлена</th>
	<th style="width:35px;">ID</th>
	<th>&nbsp;</th>
	</tr></thead>
	<tbody>
	<!--/*fetc:%entries%*/-->
	<tr id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-item<!--/*fet:var:%id%*/-->">
	<td class="admin-quick"><span value="quick:<!--/*fet:var:%id%*/-->" title="Быстрая правка"></span></td>
	<td><span id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-title<!--/*fet:var:%id%*/-->" class="admin-go" value="edit:<!--/*fet:var:%id%*/-->" title="Редактировать страницу"><!--/*fet:var:%title%*/--></span></td>
	<td id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-alias<!--/*fet:var:%id%*/-->"><!--/*fet:var:%alias%*/--></td>
	<td><span class="admin-tune<!--/*fet:var:%spanAct%*/-->" value="switch:<!--/*fet:var:%id%*/-->" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-act<!--/*fet:var:%id%*/-->"><!--/*fet:var:%spanActText%*/--></span></td>
	<td><span class="admin-tune<!--/*fet:var:%spanST%*/-->" value="title:<!--/*fet:var:%id%*/-->" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-showtitle<!--/*fet:var:%id%*/-->"><!--/*fet:var:%spanSTText%*/--></span></td>
	<td><span class="admin-tune<!--/*fet:var:%spanNL%*/-->" value="layout:<!--/*fet:var:%id%*/-->" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-layout<!--/*fet:var:%id%*/-->"><!--/*fet:var:%spanNLText%*/--></span></td>
	<td><span class="admin-tune" value="bind:<!--/*fet:var:%id%*/-->">[Изменить]</span></td>
	<td class="date"><!--/*fet:var:%created%*/--></td>
	<td class="date" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-updated<!--/*fet:var:%id%*/-->"><!--/*fet:var:%updated%*/--></td>
	<td><!--/*fet:var:%id%*/--></td>
	<td class="admin-del"><span title="Удалить страницу"></span></td>
	</tr>
	<!--/*/fetc:%entries%*/-->
	</tbody>
	</table>
	<div class="pager"><input type="hidden" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-pager" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-pager" value="" /><!--/*fetc:%pager%*/--><span class="page-go <!--/*fet:var:%pact%*/-->"><!--/*fet:var:%num%*/--></span><!--/*/fetc:%pager%*/--></div>
</div>
<!--/*/fet:%content-list%*/-->

<!--/*fet:%content-list-create%*/-->
<div style="display:none;">
	<div class="<!--/*fet:def:section*/-->" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->">
		<div class="title">&nbsp;Создание страницы</div>
		Введите заголовок страницы:<br />
		<div class="field-has-btn">
			<input type="text" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-title" value="" />
			<span class="field-btn gen" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btn-translit" title="Сгенерировать алиас">&nbsp;</span>
		</div>
		<br />
		Введите алиас (часть URL):<br />
		<div class="field-has-btn">
			<input type="text" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-alias" value="" />
			<span class="field-btn check" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btn-check" title="Проверить алиас">&nbsp;</span>
		</div>
		<div class="silent-err-msg" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-msg">&nbsp;</div>
		<div class="btns" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btns">
			<a href="#" class="btn" onclick="return false" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btn-cancel"><span class="alnr">&nbsp;</span><span>Отмена</span></a>
			<div class="sp"></div>
			<a href="#" class="btn" onclick="return false" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btn-create"><span class="alnr">&nbsp;</span><span>Создать</span></a>
		</div>
	</div>
</div>
<!--/*/fet:%content-list-create%*/-->

<!--/*fet:%content-list-quick%*/-->
<div style="display:none;">
	<div class="<!--/*fet:def:section*/-->" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->">
		<div class="title">&nbsp;Быстрое редактирование страницы</div>
		Введите заголовок страницы:<br />
		<div class="field-has-btn">
			<input type="text" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-title" value="" />
			<span class="field-btn gen" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btn-translit" title="Сгенерировать алиас">&nbsp;</span>
		</div>
		<br />
		Введите алиас (часть URL):<br />
		<div class="field-has-btn">
			<input type="text" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-alias" value="" />
			<span class="field-btn check" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btn-check" title="Проверить алиас">&nbsp;</span>
		</div>
		<br />
		META DESCRIPTION (будет включено в HEAD страницы):<br />
		<input type="text" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-meta-description" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-meta-description" value="" /><br />
		<br />
		META KEYWORDS (будет включено в HEAD страницы):<br />
		<input type="text" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-meta-keywords" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-meta-keywords" value="" /><br />
		<br />
		<div class="switches">
			<div class="item">Включена:</div>
			<div class="item switch" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-swact">Да</div>
			<div class="item">Показывать заголовок:</div>
			<div class="item switch" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-swtitle">Да</div>
			<div class="item">Разметка страницы:</div>
			<div class="item switch" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-swlayout">Да</div>
		</div>
		<div class="silent-err-msg" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-msg">&nbsp;</div>
		<div class="btns" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btns">
			<a href="#" class="btn" onclick="return false" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btn-cancel"><span class="alnr">&nbsp;</span><span>Закрыть</span></a>
			<div class="sp"></div>
			<a href="#" class="btn" onclick="return false" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btn-edit"><span class="alnr">&nbsp;</span><span>Сохранить</span></a>
		</div>
	</div>
</div>
<!--/*/fet:%content-list-quick%*/-->

<!--/*fet:%content-edit%*/-->
<div class="<!--/*fet:def:section*/-->">
	<input type="hidden" id="<!--/*fet:def:parent*/-->-<!--/*fet:var:%sectName%*/-->-id" name="<!--/*fet:def:parent*/-->-<!--/*fet:var:%sectName%*/-->-id" value="<!--/*fet:var:%id%*/-->" />
	Заголовок страницы:<br />
	<div class="field-has-btn">
		<input type="text" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-title" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-title" value="<!--/*fet:var:%title%*/-->" />
		<span class="field-btn gen" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btn-translit" title="Сгенерировать алиас">&nbsp;</span>
	</div>
	<br />
	Алиас страницы (будет фигурировать в URL, вводить без слешей):
	<div class="field-has-btn">
		<input type="text" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-alias" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-alias" value="<!--/*fet:var:%alias%*/-->" />
		<span class="field-btn ok" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-btn-check" title="Проверить алиас">&nbsp;</span>
	</div>
	<br />
	META DESCRIPTION (будет включено в HEAD страницы):<br />
	<input type="text" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-meta-description" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-meta-description" value="<!--/*fet:var:%meta-description%*/-->" /><br />
	<br />
	META KEYWORDS (будет включено в HEAD страницы):<br />
	<input type="text" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-meta-keywords" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-meta-keywords" value="<!--/*fet:var:%meta-keywords%*/-->" /><br />
	<br />
	<div class="switches">
		<div class="item">Включена:</div>
		<div class="item switch <!--/*fet:var:%act-off%*/-->" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-swact"><!--/*fet:var:%act-yes%*/--></div>
		<div class="item">Показывать заголовок:</div>
		<div class="item switch <!--/*fet:var:%title-off%*/-->" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-swtitle"><!--/*fet:var:%title-yes%*/--></div>
		<div class="item">Разметка страницы:</div>
		<div class="item switch <!--/*fet:var:%layout-off%*/-->" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-swlayout"><!--/*fet:var:%layout-yes%*/--></div>
	</div>
	<div class="field-title">Содержимое страницы:</div>
	<div class="morebtns" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-morebtns"></div>
	<div class="moreopts" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-moreopts"></div>
	<!--/*fet:var:%wrap-start%*/-->
			<div id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-cke-body" class="body">
				<!--/*fet:var:%body%*/-->
			</div>
	<!--/*fet:var:%wrap-end%*/-->
	<script type="text/javascript">
		(function(d) {
			var rs = d.getElementsByTagName("SCRIPT")[0];
			s = d.createElement("SCRIPT");
			s.async = true;
			s.src = "<!--/*fet:var:%editor-path%*/-->/ckeditor.js";
			rs.parentNode.insertBefore(s, rs);
		})(document);
	</script>
</div>
<!--/*/fet:%content-edit%*/-->

<!--/*fet:%modules-data%*/-->
<div class="<!--/*fet:def:section*/-->">
	<input type="hidden" id="<!--/*fet:def:parent*/-->-modules-id" name="<!--/*fet:def:parent*/-->-modules-id" value="" />
	<div class="sub-tabs <!--/*fet:var:%tab%*/-->">
		<a href="" class="tab-ref self" onclick="return false" />Данные</a>
		<a href="" class="tab-ref code" onclick="return false" />Исходники</a>
		<a href="" class="tab-ref cfg" onclick="return false" />Конфигурация</a>
	</div>
	<div class="sp-line"></div>
	<!--/*fet:var:%data%*/-->
</div>
<!--/*/fet:%modules-data%*/-->

<!--/*fet:%modules-list%*/-->
<div class="<!--/*fet:def:section*/-->">
	<input type="hidden" id="<!--/*fet:def:parent*/-->-modules-id" name="<!--/*fet:def:parent*/-->-modules-id" value="" />
	<div class="filters">
		<input type="hidden" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-filter" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-filter" value="" />
		Сортировать по:&nbsp;
		<select id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-sortby" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-sortby" onchange="render.pluginGet('<!--/*fet:def:parent*/-->').callWorker('listOnClickFilter',['sortby'])">
		<option value="title:ASC"<!--/*fet:var:%sortby-title-ASC%*/-->>название [А-Я], по умолчанию</option>
		<option value="title:DESC"<!--/*fet:var:%sortby-title-DESC%*/-->>название [Я-А]</option>
		<option value="name:ASC"<!--/*fet:var:%sortby-class-ASC%*/-->>php-класс [A-Z]</option>
		<option value="name:DESC"<!--/*fet:var:%sortby-class-DESC%*/-->>php-класс [Z-A]</option>
		<option value="date-cr:DESC"<!--/*fet:var:%sortby-created-DESC%*/-->>дата создания [по убываню]</option>
		<option value="date-cr:ASC"<!--/*fet:var:%sortby-created-ASC%*/-->>дата создания [по нарастанию]</option>
		<option value="date-up:DESC"<!--/*fet:var:%sortby-updated-DESC%*/-->>дата обновления [по убываню]</option>
		<option value="date-up:ASC"<!--/*fet:var:%sortby-updated-ASC%*/-->>дата обновления [по нарастанию]</option>
		</select>
		&nbsp;&nbsp;&nbsp;&nbsp;
		Показывать на странице:
		<select id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-showcnt" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-showcnt" onchange="render.pluginGet('<!--/*fet:def:parent*/-->').callWorker('listOnClickFilter',['showcnt'])">
		<option value="10"<!--/*fet:var:%showcnt-10%*/-->>10, по умолчанию</option>
		<option value="20"<!--/*fet:var:%showcnt-20%*/-->>20</option>
		<option value="30"<!--/*fet:var:%showcnt-30%*/-->>30</option>
		<option value="40"<!--/*fet:var:%showcnt-40%*/-->>40</option>
		<option value="50"<!--/*fet:var:%showcnt-50%*/-->>50</option>
		<option value="100"<!--/*fet:var:%showcnt-100%*/-->>100</option>
		<option value="">все</option>
		</select>
		&nbsp;&nbsp;&nbsp;&nbsp;
		<label><input type="checkbox" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-hidesys" name="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->-hidesys" onchange="render.pluginGet('<!--/*fet:def:parent*/-->').callWorker('listOnClickFilter',['hidesys'])"<!--/*fet:var:%hidesys%*/--> /> скрывать системные модули</label>
	</div>
	<table class="<!--/*fet:def:parent*/-->-table" cellpadding="3" cellspacing="0">
	<thead><tr>
	<th style="width:20px;"><input type="checkbox" title="Выделить все" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').callWorker('selectAll')" /></th>
	<th>Название</th>
	<th>Система</th>
	<th>PHP класс</th>
	<th style="width:120px;">Включен</th>
	<th style="width:120px;">Байндинги</th>
	<th style="width:120px;">Создан</th>
	<th style="width:120px;">Обновлен</th>
	<th style="width:50px;">ID</th>
	</tr></thead>
	<tbody>
	<!--/*fetc:%entries%*/-->
	<tr id="<!--/*fet:def:parent*/-->-modules-item<!--/*fet:var:%id%*/-->" class="<!--/*fet:var:%core%*/-->">
	<td><!--/*fet:var:%check%*/--></td>
	<td><span id="<!--/*fet:def:parent*/-->-modules-title<!--/*fet:var:%id%*/-->" class="admin-go" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').callWorker('listOnClickEdit',[<!--/*fet:var:%id%*/-->])"><!--/*fet:var:%title%*/--></span></td>
	<td><!--/*fet:var:%isAdminText%*/--></td>
	<td><!--/*fet:var:%module%*/-->&nbsp;::<input type="hidden" name="<!--/*fet:def:parent*/-->-modules-aliases[]" value="<!--/*fet:var:%id%*/-->:<!--/*fet:var:%module%*/-->" /></td>
	<td><span<!--/*fet:var:%spanAct%*/-->><!--/*fet:var:%spanActText%*/--></span></td>
	<td><span<!--/*fet:var:%spanTune%*/-->><!--/*fet:var:%spanTuneText%*/--></span></td>
	<td class="date"><!--/*fet:var:%created%*/--></td>
	<td class="date"><!--/*fet:var:%updated%*/--></td>
	<td><!--/*fet:var:%id%*/--></td>
	</tr>
	<!--/*/fetc:%entries%*/-->
	</tbody>
	</table>
	<input type="hidden" id="<!--/*fet:def:parent*/-->-modules-chks" value="<!--/*fet:var:%ids%*/-->" />
	<div class="pager"><input type="hidden" id="<!--/*fet:def:parent*/-->-modules-list-pager" name="<!--/*fet:def:parent*/-->-modules-list-pager" value="" /><!--/*fetc:%pager%*/--><span class="page-go <!--/*fet:var:%pact%*/-->" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').callWorker('listOnClickPager',[<!--/*fet:var:%page%*/-->,this])"><!--/*fet:var:%num%*/--></span><!--/*/fetc:%pager%*/--></div>
</div>
<!--/*/fet:%modules-list%*/-->

<!--/*fet:%system%*/-->
<div class="title-php">PHP</div>
<table cellpadding="3" cellspacing="0" border="0">
<!--/*fetc:%php%*/-->
<tr class="row<!--/*fet:var:%row%*/-->"><td width="300"><!--/*fet:var:%name%*/--></td><td width="300"><!--/*fet:var:%value%*/--></td></tr>
<!--/*/fetc:%php%*/-->
</table>
<div class="title-mysql">MySQL</div>
<table cellpadding="3" cellspacing="0" border="0">
<!--/*fetc:%mysql%*/-->
<tr class="row<!--/*fet:var:%row%*/-->"><td width="300"><!--/*fet:var:%name%*/--></td><td width="300"><!--/*fet:var:%value%*/--></td></tr>
<!--/*/fetc:%mysql%*/-->
</table>
<!--/*/fet:%system%*/-->

<!--/*fet:%login-box%*/-->
<div class="<!--/*fet:def:parent*/-->">
	<div class="<!--/*fet:def:section*/-->" id="<!--/*fet:def:parent*/-->-<!--/*fet:def:section*/-->">
		<div class="aligner"></div><div class="inner">
		<input type="hidden" id="<!--/*fet:def:parent*/-->-section-id" name="<!--/*fet:def:parent*/-->-section-id" value="<!--/*fet:var:%sectId%*/-->" />
		<input type="hidden" id="<!--/*fet:def:parent*/-->-section-name" name="<!--/*fet:def:parent*/-->-section-name" value="<!--/*fet:var:%sectName%*/-->" />
		<h2>Авторизация</h2>
		<!--/*fet:var:%note%*/-->
		<br />
		<br />
		<div style="overflow:hidden;">
			<div class="title" style="margin-top:20px;">
				Логин:
			</div>
			<div class="field" style="margin-top:20px;">
				<input name="<!--/*fet:def:parent*/-->-login-name" id="<!--/*fet:def:parent*/-->-login-name" type="text" class="input" title="Имя пользователя" value="<!--/*fet:var:%login%*/-->" maxlength="32" />
			</div>
		</div>
		<div style="overflow:hidden;">
			<div class="title">
				Пароль:
			</div>
			<div class="field">
				<input name="<!--/*fet:def:parent*/-->-login-pass" id="<!--/*fet:def:parent*/-->-login-pass" type="password" class="input" title="Пароль" value="" maxlength="32" />
			</div>
		</div>
		<br />
		<span class="options">
			<input type="checkbox" name="1" value="1"> Запомнить меня<a href="#" style="margin-left:30px;">Забыли пароль?</a>
		</span>
		<br />
		<br />
		<div style="overflow:hidden">
			<div class="btn" onclick="render.pluginGet('<!--/*fet:def:parent*/-->').login()"></div>
		</div>
		</div>
	</div>
</div>
<!--/*/fet:%login-box%*/-->