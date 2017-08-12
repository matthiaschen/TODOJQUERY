;(function(){

	var $form_add_task = $(".add-task")
	, task_list = []
	, $checkbox_complete
	, $task_delete_trigger 
	, $task_detail_trigger 
	, $task_detail = $(".task-detail")
	, current_index
	, $update_form
	, $task_detail_content
	, $task_detail_content_input
	, $task_detail_mask = $(".task-detail-mask")
	;



	init();
	$form_add_task.on('submit', on_add_task_form_submit);
	$task_detail_mask.on('click',  hide_task_detail);

	function init(){
		task_list = store.get('task_list') || [];
		if (task_list.length)
			render_task_list();
	}

	function refresh_task_list(){
		store.set('task_list', task_list);
		render_task_list();
	}

	function listen_task_delete(){
		$task_delete_trigger.on('click', function(){
			var $this = $(this);
			var $item = $this.parent().parent();
			var index = $item.data('index');
			delete_task(index);
		})
	}

	function delete_task(index){
		if (index === undefined || !task_list[index]) return;
		delete task_list[index];
		refresh_task_list();
	}


	function listen_checkbox_complete(){
		$checkbox_complete.on('click', function(){
			var $this = $(this);
			var index = $this.parent().parent().data('index');
			var item = get(index);
			if (item.complete)
			{
				updata_task(index,{complete:false});
			}
			else
			{
				updata_task(index, {complete:true});
			}
		} )
	}

	function listen_task_detail(){
		var index;
    	$('.task-item').on('dblclick', function () {
     	 	index = $(this).data('index');
     		show_task_detail(index);
   		 })
		$task_detail_trigger.on('click',function(){
			var $this = $(this);
			var $item = $this.parent().parent();
			index = $item.data('index');
			show_task_detail(index);
		})
	}

	function show_task_detail(index){
		render_task_detail(index);
		$task_detail.show();
		$task_detail_mask.show();
	}

	function render_task_detail(index){
		if(!index || !task_list[index])
			return;
		var item = task_list[index];
		var tpl = '<form>' +
		'<div class="content">' +
		item.content +
		'</div>' +
		'<div class="input-item">' +
		'<input style="display: none;" type="text" name="content" value="' + (item.content || '') + '">' +
		'</div>' +
		'<div>' +
		'<div class="desc input-item">' +
		'<textarea name="desc">' + (item.desc || '') + '</textarea>' +
		'</div>' +
		'</div>' +
		'<div class="remind input-item">' +
		'<label>时间</label>' +
		'<input class="datetime" name="remind_date" type="text" value="' + (item.remind_date || '') + '">' +
		'</div>' +
		'<div class="input-item"><button type="submit">更新</button></div>' +
		'</form>';
		$task_detail.html(null);
		$task_detail.html(tpl);
		$('.datetime').datetimepicker();
		$update_form = $task_detail.find('form');
		$task_detail_content = $update_form.find('.content');
		$task_detail_content_input = $update_form.find('[name=content]');
		$task_detail_content.on('dblclick',function(){
			$task_detail_content_input.show();
			$task_detail_content.hide();
		})

		$update_form.on('submit', function(e){
			e.preventDefault();
			var data = {};
			data.content = $(this).find('[name = content]').val();
			data.desc = $(this).find('[name = desc]').val();
			data.remind_date = $(this).find('[name = remind_date]').val();
			updata_task(index,data);
			hide_task_detail();
		})




	}


	function hide_task_detail(){
		$task_detail.hide();
		$task_detail_mask.hide();

	}




	function get(index){
		return store.get('task_list')[index];
	}

	function updata_task(index, data){
		if(!index || !task_list[index])
			return;
		task_list[index] = $.extend({}, task_list[index], data);
		refresh_task_list();
	}



	function render_task_list(){
		var $task_list = $(".task-list");
		$task_list.html('');
		var complete_items = [];

		for (var i = 0; i<task_list.length; i++){
			var item = task_list[i];
			if(item && item.complete)
				complete_items[i] = item;
			else
				{var $task = render_task_item(item, i);
					$task_list.prepend($task);
				}
		}

		for (var i=0 ; i<task_list.length; i++){
			$task = render_task_item(complete_items[i],i);
			if(!$task) continue;
			$task.addClass('completed');
			$task_list.append($task);
		}

		$task_delete_trigger = $('.action.delete');
		$task_detail_trigger = $('.action.detail');
		$checkbox_complete = $('.task-list .complete[type=checkbox]');
		listen_task_delete();
		listen_task_detail();
		listen_checkbox_complete();
	}




	function render_task_item(data,index){

		if(!data|| !index) return;
		var item_tpl = 
		'<div class="task-item" data-index="' + index + '">' +
		'<span><input class="complete" ' + (data.complete ? 'checked' : '') + ' type="checkbox"></span>' +
		'<span class="task-content">' + data.content + '</span>' +
		'<span class="fr">' +
		'<span class="action delete"> 删除</span>' +
		'<span class="action detail"> 详细</span>' +
		'</span>' +
		'</div>';
		return $(item_tpl);
	}


	function add_task(new_task){
		task_list.push(new_task);
		refresh_task_list();
		return true;

	}


	function on_add_task_form_submit(e){
		var new_task = {}, $input;
		e.preventDefault();
		$input = $(this).find("input[name=content]");
		new_task.content = $input.val();
		if(!new_task.content)
			return;
		if(add_task(new_task)){
			$input.val(null);
		}
	}
})();