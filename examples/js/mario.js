"use strict";
angular.module('marioApp', []).
    directive('mario', function() {
        return {
            restrict: "E",
            scope: {
                fireMode: "@"
            },
            link: function(scope, iElement, iAttrs) {
                var $mario = $(iElement[0]);
                $mario.addClass("mario");
            }
        }
    }).
    directive('fireMode', function() {
        return {
            restrict: "A",
            link: function(scope, iElement, iAttrs) {
                var $character = $(iElement[0]);

                iAttrs.$observe('fireMode', function(mode) {
                    if (mode === "fire") {
                        $character.addClass("fire-mode");

                        $(document).on('click.fireball', function(e) {
                            var $fireball = $("<div class='fire-ball'></div>");
                            var offset = $character.offset();
                            $fireball.css({top: offset.top, left: offset.left + $character.width()});
                            $character.after($fireball);
                            $fireball.animate({top: e.pageY, left: e.pageX}, function() {
                                $fireball.remove();
                                $(e.target).trigger("attack");
                            });
                        });
                    } else {
                        $character.removeClass("fire-mode");

                        $(document).off('click.fireball');
                    }
                });
            }
        };
    }).
    directive('enemy', function() {
        return {
            restrict: "E",
            scope: {
                type: "@enemyType",
                currentLives: "=lives",
                onDestroy: "&",
                position: "@"
            },
            link: function(scope, iElement, iAttrs) {
                iAttrs.$observe('enemyType', function(type) {
                    scope.type = type;
                });

                var $enemy = $(iElement[0]);
                $enemy.addClass(scope.type).css("left", scope.position + "%");

                $enemy.on("attack", function(e) {
                    scope.$apply(function() {
                        scope.currentLives = scope.currentLives - 1;
                        if (scope.currentLives === 0) {
                            $enemy.remove();
                            scope.onDestroy();
                        }
                    });
                });
            }
        };
    }).
    controller('gameCtrl', function($scope) {
        $scope.mario = {
            mode: 'fire'
        };

        $scope.enemies = [];

        // create some goombas and a bowser
        for (var i=0; i<=2; i++) {
            $scope.enemies.push({
                type: "goomba",
                lives: 1
            });
        }

        var bowser = {
            type: "bowser",
            lives: 10
        };
        $scope.enemies.push(bowser);

        $scope.destroy = function(index) {
            $scope.enemies.splice(index, 1);
            $scope.$apply();
        };
    });