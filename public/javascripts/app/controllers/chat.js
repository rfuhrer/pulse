PulseApp.controller('ChatCtrl', ['$scope', '$rootScope', '$chatService', '$pageInfoService', '$sce',
	function($scope, $rootScope, $chatService, $pageInfoService, $sce){
		$rootScope.activeView='Chat';

		$scope.chatMessages = $chatService.chatMessages;
		$scope.users = $chatService.users;
		$scope.audioSrc = '';

		$scope.user = $rootScope.user;
		
		$scope.message = '';
		$scope.addMessage = function(){
			if($scope.message){
				var message = new $chatService.ChatMessage();
				message.text = unicode_replace($scope.message);
				message.user = $scope.user;
				message.$save();
				$scope.message='';
			}
		};
		
		$scope.$watch('user', function(newVal){
			if(newVal){
				window.localStorage.setItem('pulseUsername', newVal);
				$rootScope.user = newVal;			
			}
			$chatService.updateName(newVal || 'no_name');
		}, true);
		
		$scope.$watch('chatMessages', function(newVal){
			if(newVal.length) {
				$pageInfoService.enableNewMessageNotification();
				var newMessage = newVal[newVal.length-1];
				$scope.audioSrc = $sce.trustAsResourceUrl(newMessage.audio);

				if(newMessage.text.toLowerCase().indexOf('@'+$rootScope.user.toLowerCase())>=0)
					notify(newMessage.text);					
			}
		}, true);

		var lastTypingNotification = moment().subtract('s', 3);
		$scope.notifyTyping = function(){
			var threeSecondsAgo = moment().subtract('s', 3);
			if(threeSecondsAgo>lastTypingNotification){
				lastTypingNotification=moment();
				$chatService.sendTypingNotification();
			}
		}

		$scope.clearNotifications = function(){
			$pageInfoService.disableNewMessageNotification();
		}

		$scope.likeMessage = function(id){
			$chatService.likeMessage(id);
		};

		function notify(message) {
			if(window.webkitNotifications){
			  if (window.webkitNotifications.checkPermission() > 0) {
			    RequestPermission(notify);
			  } else {
			    var notification = window.webkitNotifications.createNotification('/images/icon.png', message, '');
			    notification.show();
			  }
			}
		}

		var unicode_replace = function(str){
			var unicode = /\\u([a-f,0-9]{4})*/ig;

			str = str.replace(unicode, function(code){
				return code.substring(2)
					.match(/.{4}/g)
					.map(function(segment) {
						return String.fromCharCode(parseInt(segment, 16));
					})
					.join('');
			});

			return str;
		};
}]);
