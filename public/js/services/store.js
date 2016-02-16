app.factory('store', [function() {
    var socket = io();
    var app = feathers().configure(feathers.socketio(socket));
    var service = app.service('game');
    var store = {
        todos: [],

        serviceHandler: function(deferred) {
            return function(error) {
                if (error) {
                    return deferred.reject(error);
                }
                deferred.resolve(store.todos);
            };
        },

        createTodo: function(todo) {
            store.todos.push(todo);
        },

        updateTodo: function(todo) {
            store.todos.forEach(function(current, index) {
                if (current.id === todo.id) {
                    store.todos[index] = todo;
                }
            });
        },

        removeTodo: function(todo) {
            store.todos.forEach(function(current, index) {
                if (current.id === todo.id) {
                    store.todos.splice(index, 1);
                }
            });
        },

        clearCompleted: function() {
            var deferred = $q.defer();

            store.todos.forEach(function(todo) {
                if (todo.complete) {
                    service.remove(todo.id);
                }
            });

            deferred.resolve(store.todos);

            return deferred.promise;
        },

        delete: function(todo) {
            var deferred = $q.defer();

            service.remove(todo.id, store.serviceHandler(deferred));

            return deferred.promise;
        },

        get: function() {
            var deferred = $q.defer();

            service.find(function(error, todos) {
                if (error) {
                    return deferred.reject(error);
                }

                angular.copy(todos, store.todos);
                deferred.resolve(store.todos);
            });

            return deferred.promise;
        },

        insert: function(todo) {
            var deferred = $q.defer();

            service.create(todo, store.serviceHandler(deferred));

            return deferred.promise;
        },

        put: function(todo) {
            var deferred = $q.defer();

            service.update(todo.id, todo, store.serviceHandler(deferred));

            return deferred.promise;
        }
    };

    service.on('created', store.createTodo);
    service.on('updated', store.updateTodo);
    service.on('removed', store.removeTodo);

    return store;
}]);
