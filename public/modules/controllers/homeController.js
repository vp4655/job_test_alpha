(function(){
    'use strict';

    angular
        .module('fileUploadApp')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['Restangular', '$localStorage', '$state', '$anchorScroll', '$location'];

    function  HomeCtrl(Restangular, $localStorage, $state, $anchorScroll, $location){
        var vm = this;
        vm.username = $localStorage.username;
        vm.token = $localStorage.token;
        vm.profilePath = '/profile/' + vm.username;
        vm.logout = logout;
        vm.scrollTo = scrollTo;

        vm.markdown = "#Alpha UX File System\n"+

            "This is brief description of how to use this site.\n\n"+


            "##Procedure\n"+

            "1. Go to register ( if this is the first time you visit this site ) and create new simple account.\n"+

            "2. If you are already registered then go to login.\n"+

            "3. After successful login ( or registration ) you will se empty folder with options to create new folder or to upload files to this folder. This is your root folder, there is no going up.\n"+

            "4. Create new folder and upload new files to see how file system works\n" +

            "##Imporatant notice !\n" +

            "File upload is kind of slow ( on my network anyway ) so there is a chance that larger files will be uploaded after some time, so it would be best to upload smaller files since they work faster.\n";


        function logout(){
            $localStorage.$reset();
            $state.go('login',{});
        }

        function scrollTo(id){
            $location.hash(id);
            $anchorScroll();
        }
    }

})();
