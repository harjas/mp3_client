// js/services/todos.js
angular.module('demoServices', [])
        .factory('CommonData', function(){
        var data = "";
        return{
            getData : function(){
                return data;
            },
            setData : function(newData){
                data = newData;                
            }
        }
    })
    .factory('Users', function($http, $window){
        return{
            getUsers: function(){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/users');
            },
            addUser: function(user){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.post(baseUrl+'/api/users',user);
            },
            deleteUser: function(id){
                console.log("inside delete user");
                 var baseUrl = $window.sessionStorage.baseurl;
                 return $http.delete(baseUrl+'/api/users/'+id);
            },
            getUser: function(id){
                 var baseUrl = $window.sessionStorage.baseurl;
                 return $http.get(baseUrl+'/api/users/'+id);
            }
        }
    })
    .factory('Tasks', function($http, $window){
        return{
            get: function(){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/tasks');
            },
            getTask: function(taskId){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/tasks/'+taskId);
            },
            getUserTasks: function(userId){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/tasks?where={"assignedUser": "'+ userId + '", "completed": false}');
            },
            getCompletedUserTasks: function(userId){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/tasks?where={"assignedUser": "'+ userId + '", "completed": true}');
            },
            editTask: function(task){
                console.log(task);
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.put(baseUrl+'/api/tasks/'+task._id, task);
            },
            addTask: function(task){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.post(baseUrl+'/api/tasks/',task);    
            },
            deleteTask: function(id){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.delete(baseUrl+'/api/tasks/'+id);    
            },
            getSortedTasks: function(sort, order){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/tasks?sort={\"'+sort+'\":'+order+'}');
            }
        }
    })
    ;
