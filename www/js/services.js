angular.module('starter.services', [])
    .factory('Results', function ($http, $q) {
        var allTries = [];

        // private
        function getFilteredTries(filterCheckCallback) {
            var filteredTries = [];

            allTries.forEach(function (attempt) {
                if (filterCheckCallback(attempt)) {
                    filteredTries.push(attempt);
                }
            });

            return filteredTries;
        }

        function saveTaskResultsToLocalStorage(results) {
            var allResults = JSON.parse(localStorage.results || '[]');
            allResults.push(results);
            localStorage.results = JSON.stringify(allResults, null, 4);
        }

        function getTaskResultsFromLocalStorage() {
            return JSON.parse(localStorage.results || '[]');
        }

        function saveTry(numOfTryInCycle, numOfCycle, lastTryTime, selectedChoice, trueChoice) {
            allTries.push({
                numOfTryInCycle: numOfTryInCycle,
                numOfCycle: numOfCycle,
                duration: Date.now() - lastTryTime,
                selectedChoice: selectedChoice,
                trueChoice: trueChoice
            });
        }

        // without free tries
        function getAllTries() {
            return allTries;
        }

        function getCorrectTries() {
            return getFilteredTries(function (attempt) {
                return attempt.selectedChoice === attempt.trueChoice;
            });
        }

        function getErrorTries() {
            return getFilteredTries(function (attempt) {
                return attempt.selectedChoice !== attempt.trueChoice;
            });
        }


        function getTriesTotalTime(tries) {
            return tries.map(function (attempt) {
                return attempt.duration;
            })
                .reduce(function (currSum, currValue) {
                    return currSum + currValue;
                }, 0);
        }

        function getAverageTime(tries) {
            return getTriesTotalTime(tries) / tries.length;
        }

        function getDispersionForTries(tries) {
            var avg = getAverageTime(tries),
                sum = tries
                .map(function (attempt) {
                    return attempt.duration;
                })
                .reduce(function (currSum, currValue) {
                    return Math.pow(currValue - avg, 2);
                }, 0);

            return sum / tries.length;
        }


//        function saveFreeTry(currNumOfClicksInCycle, currentCycle + 1, lastTryTime,
//            buttonId + 1, vm.currentSignal + 1) {
//        }

        return {
            saveTry: saveTry,
            //saveFreeTry: saveFreeTry,


            saveTaskResultsToLocalStorage: saveTaskResultsToLocalStorage,
            getTaskResultsFromLocalStorage: getTaskResultsFromLocalStorage,

            getAllTries: getAllTries,
            getCorrectTries: getCorrectTries,
            getErrorTries: getErrorTries,

            getTriesTotalTime: getTriesTotalTime,
            getAverageTime: getAverageTime,
            getDispersionForTries: getDispersionForTries
        }
    })
    .factory('MiscOperations', function ($http, $q) {
        function getTryTypes() {
            return ['Try', 'Correct', 'Error'];
        }

        function getTryTypesBGMap() {
            return {
                Try: 'Всички отговори',
                Correct: 'Само верни отговори',
                Error: 'Само грешни отговори'
            }
        }

        function shuffle(o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }

        return {
            shuffle: shuffle,
            getTryTypes: getTryTypes,
            getTryTypesBGMap: getTryTypesBGMap
        };
    });
