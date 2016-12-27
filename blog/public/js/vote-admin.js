$(document).ready(function(){
			// 投票服务管理 -添加投票主题时-时间段选择
			if ($('#reservationtime').length > 0) {
				$('#reservationtime').daterangepicker({
					timePicker: true,
					timePickerIncrement: 30,
					format : 'YYYY-MM-DD HH:mm',
				// startDate: '2016-01-01',
				// endDate: '2016-12-31'

				// minDate: '2016-07-12 00:00:01', //最小时间
				// maxDate : '2016-09-12 23:59:59', //最大时间
				}, function(start, end, label) {
					 console.log(start.toISOString(), end.toISOString(),label);
				});
			}
});
