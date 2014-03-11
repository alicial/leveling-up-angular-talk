"use strict";
angular.module('demo.characters', []).
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
                            $character.after($fireball);
                            $fireball.css({top: offset.top, left: offset.left + $character.width()});

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
            template: "<div ng-class='{goomba: type == \"small\", bowser: type == \"big\"}'></div>",
            replace: true,
            link: function(scope, iElement, iAttrs) {
                var $enemy = $(iElement[0]);

                $enemy.css("left", scope.position + "%");

                $enemy.on("attack", function(e) {
                    scope.$apply(function() {
                        scope.currentLives = scope.currentLives - 1;
                        if (scope.currentLives === 0) {
                            $enemy.remove();
                            scope.onDestroy();
                        }
                    });
                });

                scope.$watch("currentLives", function(newLives, oldLives) {
                    if (newLives > oldLives) {
                        $enemy.animate({width:"+=10px",height:"+=10px"},150).animate({width:"-=10px",height:"-=10px"},150);
                    } else if (newLives < oldLives) {
                        $enemy.animate({width:"-=10px",height:"-=10px"},150).animate({width:"+=10px",height:"+=10px"},150);
                    }
                });
            }
        };
    });

angular.module('demo.examples', ['demo.characters']).
    controller('exampleCtrl', function($scope) {
        $scope.enemyType = "small";
        $scope.lives = 1;
    });


angular.module('demo.game', ['demo.characters']).
    controller('gameCtrl', function($scope) {
        $scope.mario = {
            mode: 'fire'
        };

        $scope.enemies = [];

        // create some goombas and a bowser
        for (var i=0; i<=2; i++) {
            $scope.enemies.push({
                type: "small",
                lives: 1
            });
        }

        var bowser = {
            type: "big",
            lives: 3
        };
        $scope.enemies.push(bowser);

        $scope.destroy = function(index) {
            $scope.enemies.splice(index, 1);
        };
    });