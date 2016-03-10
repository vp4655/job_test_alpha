(function(){
    'use strict';

    angular
        .module('fileUploadApp')
        .controller('LoginCtrl', LoginCtrl)
        .controller('RegisterCtrl', RegisterCtrl);

    LoginCtrl.$inject = ['$state', 'Restangular', '$localStorage', 'AlertService', '$rootScope'];

    function LoginCtrl($state, Restangular, $localStorage, AlertService, $rootScope){
        var vm = this;
        vm.loginData ={};
        vm.login = login;

        function login(){
            Restangular.all('auth/login').post(vm.loginData).then(function(response){
                $localStorage.token = response.token;
                $localStorage.username = response.username;

                Restangular.setDefaultHeaders({'x-access-token': response.token});

                $state.go('profile', {folderPath: response.username});

            }, function(error){
                AlertService.add('danger', error.data.message);
            })
        }
    }

    RegisterCtrl.$inject = ['$state', 'Restangular', 'AlertService', '$rootScope', '$localStorage'];

    function RegisterCtrl($state, Restangular, AlertService, $rootScope, $localStorage){
        var vm = this;
        vm.registerData = {};
        vm.register = register;

        function register(){
            Restangular.all('auth/register').post(vm.registerData).then(function(response){

                $localStorage.token = response.token;
                $localStorage.username = response.username;

                Restangular.setDefaultHeaders({'x-access-token': response.token});

                $state.go('profile', {folderPath: response.username});
            }, function(error){
               AlertService.add('danger', error.data.message);
            });
        }
    }

})();