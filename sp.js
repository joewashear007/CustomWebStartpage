
//-------------- Varibles -------------
//Misc
TIME_OUT 		= 250;
ITEMS_SHOWN		= 5;
SETUP_ELEMENT	= '#sp';
LOCK_GROUP		= 'lock';
SEARCH_ENGS		= "#searchEng";
//Main StartPage
STARTPAGE		= 'StartPage';
STARTPAGE_SLC	= '#'+STARTPAGE;
SP_CELL			= 'area';
SP_CELL_SLC		= '.'+SP_CELL;
//Sliders
SLIDER			= 'slider';
SLIDER_SLC		= '.'+SLIDER;
SLIDER_COLOR	= 'slider_color';
START_SLD		= 'start';
END_SLD			= 'end';
START_SLD_SLC	= '#'+START_SLD;
END_SLD_SLC		= '#'+END_SLD;
//Groups
GROUP			= 'group';
GROUP_SLC		= '.'+GROUP;
GROUP_TBL		= 'GroupTable';
GROUP_TBL_SLC 	= '#'+GROUP_TBL;
GROUP_TITLE		= 'title';
GROUP_TITLE_SLC = '.'+GROUP_TITLE;
MORE_LINKS		= 'moreLinks';
MORE_LINKS_SLC	= '.'+MORE_LINKS;
LINK			= 'link';
LINK_SLC		= '.'+LINK;
//Search
SEARCH			= "SPsearch";
SEARCH_SLC		= '#'+SEARCH;
QUERY_BOX		= 'query';
QUERY_BOX_SLC	= '#'+QUERY_BOX;
SEARCH_FORM		= 'search';
SEARCH_FORM_SLC = '#'+SEARCH_FORM;
//################# FUNCTIONS ########################
$(document).ready( function() {
	setup();
	hideShow();

	//Event handeling
	$(window).resize( function() 		{ 		hideShow();  		});
	$(SLIDER_SLC).click(function() 		{		slide(this);		});
	$(GROUP_SLC).mouseenter( function() {		showGroup(this);	});
	$(GROUP_SLC).mouseleave( function() {		hideGroup(this);	});
	$(GROUP_SLC).click( function() 		{		$(this).toggleClass(LOCK_GROUP);	});
	$(":button").click(function() {
		$(SEARCH_FORM_SLC).attr("action", $(this).attr("action"));
		$(QUERY_BOX_SLC).attr("name", $(this).attr("name"));
		$(SEARCH_FORM_SLC).submit();
	});
});
//Main Setup Scrpit
function setup(){
	$('body').append('<div id="'+SEARCH+'" ><h1 class="logo">StartEng</h1></div>'+
					'<table id='+STARTPAGE+'><tr>'+
					'<td class="'+SLIDER+' '+SLIDER_COLOR+'"><div id='+START_SLD+'><</div></td>'+
					'<td class='+SP_CELL+' ></td>'+
					'<td class="'+SLIDER+' slider_color"><div id='+END_SLD+'>></div></td></tr></table>'+
					'<br><br><br><br><p>Copyright JJ Programs</p>');
	$(SP_CELL_SLC).append('<table id='+GROUP_TBL+'><tr>'+
						'</tr></table>');

	$(SETUP_ELEMENT).children('div').each( function() {
		var attrName = $(this).attr('name');
		$(GROUP_TBL_SLC+' tr:first').append('<td class='+GROUP+'><div name='+attrName+' class="group_spacer">'+
											'<h1 class='+GROUP_TITLE+'>'+$(this).children('h1').text()+
											'</h1><span class='+MORE_LINKS+'></span></div></td>');
		i = 0;
		$(this).children('a').each( function() {
			if( i < ITEMS_SHOWN)
				$('[name='+attrName+'] '+MORE_LINKS_SLC).before('<a href="'+$(this).attr('href')+'" class="'+LINK+'">'+$(this).text()+'</a>');
			else
				$('[name='+attrName+'] '+MORE_LINKS_SLC).append('<a href="'+$(this).attr('href')+'" class="'+LINK+'">'+$(this).text()+'</a>');
			i++;
		});

	});
	createSearch();
	$(MORE_LINKS_SLC).slideUp();
	$(SETUP_ELEMENT).remove();
}
//-------------- Slider Functions -----------------
function slide(slc){
	if( $(slc).children('div').first().is(':visible') ){
		if( $(slc).children('div').first().attr('id') == START_SLD )	leftSilde();
		else															rightSlide();
	}
}
function rightSlide() {
	if( $(GROUP_SLC+':visible').length > 2 ){
		if(!isAnimated()){
			$('.group:visible:first').children().hide("slide", { direction: "left" }, TIME_OUT,
				function() {
					$('.group:visible:first').hide();
					hideShow();
				} );

		}
	}
}
function leftSilde() {
	if(!isAnimated() ){
		$(GROUP_SLC+':visible:first').prev().show();
		$(GROUP_SLC+':visible:first').children().show("slide", { direction: "left" }, TIME_OUT,
			function() {
				hideShow();
			} );
	}
}
function toggleSliders(){
	if( $(GROUP_SLC+':first').is(':hidden') ){ 	$(START_SLD_SLC).show(); $(START_SLD_SLC).parent().addClass(SLIDER_COLOR); }
	else									 {	$(START_SLD_SLC).hide(); $(START_SLD_SLC).parent().removeClass(SLIDER_COLOR); }

	if( $(GROUP_SLC+':last').is(':hidden') ){	$(END_SLD_SLC).show();  $(END_SLD_SLC).parent().addClass(SLIDER_COLOR); }
	else									{	$(END_SLD_SLC).hide();  $(END_SLD_SLC).parent().removeClass(SLIDER_COLOR); }
}
// ------------------ Group Functions -------------
function hideGroup(slc){
	if( !$(slc).hasClass(LOCK_GROUP) )
		$(MORE_LINKS_SLC, slc).slideUp();
}
function showGroup(slc){
	$(MORE_LINKS_SLC, slc).slideDown();
}
function hideShow() {
	var cellWidth 		= $(SP_CELL_SLC).width();
	var groupsWidth 	= $(GROUP_TBL_SLC).width();
	var nextGroupWidth 	= 1;
	var run				= true;

	while( run && (groupsWidth > cellWidth) ){
		if( $(GROUP_SLC+':visible').length > 2 )
			$(GROUP_SLC+':visible:last').hide();
		else
			run = false;
		groupsWidth	= $(GROUP_TBL_SLC).width();
	}
	run = true;
	while( run && (nextGroupWidth > 0) ){
		groupsWidth	= $(GROUP_TBL_SLC).width();
		if( $(GROUP_SLC+':visible:last').next(':hidden').length !== 0 )
			nextGroupWidth = $(GROUP_SLC+':visible:last').next(':hidden').width();
		else
			nextGroupWidth = 0;
		if( cellWidth > (groupsWidth + nextGroupWidth) )
			$(GROUP_SLC+':visible:last').next(':hidden').show();
		else
			run = false;
	}
	toggleSliders();
}
//---------------------- Miss Functions -------------
function isAnimated(){
	if($('*').is(':animated') )
		return true;
	else
		return false;
}



//---------------- NEEDS WORK!!! -----------------
function createSearch(){


// Search bar
	var form = "";
	form += '<center><form method="get" action="" id="'+SEARCH_FORM+'">';
	form += '<input name="query" type="text" id="query" size="30" maxsize="255" value="" placeholder="Enter Query"  class="query" />';
	form += '</form></center>';
	$(SEARCH_SLC).append(form);

//Buttons
	$(SEARCH_ENGS).children("input").each( function() {
		$(SEARCH_SLC+" form").append('<input type="button" class="button" name="'+$(this).attr("name")+'" action="'+$(this).attr("action")+'">');
	});

//Set action to first button
	$(SEARCH_FORM_SLC).attr("action", $(":button").first().attr("action"));
	$(QUERY_BOX_SLC).attr('name', $(SEARCH_SLC).find('input .button').first().attr('name') );
	$(SEARCH_SLC).find("input").first().focus();

//remove the SearchEngs
	$(SEARCH_ENGS).remove();
}
