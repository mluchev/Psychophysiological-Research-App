angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    })

    .controller('TasksCtrl', function ($scope) {
        var vm = this;

        vm.tasks = [
            {
                title: 'Методика 1: Стратегия на двоичния избор',
                id: 1
            },
            {
                title: 'Методика 2: Изследване на зрително-моторната координация',
                id: 2
            },
        ];
    })

    .controller('TaskConfigCtrl', function ($scope, $stateParams, $state) {
        var vm = this;
        vm.taskId = $stateParams.taskId;


        vm.taskParams = {
            numOfSeries: 4,
            numOfSituationsInSeries: 5
        }
        // TODO - пазене в localStorage последните зададени настройки и извличане от тях, ако има, ако не - задаване на default-ни
    })
    .controller('TaskExecuteCtrl', function ($scope, $stateParams, $state, $document, $ionicPopup) {
        // TODO: при опит за излизане, преди да е завършено -confirmation dialog; запазване в localStorage на прогреса/резултатите
        var vm = this,
        // or just a generated matrix of all cycles - just generate it from input data
            NUM_OF_CYCLES = $stateParams.taskParams.numOfSeries,
            NUM_OF_SITUATIONS_IN_CYCLE = $stateParams.taskParams.numOfSituationsInSeries,
        // NUM_OF_CLICKS_IN_LAST_CYCLE = 6,
            currentCycle = 0,
            currNumOfClicksInCycle = 0,
            situationsMatrix = [],
            startTime, endTime, isTaskStarted = false;
        // + num of available fakes in beginning

        vm.taskId = $stateParams.taskId;
        vm.taskResults = {
            totalTime: null,
            totalNumOfErrors: 0
        };


        if (vm.taskId == 1) {
            setTask1();
        } else if (vm.taskId == 2) {
            setTask2();
        }

        function setTask2() {
            vm.signalShowPosition = Math.floor(Math.random() * 3); // should be random every time
            vm.signalColors = ['red', 'green', 'blue'];
            // TODO: should be done with reordered colors - this array should be regenerated on new cycle

            vm.clickTaskButton = function (buttonId) {
                console.log(buttonId);

                if (!isTaskStarted) {
                    startTime = new Date().getTime();
                    isTaskStarted = true;
                }

                currNumOfClicksInCycle++;
                if (situationsMatrix[currentCycle][currNumOfClicksInCycle - 1] === buttonId) {
                    vm.showErrorMessage = false;

                    if (currNumOfClicksInCycle === NUM_OF_SITUATIONS_IN_CYCLE) {
                        currentCycle++;
                        currNumOfClicksInCycle = 0;

                        if (currentCycle > NUM_OF_CYCLES - 1) {
                            endTime = new Date().getTime();
                            vm.taskResults.totalTime = endTime - startTime;
                            showPopupAfterFinishingTask();
                        }
                    }
                } else {
//                    currNumOfClicksInCycle = 0;
                    vm.showErrorMessage = true;
                    vm.taskResults.totalNumOfErrors++;
                }

                // should be moved from here -> on cycle change there may be a problem
                projectNextSignal(situationsMatrix[currentCycle][currNumOfClicksInCycle]);
                // generate new image
            };

            function projectNextSignal(colorId) {
                if (colorId !== undefined) {
                    vm.currSignalColor = vm.signalColors[colorId];
                    vm.signalShowPosition = Math.floor(Math.random() * 3);
                }
            }


            activate();

            function activate() {
                showPopupWithInstructionsBeforeStart();
                fillSituationsMatrix(situationsMatrix, NUM_OF_CYCLES, NUM_OF_SITUATIONS_IN_CYCLE);
                vm.currSignalColor = vm.signalColors[situationsMatrix[0][0]]; // first signal

                console.log(situationsMatrix);

                // TODO: to be done with the directive
                $document.bind('keydown', function (e) {
                    if (e.which === 37) {
                        vm.clickTaskButton(0);
                        console.log(e.which)
                    } else if (e.which === 40) {
                        vm.clickTaskButton(1);
                        console.log(e.which)
                    } else if (e.which === 39) {
                        vm.clickTaskButton(2);
                        console.log(e.which)
                    }
                    $scope.$apply();
                });
            }

            function fillSituationsMatrix(situationsMatrix, numCycles, numSits) {
                var i, j;

                for (i = 0; i < numCycles; i++) {
                    situationsMatrix[i] = [];
                    for (j = 0; j < numSits; j++) {
//                        situationsMatrix[i][j] = 1;
                        situationsMatrix[i][j] = Math.floor(Math.random() * 3);
                    }
                }

                return situationsMatrix;
            }
        }

        function setTask1() {
            vm.clickTaskButton = function (buttonId) {
                if (!isTaskStarted) {
                    startTime = new Date().getTime();
                    isTaskStarted = true;
                }

                currNumOfClicksInCycle++;
                if (situationsMatrix[currentCycle][currNumOfClicksInCycle - 1] === buttonId) {
                    vm.showErrorMessage = false;

                    if (currNumOfClicksInCycle === NUM_OF_SITUATIONS_IN_CYCLE) {
                        currentCycle++;
                        currNumOfClicksInCycle = 0;

                        if (currentCycle > NUM_OF_CYCLES - 1) {
                            endTime = new Date().getTime();
                            vm.taskResults.totalTime = endTime - startTime;
                            showPopupAfterFinishingTask();
                        }
                    }
                } else {
                    currNumOfClicksInCycle = 0;
                    vm.showErrorMessage = true;
                    vm.taskResults.totalNumOfErrors++;
                }
            }

            activate();

            function activate() {
                showPopupWithInstructionsBeforeStart()
                fillSituationsMatrix(situationsMatrix, NUM_OF_CYCLES, NUM_OF_SITUATIONS_IN_CYCLE);

                // TODO: to be done with the directive
                $document.bind('keydown', function (e) {
                    if (e.which === 37) {
                        vm.clickTaskButton(0);
                        console.log(e.which)
                    } else if (e.which === 39) {
                        vm.clickTaskButton(1);
                        console.log(e.which)
                    }
                    $scope.$apply();

                });
            }

            function fillSituationsMatrix(situationsMatrix, numCycles, numSits) {
                var i, j;

                for (i = 0; i < numCycles; i++) {
                    situationsMatrix[i] = [];
                    for (j = 0; j < numSits; j++) {
//            situationsMatrix[i][j] = 1
                        situationsMatrix[i][j] = Math.floor(Math.random() * 2);
                    }
                }

                return situationsMatrix;
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

        function showPopupWithInstructionsBeforeStart() {
            var alertPopup = $ionicPopup.alert({
                title: 'Инструкции',
                template: 'Отчитането на времето ще започне след първото натискане на един от бутоните'
            });
        }
    }


)
    .
    controller('TaskResultsCtrl', function ($scope, $stateParams, $state) {
        var vm = this;
        console.log()
        vm.taskParams = $stateParams.taskParams;
        vm.taskResults = $stateParams.taskResults;

        vm.totalTime = {
            mins: Math.floor(vm.taskResults.totalTime / 60000) || 0,
            secs: Math.floor((vm.taskResults.totalTime % 60000) / 1000) || 0
        }
    });
