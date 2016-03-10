(function(){
    'use strict';
    var $stateProviderRef;

    var fileUploadApp = angular.module('fileUploadApp', [
        'ui.router',
        'ui.bootstrap',
        'ngMessages',
        'ngStorage',
        'restangular',
        'permission',
        'angularFileUpload',
        'btford.markdown'
    ]);

    fileUploadApp.config(function($locationProvider, $stateProvider, $urlRouterProvider){
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home',{
                url: '/',
                templateUrl: 'modules/partials/home.html',
                controller: 'HomeCtrl as vm'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'modules/partials/login.html',
                controller: 'LoginCtrl as vm',
                data:{
                    permissions:{
                        only:['anonymous'],
                        redirectTo: 'profile'
                    }
                }
            })
            .state('register', {
                url: '/register',
                templateUrl: 'modules/partials/register.html',
                controller: 'RegisterCtrl as vm',
                data:{
                    permissions:{
                        only:['anonymous'],
                        redirectTo: 'profile'
                    }
                }
            });


            $stateProviderRef = $stateProvider;


    });

    fileUploadApp.run(function(PermissionStore, $localStorage, $urlMatcherFactory){

        function valToString(val) { return val != null ? val.toString() : val; }

        function regexpMatches(val) { /*jshint validthis:true */ return this.pattern.test(val); }

        $urlMatcherFactory.type("uriType", {
            encode: valToString, decode: valToString, is: regexpMatches, pattern: /[a-zA-Z0-9_/]*/
        });

        $stateProviderRef.state('profile', {
            url: '/profile/{folderPath:uriType}',
            templateUrl: 'modules/partials/profile.html',
            controller: 'UploadCtrl as vm',
            data: {
                permissions: {
                    except: ['anonymous'],
                    redirectTo: 'home'
                }
            }
        });

        PermissionStore
            .definePermission('anonymous', function(stateParams){
                return !$localStorage.token;
            });
    });

})();