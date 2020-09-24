/**
 * @ngdoc directive
 * @name wyTimePicker
 * @restrict EA
 * @description
 * wyTimePickerDirective - pick a particular time or a time-range, useful for filtering data, querying time specific data, etc.
 * <pre class="prettyprint">
 * ```
 * <ng-time-picker
 * 		data-dropdown-toggle-state="settings.dropdownToggleState"
 *      data-time-settings="settings.time"
 *      data-theme="settings.theme"
 *      data-no-range="settings.noRange"
 *      data-format="settings.format"
 *      data-no-validation="settings.noValidation"
 *      data-apply-callback="onApplyTimePicker()"
 *      data-clear-callback="onClearTimePicker()">
 * </ng-time-picker>```
 * </pre>
 *
 * Options:
 *	1.	data-dropdown          -	time picker dropdown initial state - `true` for open `false` for close [@default: false].
 *	2.	data-time-settings     -	time Object containing initial values [@default: 00:00 - 23:59].
 *	3.	data-theme             -	which theme to be used - `light` or `dark` [@default: light].
 *	4.	data-no-range          -	set it to `true` if only time picker is needed i.e. no time range required [@default: false].
 *	5.	data-format            -	time format - `12` or `24` [@default: 24].
 *	6.	data-no-validation     -	set it to `true` if no validation is required for time range picker [@default: false]
 *	7.	data-apply-callback    -	apply callback that will be invoked on clicking apply button(dropdown will automatically be closed on clicking).
 *	8.	data-clear-callback    -	clear callback that will be invoked on clicking clear button(dropdown will automatically be closed on clicking).
 *
 */

'use strict';

function getTemplate() {
	return '<div class="angular-time-picker-wrapper">' +
		'	<span class="angular-time-picker-button"' +
		'		ng-class="theme"' +
		'		title="Time Range Filter"' +
		'		ng-click="dropdownToggleState = !dropdownToggleState;">' +
		'			<span ng-show="!noRange">{{ timeSettings.fromHour + ":" + timeSettings.fromMinute + " - " + timeSettings.toHour + ":" + timeSettings.toMinute }}</span>' +
		'			<span ng-show="noRange">{{ timeSettings.fromHour + ":" + timeSettings.fromMinute }}</span>' +
		'		<i class="angular-time-picker-caret" ng-class="theme"></i>' +
		'	</span>' +
		'	<div ng-show="dropdownToggleState" class="angular-time-picker-dropdown__menu  angular-time-picker-theme" ng-class="theme">' +
		'		<div>' +
		'			Start:' +
		'			<span class="angular-time-picker-float--right">' +
		'				<!-- `browser-default` class is being used as materializecss framework override default select css-->' +
		'				<!-- Thus to prevent this, adding a class. Materializecss is a famous framework for Material Design. -->' +
		'				<select ng-model="startingHour" class="browser-default">' +
		'					<option ng-repeat="option in startingTimeHoursRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>' +
		'				</select>' +
		'				:' +
		'				<select ng-model="startingMinute" class="browser-default">' +
		'					<option ng-repeat="option in startingTimeHMinutesRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>' +
		'				</select>' +
		'			</span>' +
		'		</div>' +
		'		<div class="angular-time-picker-push--top" ng-show="!noRange">' +
		'			End:' +
		'			<span class="angular-time-picker-float--right">' +
		'				<select ng-model="endingHour" class="browser-default">' +
		'					<option ng-repeat="option in endingTimeHoursRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>' +
		'				</select>' +
		'				:' +
		'				<select ng-model="endingMinute" class="browser-default">' +
		'					<option ng-repeat="option in endingTimeHMinutesRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>' +
		'				</select>' +
		'			</span>' +
		'		</div>' +
		'		<div class="angular-time-picker-push--top">' +
		'			<button ng-click="resetToOriginalTimeSettings()">Reset</button>' +
		'			<button class="angular-time-picker-push-half--left  angular-time-picker-float--right  angular-time-picker-apply-btn" ng-click="applyTimeRangeFilter()">Apply</button>' +
		'			<button class="angular-time-picker-push-half--left  angular-time-picker-float--right  angular-time-picker-cancel-btn" ng-click="closeTimeFilterDropdown()">Cancel</button>'+
		'		</div>' +
		'	</div>' +
		'</div>';
}

/* global angular */
angular.module('wingify.timePicker', [])
	.directive('wyTimePicker', [ '$timeout', function ($timeout) {
	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'js/angular-time-picker.tpl.html',
		scope: {
			timeSettings: '=',
			dropdownToggleState: '=?',
			format: '=?',
			theme: '=?',
			noRange: '=',
			noValidation: '=',
			applyCallback: '&',
			clearCallback: '&'
		},
		link: function (scope, element) {
			var i, timeHoursRange = [],
				timeMinutesRange = [];
			scope.startingTimeHoursRange = [];
			scope.endingTimeHoursRange = [];
			scope.startingTimeHMinutesRange = [];
			scope.endingTimeHMinutesRange = [];
			scope.timeSettings = scope.timeSettings || {};
			scope.theme = scope.theme ? ('angular-time-picker-' + scope.theme) : 'angular-time-picker-light'; // by default light theme

			scope.timeHourFormat = (scope.format && parseInt(scope.format, 10) === 12) ? 12 : 24;
			// For hours dropdown (0 - 23)
			for (i = 0; i < scope.timeHourFormat; i++) {
				timeHoursRange.push({
					name: (i < 10) ? ('0' + i) : i + '',
					value: (i < 10) ? ('0' + i) : i + ''
				});
			}

			// For minutes dropdown (0 - 59)
			for (i = 0; i < 60; i++) {
				timeMinutesRange.push({
					name: (i < 10) ? ('0' + i) : i + '',
					value: (i < 10) ? ('0' + i) : i + ''
				});
			}

			// making a copy so each dropdown for time filter works independently
			angular.copy(timeHoursRange, scope.startingTimeHoursRange);
			angular.copy(timeMinutesRange, scope.startingTimeHMinutesRange);

			angular.copy(timeHoursRange, scope.endingTimeHoursRange);
			angular.copy(timeMinutesRange, scope.endingTimeHMinutesRange);

			if (!scope.noValidation && scope.timeSettings.toHour < scope.timeSettings.fromHour) {
				scope.timeSettings.toHour = scope.timeSettings.fromHour;
			}

			/**
			 * Update the time being shown in time filter once its being updated and the req is being sent
			 */
			scope.updateTimeRangeFilter = function () {
				scope.timeSettings.fromHour = scope.startingHour;
				scope.timeSettings.fromMinute = scope.startingMinute;

				if (!scope.noRange) {
					scope.timeSettings.toHour = scope.endingHour;
					scope.timeSettings.toMinute = scope.endingMinute;
				}
			};

			/**
			 * set (00:00 - 23:59) to be the default time which is the entire time duraion for a particular day
			 */
			scope.setInitialTimeRange = function () {
				if (angular.isUndefined(scope.timeSettings.fromHour)) {
					scope.timeSettings.fromHour = scope.startingTimeHoursRange[0].value;
				}
				scope.initStartingHour = scope.startingHour = scope.timeSettings.fromHour;

				if (angular.isUndefined(scope.timeSettings.fromMinute)) {
					scope.timeSettings.fromMinute = scope.endingTimeHMinutesRange[0].value;
				}
				scope.initStartingMinute = scope.startingMinute = scope.timeSettings.fromMinute;

				if (!scope.noRange && angular.isUndefined(scope.timeSettings.toHour)) {
					scope.timeSettings.toHour = scope.startingTimeHoursRange[scope.timeHourFormat - 1].value;
				}
				scope.initEndingHourHour = scope.endingHour = scope.timeSettings.toHour;

				if (!scope.noRange && angular.isUndefined(scope.timeSettings.toMinute)) {
					scope.timeSettings.toMinute = scope.endingTimeHMinutesRange[59].value;
				}
				scope.initEndingMinute = scope.endingMinute = scope.timeSettings.toMinute;
			};

			scope.resetToOriginalTimeSettings = function () {
				scope.startingHour = scope.initStartingHour;
				scope.startingMinute = scope.initStartingMinute;

				if (!scope.noRange) {
					scope.endingHour = scope.initEndingHourHour;
					scope.endingMinute = scope.initEndingMinute;
				}

				// apply it
				scope.applyTimeRangeFilter();
			};

			scope.clearTimeRange = function () {
				scope.clearCallback();
				scope.closeTimeFilterDropdown();
			};

			/**
			 * Set time filter flag, update the time shown in time filter and finally update the sessions list
			 */
			scope.applyTimeRangeFilter = function () {
				scope.updateTimeRangeFilter();
				scope.applyCallback();
				scope.closeTimeFilterDropdown();
			};
			/**
			 * CLoses time filter and reset the dropdown values if time filter is not applied
			 */
			scope.closeTimeFilterDropdown = function () {
				scope.dropdownToggleState = false;

				scope.startingHour = scope.timeSettings.fromHour;
				scope.startingMinute = scope.timeSettings.fromMinute;

				if (!scope.noRange) {
					scope.endingHour = scope.timeSettings.toHour;
					scope.endingMinute = scope.timeSettings.toMinute;
				}
			};

			/**
			 * Whenever hours changed, need to validate the time (start time < end time)
			 * Also, make the items in dropdown disabled if not applicable
			 */
			scope.validateHours = function () {
				if (scope.startingHour !== scope.endingHour) {
					for (var i = 0; i < timeMinutesRange.length; i++) {
						scope.startingTimeHMinutesRange[i].disabled = false;
						scope.endingTimeHMinutesRange[i].disabled = false;
					}
				} else if (scope.startingMinute >= scope.endingMinute) {
					if (scope.endingMinute !== '00') {
						scope.startingMinute = scope.endingMinute - 1;
						scope.startingMinute = (scope.startingMinute < 10) ? ('0' + scope.startingMinute) : (scope.startingMinute + '');
						scope.validateStartingMinuteTime();
					} else if (scope.endingMinute === '00') {
						scope.endingMinute = '01';
					}
				} else if (scope.startingHour === scope.endingHour) {
					scope.validateStartingMinuteTime();
					scope.validateEndingMinuteTime();
				}

				if (!scope.areInitialSettingsValidated) {
					scope.applyTimeRangeFilter();
				}
			};

			/**
			 * Whenever starting minutes changed, need to validate the time (start time < end time)
			 * Also, make the items in dropdown disabled if not applicable
			 */
			scope.validateStartingMinuteTime = function () {
				for (var i = 0; i < timeMinutesRange.length; i++) {
					if (i > (parseInt(scope.endingMinute, 10) - 1) && i < timeMinutesRange.length) {
						scope.startingTimeHMinutesRange[i].disabled = true;
					}
					else {
						scope.startingTimeHMinutesRange[i].disabled = false;
					}
				}
			};

			/**
			 * Whenever ending minutes changed, need to validate the time (start time < end time)
			 * Also, make the items in dropdown disabled if not applicable
			 */
			scope.validateEndingMinuteTime = function () {
				for (var i = 0; i < timeMinutesRange.length; i++) {
					if (i >= 0 && i < (parseInt(scope.startingMinute, 10) + 1)) {
						scope.endingTimeHMinutesRange[i].disabled = true;
					}
					else {
						scope.endingTimeHMinutesRange[i].disabled = false;
					}
				}
			};

			if (!scope.noRange && !scope.noValidation) {
				scope.$watch('startingHour', function (newValue, oldValue) {
					if (!newValue || newValue === oldValue) { return; }

					for (var i = 0; i < timeHoursRange.length; i++) {
						if (i >= 0 && i < parseInt(scope.startingHour, 10)) {
							scope.endingTimeHoursRange[i].disabled = true;
						}
						else {
							scope.endingTimeHoursRange[i].disabled = false;
						}
					}
					scope.validateHours(scope.startingHour, scope.endingTimeHoursRange);
				});

				scope.$watch('startingMinute', function (newValue, oldValue) {
					if (!newValue || newValue === oldValue || scope.startingHour !== scope.endingHour) { return; }
					scope.validateEndingMinuteTime();
				});

				scope.$watch('endingHour', function (newValue, oldValue) {
					if (!newValue || newValue === oldValue) { return; }

					for (var i = 0; i < timeHoursRange.length; i++) {
						if (i > parseInt(scope.endingHour, 10) && i < timeHoursRange.length) {
							scope.startingTimeHoursRange[i].disabled = true;
						}
						else {
							scope.startingTimeHoursRange[i].disabled = false;
						}
					}
					scope.validateHours(scope.endingHour, scope.startingTimeHoursRange);
				});

				scope.$watch('endingMinute', function (newValue, oldValue) {
					if (!newValue || newValue === oldValue || scope.startingHour !== scope.endingHour) { return; }
					scope.validateStartingMinuteTime();

					if (!scope.areInitialSettingsValidated) {
						scope.areInitialSettingsValidated = true;
					}
				});
			}

			// just to boot it in next cycle
			$timeout(function () {
				scope.setInitialTimeRange();
			}, 0);

			// prevent closing dropdown when clicking inside it anywhere
			element.bind('click', function(e) {
				if (e !== null) {
					if (typeof e.stopPropagation === 'function') {
						e.stopPropagation();
					}
				}
			});

			// close the dropdown when clicked anywhere on the document except the dropdown
			var onDocumentClick = function() {
				scope.closeTimeFilterDropdown();
				scope.$digest();
			};

			// bind the click handler
			angular.element(document).bind('click', onDocumentClick);

			// unbind the click handler when the directive's scope is destroyed
			scope.$on('$destroy', function() {
				return angular.element(document).unbind('click', onDocumentClick);
			});
		}
	};
}]);
