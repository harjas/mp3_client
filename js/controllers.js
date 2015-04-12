var demoControllers = angular.module('demoControllers', []);

// demoControllers.controller('UsersController', ['$scope', 'CommonData'  , function($scope, CommonData) {
//   $scope.data = "";
//    $scope.displayText = ""

//   $scope.setData = function(){
//     CommonData.setData($scope.data);
//     $scope.displayText = "Data set"

//   };

// }]);

demoControllers.controller('UsersController', ['$scope', '$http', 'Users', 'Tasks','$window' , function($scope, $http,  Users, Tasks, $window) {
  $scope.hideValue = true;
  Users.getUsers().success(function(data){
    $scope.users = data['data'];
  });

  $scope.deleteUser = function deleteUser(users, index, username, id){ 
    Tasks.getUserTasks(id).success(function(tasks){
      $scope.tasks = tasks['data'];
      for(var i=0; i<$scope.tasks.length; i++){
        Tasks.editTask({_id:$scope.tasks[i]._id, 
                        name:$scope.tasks[i].name,
                        deadline:$scope.tasks[i].deadline,
                        assignedUser:"",
                        assignedUserName:"unassigned"}).success(function(data){
                          console.log(data['message']);
                        });
      }
    });

    Users.deleteUser(id).success(function(data){
      console.log(data);
      $scope.deletedUser = data;
      $scope.deletedUserName = username;
      $scope.hideValue = false;
      $scope.remove = function(users, index){
        users.splice(index, 1);
      }
      $scope.remove(users, index);
    });
  }

  $scope.hide = function hide(){
    $scope.hideValue = true;
  }

}]);

demoControllers.controller('AddUserController', ['$scope', '$http', 'Users', '$window' , function($scope, $http,  Users, $window) {
    $(document).foundation({
      abide : {
        live_validate : true,
        validate_on_blur : true,
        focus_on_invalid : true,
        error_labels: true
      }
    });
    $scope.user = {}
    $scope.hideValue = true;
    $scope.addUser = function(){
      Users.addUser($scope.user).success(function(data, status){
        $scope.response = data;
        console.log(status);
        if(status === 200){
          $(".alert-box").removeClass("success").addClass("alert");
        }
        else if(status === 201){
          $(".alert-box").removeClass("alert").addClass("success");
        }
        console.log($scope.response);
        $scope.hideValue = false;
      });
    }

    $scope.hide = function(){
      $scope.hideValue = true;
    }
}]);

demoControllers.controller('UserDetailsController', ['$scope', '$http', '$routeParams', 'Users', 'Tasks', '$window' , function($scope, $http, $routeParams, Users, Tasks, $window) {
  Users.getUser($routeParams.id).success(function(user){
    $scope.user = user;

    Tasks.getUserTasks($routeParams.id).success(function(tasks){
      $scope.tasks = tasks;
    });
  });

  $scope.getCompletedTasks = function(){
    Tasks.getCompletedUserTasks($routeParams.id).success(function(tasks){
      $scope.completedTasks = tasks;
    });
  }

  $scope.markTaskCompleted = function(index, task){
    Tasks.editTask({_id:task._id, name:task.name, deadline:task.deadline, completed:true}).success(function(response){
      $scope.response = response;
      console.log($scope);
      $scope.tasks['data'].splice(index,1);
    });
  }

}]);

demoControllers.controller('TasksController', ['$scope', '$http', 'Tasks', '$window' , function($scope, $http,  Tasks, $window) {

  Tasks.get().success(function(data){
    $scope.tasks = data['data'];
  });

}]);

demoControllers.controller('TaskDetailsController', ['$scope', '$http', 'Tasks', '$routeParams','$window' , function($scope, $http,  Tasks, $routeParams, $window) {

  Tasks.getTask($routeParams.id).success(function(task){
    $scope.task = task;
    $scope.date = new Date(task['data'].deadline);
    $scope.date = $scope.date.toDateString();
  });

}]);

demoControllers.controller('EditTaskController', ['$scope', '$http', 'Tasks', 'Users', '$routeParams','$window' , function($scope, $http,  Tasks, Users, $routeParams, $window) {
  $(document).foundation({
      abide : {
        live_validate : true,
        validate_on_blur : true,
        focus_on_invalid : true,
        error_labels: true
      }
    });

  $scope.task = {};
  $scope.message = "";
  $scope.selectedUser = "";
  $scope.hideValue = true;

  Tasks.getTask($routeParams.id).success(function(task){
    console.log("here now!");
    $scope.task = task;
    $scope.message = task['message'];
    $scope.task['data'].deadline = new Date(task['data'].deadline);
    $scope.task['data'].deadline = $scope.task['data'].deadline.toDateString();

    Users.getUsers().success(function(data){
      $scope.users = data['data'];
      for(var i=0; i < $scope.users.length; i++){
        if($scope.users[i].name === $scope.task['data'].assignedUserName){
          $scope.selectedUser = $scope.users[i];
          break;
        }
      }
    });
  });

  $scope.changeValue = function(item, index){
    console.log("calling");
    $scope.selectedUser = item;
    //console.log($scope.selectedUser);
  }

  $scope.editTask = function(){
    if($scope.selectedUser !== "") {
      $scope.task['data'].assignedUser = $scope.selectedUser._id;
      $scope.task['data'].assignedUserName = $scope.selectedUser.name;

      // console.log($scope.task['data'].assignedUser);
      // console.log($scope.task['data'].deadline);
    }
    $scope.hide = function(){
      $scope.hideValue = true;
    }

    Tasks.editTask($scope.task['data']).success(function(task, status){
      $scope.task = task;
      $scope.message = $scope.task['message'];
      console.log($scope.message);

      if(status === 200){
        $(".alert-box").removeClass("alert").addClass("success");
      }
      $scope.hideValue = false;
      $scope.date = new Date(task['data'].deadline);
      $scope.date = $scope.date.toDateString();
    }).error(function(data, status, headers, config) {
        console.log(status);
        console.log(data);
        $scope.message = data['message'];
        if(status === 400){
          $(".alert-box").removeClass("success").addClass("alert");
        }
    });
  }
}]);

demoControllers.controller('AddTaskController', ['$scope', '$http', 'Tasks', 'Users', '$routeParams','$window' , function($scope, $http,  Tasks, Users, $routeParams, $window){
  console.log("wassup");
  $scope.hideValue = true;
  $scope.name = "";
  $scope.date = "";
  $scope.description = "";
  $scope.selectedUser = "";

  $(document).foundation({
      abide : {
        live_validate : true,
        validate_on_blur : true,
        focus_on_invalid : true,
        error_labels: true
      }
    });
  
  Users.getUsers().success(function(data){
    $scope.users = data['data'];
  });

  $scope.changeValue = function(item, index){
    console.log("calling");
    $scope.selectedUser = item;
    console.log($scope.selectedUser);
  }

  $scope.hide = function(){
    $scope.hideValue = true;
  }

  $scope.addTask = function(){
    if($scope.date === "" || $scope.name === ""){
      $scope.hideValue = false;
      $(".alert-box").removeClass("success").addClass("alert");
      $scope.message = "Cannot create task without date";
    }
    else{
      if($scope.selectedUser === ""){
        $scope.assignedUser = "";
        $scope.assignedUserName = "unassigned";
      }
      else{
        $scope.assignedUser = $scope.selectedUser._id;
        $scope.assignedUserName = $scope.selectedUser.name;
      }
      $scope.task = {name: $scope.name,
                     description:$scope.description,
                     deadline:$scope.date,
                     assignedUser:$scope.assignedUser,
                     assignedUserName:$scope.assignedUserName};
      console.log($scope.task);
      Tasks.addTask($scope.task).success(function(response,status){
        if(status === 201){
          $scope.message = response['message'];
          $scope.hideValue = false;
          $(".alert-box").removeClass("alert").addClass("success");
        }
      }).error(function(response){
          $scope.message = response['message'];
          $scope.hideValue = false;
          $(".alert-box").removeClass("success").addClass("alert");
      });
    }
  }
}]);


demoControllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {

  Llamas.get().success(function(data){
    $scope.llamas = data;
  });

  $scope.hide = function(){
    $scope.hideValue = true;
  }

}]);

demoControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url; 
    $scope.displayText = "URL set";

  };

}]);


