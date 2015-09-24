'use strict';

angular.module('realTimeApp')
	.factory('Auth', function($firebaseSimpleLogin, FIREBASE_URL, $firebase, $rootScope){
		var ref = new Firebase(FIREBASE_URL);
		var auth = $firebaseSimpleLogin(ref);

		var Auth = {
			register: function (user) {
				return auth.$createUser(user.email, user.password);
			},
			createProfile: function (user) {
				var profile = {
					username: user.username,
					/*jshint camelcase: false */
					md5_hash: user.md5_hash
				};

				var profileRef = $firebase(ref.child('profile'));
				return profileRef.$set(user.uid, profile);
			},
			login: function (user) {
				return auth.$login('password', user);
			},
			logout: function() {
				auth.$logout();
			},
			resolveUser: function() {
				return auth.$getCurrentUser();
			},
			signedIn: function() {
				return !!Auth.user.provider;
			},
			user: {}
		};

		$rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
			console.log('logged in');

			angular.copy(user, Auth.user);
			Auth.user.profile = $firebase(ref.child('profile').child(Auth.user.uid)).$asObject();
			
			console.log(Auth.user);
		});

		$rootScope.$on('$firebaseSimpleLogin:logout', function() {
			console.log('logged out');

			if(Auth.user && Auth.user.profile) {
				Auth.user.profile.$destroy();
			}
			angular.copy({}, Auth.user);
		});

		return Auth;
	});