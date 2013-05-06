var PulseApp = angular.module('PulseApp', ['ngResource'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: '/javascripts/app/views/index.html',
			controller: 'IndexCtrl'
		})
		.when('/chat', {
			templateUrl: '/javascripts/app/views/chat.html',
			controller: 'ChatCtrl'
		})
		.otherwise({
			redirectTo:'/'
		});
}])
.run(['$rootScope', '$resource', function($rootScope, $resource){
	$rootScope.activeView='';

	$rootScope.Messages = $resource('/messages/:id', {}, {
		method: 'GET',
		cache:false
	});


	$rootScope.chatMessages = [];
		$rootScope.ChatMessage = $resource('/chat/:id', {},{
		method: 'GET',
		cache:false
	});
		
	$rootScope.socket = io.connect();
	$rootScope.socket.on('newchatmessage', function(message){
		$rootScope.$apply(function(){
	 		$rootScope.chatMessages.push(message);
		});
	 });

	$rootScope.needsAlertPermissions;
	function updatePermissions(){
		$rootScope.needsAlertPermissions = window.webkitNotifications && (window.webkitNotifications.checkPermission() > 0);
	}
	updatePermissions();

	$rootScope.enableNotifications = function(){
		window.webkitNotifications.requestPermission(updatePermissions);
		updatePermissions();
	}


}]);