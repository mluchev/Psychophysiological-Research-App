angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $location) {

    })

    .controller('TasksCtrl', function ($scope) {
        var vm = this;

        vm.tasks = [
            {
                title: 'Методика 1: Стратегия на двоичния избор',
                id: 1
            },
            {
                title: 'Методика 2: Стратегия на избор при 3 алтернативи',
                id: 2
            },
        ];
    })

    .controller('TaskConfigCtrl', function ($scope, $stateParams, $state) {
        var vm = this;
        vm.taskId = $stateParams.taskId;

        // TODO - пазене в localStorage последните зададени настройки и извличане от тях, ако има, ако не - задаване на default-ни
        if (vm.taskId == 1) {
            vm.taskParams = {
                numOfSeries: 4,
                numOfSituationsInSeries: 5
            }
        } else if (vm.taskId == 2) {
            vm.taskParams = {
                numOfSeries: 3,
                numOfSituationsInSeries: 13
            }
        }

        // TODO: pass user data as params and save them with results
    })
    .controller('TaskExecuteCtrl', function ($scope, $stateParams, $state, $document, $ionicPopup, Results, MiscOperations) {
        var vm = this,
            NUM_OF_CYCLES = $stateParams.taskParams.numOfSeries,
            NUM_OF_SITUATIONS_IN_CYCLE = $stateParams.taskParams.numOfSituationsInSeries,
        // NUM_OF_CLICKS_IN_LAST_CYCLE = 6,
            currentCycle = 0,
            currNumOfClicksInCycle = 0,
            situationsMatrix = [];

        vm.taskId = $stateParams.taskId;
        vm.taskResults = {};

        if (vm.taskId == 1) {
            setTask1();
        } else if (vm.taskId == 2) {
            setTask2();
        }

        function setTask2() {
            var NUM_OF_FREE_TRIES_PER_CYCLE = 3,
                lastTryTime,
                areButtonsActive;

            vm.clickTaskButton = function (buttonId) {
                if(!areButtonsActive) { return; }

                // show/hide error message
                if (vm.currentSignal === buttonId) {
                    vm.showErrorMessage = false;
                } else {
                    vm.showErrorMessage = true;
                }

                currNumOfClicksInCycle++;
                if (currNumOfClicksInCycle <= NUM_OF_FREE_TRIES_PER_CYCLE) {
//                    Results.saveFreeTry(currNumOfClicksInCycle, currentCycle + 1, lastTryTime,
//                        buttonId + 1, vm.currentSignal + 1);
//                    lastTryTime = Date.now();

                    // here without timer and out of statistics - free tries
                    if (currNumOfClicksInCycle === 3) {
                        showPopupForRealTestStart(function() {
                            // in order to know the duration of the first non-free try in cycle
                            lastTryTime = Date.now();

                            vm.showErrorMessage = false;
                            // generate new random signal
                            projectNextSignal(Math.floor(Math.random() * 3));
                        });
                    } else {
                        // generate new signal - the first 3 free attempts should be always include all the 3 colors
                        projectNextSignal(currNumOfClicksInCycle);
                    }
                } else {
                    Results.saveTry(currNumOfClicksInCycle, currentCycle + 1, lastTryTime,
                        buttonId + 1, vm.currentSignal + 1);
                    lastTryTime = Date.now();

                    // if last click in series, don't project the next here, but after the new series popup
                    if (currNumOfClicksInCycle !== NUM_OF_SITUATIONS_IN_CYCLE) {
                        // generate new random signal
                        projectNextSignal(Math.floor(Math.random() * 3));
                    }
                }

                // new series start
                if (currNumOfClicksInCycle === NUM_OF_SITUATIONS_IN_CYCLE) {
                    // when we've finished series
                    if (currentCycle === NUM_OF_CYCLES - 1) {
                        // end task and go to results
                        processTaskResults();
                        showPopupAfterFinishingTask();
                    } else {
                        showPopupForNewCycleStart(currentCycle + 1, function() {
                            currentCycle++;
                            currNumOfClicksInCycle = 0;

                            // as closing the alert will take time, that shouldn't be included in the statistics
                            lastTryTime = Date.now();
                            // shuffle button-signal matches  on every new cycle
                            vm.signalColors =  MiscOperations.shuffle(vm.signalColors);
                            console.log(vm.signalColors);
                            vm.showErrorMessage = false;
                            // first 3 free attempts - always different from each other
                            projectNextSignal(0);
                        });
                    }
                }
            };

            init();

            function init() {
                // showPopupWithInstructionsBeforeStart and do the instruction timing
                var startInstructionTime = Date.now(),
                    instructionPopup = showPopupWithInstructionsBeforeStart(2);
                instructionPopup.then(function () {
                    // end instruction time
                    vm.taskResults.totalInstructionReadTime = Date.now() - startInstructionTime;
                    areButtonsActive = true;
//                    lastTryTime = Date.now();
                });

                vm.signalShowPosition = Math.floor(Math.random() * 3);
                vm.signalColors = ['red', 'green', 'blue'];
                vm.currentSignal = 0; // first signal
                vm.currSignalColor = vm.signalColors[vm.currentSignal];

                // TODO: to be done with the directive
                $document.bind('keydown', function (e) {
                    if (e.which === 37) {
                        vm.clickTaskButton(0);
                    } else if (e.which === 40) {
                        vm.clickTaskButton(1);
                    } else if (e.which === 39) {
                        vm.clickTaskButton(2);
                    }
                    $scope.$apply();
                });
            }

            function projectNextSignal(colorId) {
                if (colorId !== undefined) {
                    vm.currentSignal = colorId;
                    vm.currSignalColor = vm.signalColors[colorId];
                    vm.signalShowPosition = Math.floor(Math.random() * 3);
                }
            }

            function showPopupForRealTestStart(callback) {
                var alertPopup = $ionicPopup.alert({
                    template: 'Край на пробните опити за текущата серия. Сега започва същниският тест за серията.'
                });

                areButtonsActive = false;
                alertPopup.then(function (res) {
                    callback();
                    areButtonsActive = true;
                });
            }

            function showPopupForNewCycleStart(currentCycle, callback) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Начало на нова серия',
                    template: 'Край на Серия ' + currentCycle + ', начало на Серия ' + (1 + currentCycle)
                    + ', където съответствието цвят-бутон ще е различно. Отново ще имате 3 пробни опита, преди да започне същинският тест.'
                });

                areButtonsActive = false;

                alertPopup.then(function (res) {
                    callback();
                    areButtonsActive = true;
                });
            }

        }

        function setTask1() {
            var lastTryTime;

            vm.clickTaskButton = function (buttonId) {
                currNumOfClicksInCycle++;
                Results.saveTry(currNumOfClicksInCycle, currentCycle + 1, lastTryTime,
                    buttonId, situationsMatrix[currentCycle][currNumOfClicksInCycle - 1]);
                lastTryTime = Date.now();

                if (situationsMatrix[currentCycle][currNumOfClicksInCycle - 1] === buttonId) {
                    vm.showErrorMessage = false;
                } else {
                    vm.showErrorMessage = true;
                    currNumOfClicksInCycle = 0;
                }

                if (currNumOfClicksInCycle === NUM_OF_SITUATIONS_IN_CYCLE) {
                    currentCycle++;
                    currNumOfClicksInCycle = 0;
                }
                if (currentCycle > NUM_OF_CYCLES - 1) {
                    processTaskResults();
                    showPopupAfterFinishingTask();
                }
            }

            init();

            function init() {
                var startInstructionTime = Date.now(),
                    instructionPopup = showPopupWithInstructionsBeforeStart(1);
                instructionPopup.then(function () {
                    // used for calculation of the first try duration
                    lastTryTime = Date.now();
                    vm.taskResults.totalInstructionReadTime = Date.now() - startInstructionTime;
                });

                fillSituationsMatrix(situationsMatrix, NUM_OF_CYCLES, NUM_OF_SITUATIONS_IN_CYCLE);

                // TODO: to be done with the directive
                $document.bind('keydown', function (e) {
                    if (e.which === 37) {
                        vm.clickTaskButton(0);
                    } else if (e.which === 39) {
                        vm.clickTaskButton(1);
                    }
                    $scope.$apply();

                });
            }

            function fillSituationsMatrix(situationsMatrix, numCycles, numSits) {
                var i, j;

                for (i = 0; i < numCycles; i++) {
                    situationsMatrix[i] = [];
                    for (j = 0; j < numSits; j++) {
                        situationsMatrix[i][j] = Math.floor(Math.random() * 2);
                    }
                }

                return situationsMatrix;
            }
        }

        function processTaskResults() {
            var tryTypes = MiscOperations.getTryTypes();

            vm.taskResults.allTries = Results.getAllTries();

            setResultsByTryType(tryTypes[0], Results.getAllTries());
            setResultsByTryType(tryTypes[1], Results.getCorrectTries());
            setResultsByTryType(tryTypes[2], Results.getErrorTries());

            Results.saveTaskResultsToLocalStorage(vm.taskResults);

            function setResultsByTryType(type, tries) {
                vm.taskResults['total' + type + 's'] = tries.length;
                vm.taskResults['total' + type + 'Time'] = Results.getTriesTotalTime(tries);
                vm.taskResults['avgTimeFor' + type] = Math.round(Results.getAverageTime(tries));
                vm.taskResults['dispersionFor' + type + 'Time'] = Math.round(Results.getDispersionForTries(tries));
                vm.taskResults['stdDeviationFor' + type] = Math.round(Math.sqrt(vm.taskResults['dispersionFor' + type + 'Time']));
            }
        }

        function showPopupAfterFinishingTask() {
            var alertPopup = $ionicPopup.alert({
                title: 'Край на тестването',
                template: 'Моля натиснете бутона, за да видите страницата с резултатите'
            });

            alertPopup.then(function (res) {
                $state.go('app.taskResults', {
                    taskId: vm.taskId,
                    taskParams: $stateParams.taskParams,
                    taskResults: vm.taskResults
                });
            });
        }




        function showPopupWithInstructionsBeforeStart(taskId) {
            var alertPopup, instructionText;

            // TODO: custom instruction
            if (taskId == 1) {
                instructionText = 'Открийте последователността от леви и десни бутони във всяка серия!';

            } else if (taskId == 2) {
                instructionText = 'Открийте съответствието бутон-цвят във всяка от сериите! Имате по 3 пробни опита в началото на' +
                    ' всяка серия, за да го откриете. Веднага след 3-тия пробен опит ще започне същинският тест. Можете да отговаряте с ' +
                    'лява, долна и дясна стрелка от клавиатурата съответно за Б1, Б2 и Б3 (или с клик на мишката върху съответния бутон).';
            }

            alertPopup = $ionicPopup.alert({
                title: 'Инструкции',
                template: instructionText
            });

            return alertPopup;
        }
    })
    .controller('TaskResultsCtrl', function ($scope, $stateParams, $state, $window, MiscOperations) {
        var vm = this;
        vm.tryTypes = MiscOperations.getTryTypes();
        vm.tryTypesBGMap = MiscOperations.getTryTypesBGMap();
        vm.taskParams = $stateParams.taskParams;
        vm.taskResults = $stateParams.taskResults;

        vm.setButtonName = function(buttonNum) {
            if($stateParams.taskId == 1) {
                if(buttonNum == 0) {
                    return 'Л.';
                } else if(buttonNum == 1) {
                    return 'Д.';
                }
            } else if($stateParams.taskId == 2){
                return 'Бутон ' + buttonNum;
            }

        };


        vm.tryTypes.forEach(function (type) {
            convertTimeToProperViewFormat(type);
        });
        convertTimeToProperViewFormat('InstructionRead');

        // better with filter
        function convertTimeToProperViewFormat(type) {
            vm.taskResults['total' + type + 'Time'] = {
                mins: Math.floor(vm.taskResults['total' + type + 'Time'] / 60000) || 0,
                secs: Math.floor(( vm.taskResults['total' + type + 'Time'] % 60000) / 1000) || 0
            }
        }
    });
