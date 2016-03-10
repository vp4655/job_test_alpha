(function(){
    'use strict';

    angular
        .module('fileUploadApp')
        .controller('UploadCtrl', UploadCtrl)
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    UploadCtrl.$inject = ['$state','Restangular', 'FileUploader', '$scope', '$localStorage', '$uibModal', '$stateParams', 'AlertService', '$rootScope', '$anchorScroll', '$location'];

    function UploadCtrl($state, Restangular, FileUploader, $scope, $localStorage, $uibModal, $stateParams, AlertService, $rootScope, $anchorScroll, $location){
        var vm = this;
        vm.username = $localStorage.username;
        vm.path = $stateParams.folderPath;
        vm.empty = false;

        vm.closeLink = closeLink;
        vm.deleteItem = deleteItem;
        vm.getDownloadLink = getDownloadLink;
        vm.intoFolder = intoFolder;
        vm.open = open;

        vm.files = [];
        vm.folders = [];

        Restangular.setDefaultHeaders({'x-access-token': $localStorage.token, 'Folder' : vm.path});

        Restangular.one('api/folder').get().then(function(folders){
            if(vm.path !== vm.username){
                vm.folders.push({dir: '..'});
            }

            for(var i=0; i< folders.dir.length; i++){
                if(folders.stats[i].is_dir){
                    vm.folders.push({dir: folders.dir[i]});
                }else{
                    vm.files.push({dir: folders.dir[i]});
                }
            }

            if(vm.folders.length === 0){
                vm.empty = true;
            }
        }, function(error){
            AlertService.add('danger', error.data.message);
        });

        $scope.uploader = new FileUploader({
            url: '/api/upload',
            headers: {'x-access-token': $localStorage.token, 'folder': vm.path}
        });

        $scope.uploader.onSuccessItem = function(item, response, status, headers){
            //console.log(status);
            //console.log(response);
            $scope.$emit('uploaded');
        };

        $scope.uploader.onErrorItem = function(item, response, status, headers){
            //console.log(response);
            if(response){
                AlertService.add('danger', response.message);
            }
            else{
                AlertService.add('warning', 'Upload is taking too long, file will be uploaded eventually.');
            }
        };

        $scope.$on('change', function() {
            intoFolder('');
        });

        $scope.$on('uploaded', function(){
            intoFolder('');
        });

        function closeLink(file){
            file.show = false;
        }

        function deleteItem(fileName){
            var deleteFile = vm.path + '/' + fileName;
            Restangular.one('/api/folder?folder=' + deleteFile).remove().then(function(){
                $scope.$emit('change');
            }, function(error){
                AlertService.add('danger', error.data.message);
            });
        }

        function getDownloadLink(file){
            var downloadFilePath = vm.path + '/' + file.dir;
            Restangular.one('/api/download?folder=' + downloadFilePath).get().then(function(link){
                file.show = true;
                file.downloadUrl = link.downloadUrl.url;
            }, function(error){
                AlertService.add('danger', error.data.message);
            })
        }

        function intoFolder(folder){
            //trenutni path + /odabrani folder
            //prikaz novih foldera i fileova
            //moramo pamtiti trenutni path
            vm.empty = false;

            if(folder === '..'){
                vm.path = vm.path.substr(0, vm.path.lastIndexOf('/'));
            }
            else{
                if(folder !== ''){
                    vm.path += '/' + folder;
                }
                else{
                    $scope.uploader.headers.folder = vm.path;

                    Restangular.setDefaultHeaders({'x-access-token': $localStorage.token, 'Folder' : vm.path});

                    Restangular.one('api/folder').get().then(function(folders){
                        vm.folders = [];
                        vm.files = [];

                        if(vm.path !== vm.username){
                            vm.folders.push({dir: '..'});
                        }

                        for(var i=0; i< folders.dir.length; i++){
                            if(folders.stats[i].is_dir){
                                vm.folders.push({dir: folders.dir[i]});
                            }else{
                                vm.files.push({dir: folders.dir[i]});
                            }
                        }
                    }, function(error){
                         AlertService.add('danger', error.data.message);
                    });
                }
            }

            $scope.uploader.headers.folder = vm.path;

            $state.go('profile', {folderPath: vm.path});

        }

        function open(){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    path: function () {
                        return vm.path;
                    }
                }
            });

            modalInstance.result.then(function (name) {
                $scope.selected = name;
            }, function () {

            });
        }

    }

    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'Restangular', '$localStorage', '$rootScope', 'path'];

    function ModalInstanceCtrl($scope, $uibModalInstance, Restangular, $localStorage, $rootScope, path){

        $scope.folderName = '';
        $scope.path = path;

        Restangular.setDefaultHeaders({'x-access-token': $localStorage.token});

        $scope.ok = function () {
            Restangular.one('/api').post('folder', {folder: $scope.path + '/' + $scope.folderName}).then(function(){
                $uibModalInstance.close($scope.folderName);
                $rootScope.$broadcast('change');
            }, function(error){
                AlertService.add('danger', error.data.message);
                $uibModalInstance.close($scope.folderName);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
