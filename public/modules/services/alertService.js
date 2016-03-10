(function(){
    'use strict';

    angular
        .module('fileUploadApp')
        .factory('AlertService', AlertService);

    AlertService.$inject = ['$rootScope', '$timeout'];

    function AlertService($rootScope, $timeout){
        var alertService = {};

        $rootScope.alerts = [];

        alertService.add = Add;

        alertService.closeAlert = CloseAlert;

        alertService.closeAllAlerts = CloseAll;

        return alertService;


        function Add(type, msg) {
            if($rootScope.alerts.length > 0) {
                alertService.closeAlert($rootScope.alerts[0]);
            }
            $rootScope.alerts.push({'type': type, 'msg': msg});
            $timeout(function(){
                CloseAll();
            }, 5000);

        }

        function CloseAlert(index) {
            $rootScope.alerts.splice(index, 1);
        }

        function CloseAll(){
            $rootScope.alerts = [];
        }
    }

})();