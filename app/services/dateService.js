angular.module('DateService', [])
    .service('dateService', function () {
        /**
         * Populates object with valid date data
         * @returns object with three arrays containing the valid days, months and years respectively
         * @author namesty
         */
        this.initDateData = () => {
            let result = {
                days: [],
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],
                years: []
            }
            for (let i = 0; i < 5; i++) { result.years.push(i + 2019) }
            for (let i = 1; i <= 31; i++) { result.days.push(i) }

            return result;
        }

        /**
         * Changes the available days for the days sel@param {string} selectedMonth name of the month the user selectedect, based on the user's month and year selection
         * @param {string} selectedMonth name of the month the user selected
         * @param {int} selectedYear number of the year the user selected
         * @returns array with valid days
         * @author namesty
         */
        this.changeDays = (selectedMonth, selectedYear) => {
            let monthNumber = getNumberOfDaysInMonth(selectedMonth, selectedYear);
            let result = [];
            for (let i = 1; i <= monthNumber; i++) { result.push(i) }
            return result;
        }

        /**
         * Calculates if year is a Leap Year
         * @param {int} y year number
         * @returns 1 if true or 0 if false
         * @author namesty
         */
        let isLeapYear = (y) => {
            let year = y || 0;
            return ((year % 400 == 0 || year % 100 != 0) && (year % 4 == 0)) ? 1 : 0;
        }

        /**
         * Calculates number of days in a month
         * @param {string} m month name
         * @param {int} y year number
         * @returns number of days in a certain month
         * @author namesty
         */
        let getNumberOfDaysInMonth = (m, y) => {
            m = monthNameToNumber(m);
            var selectedMonth = m || 0;
            return 31 - ((selectedMonth === 2) ? (3 - isLeapYear(y)) : ((selectedMonth - 1) % 7 % 2));
        }

        /**
         * Lookup function to convert a month into its number equivalent 
         * @param {string} name of the month to convert
         * @returns integer with number equivalent of month
         * @author namesty
         */
        let monthNameToNumber = (name) => {
            switch (name) {
                case 'January': return 1;
                case 'February': return 2;
                case 'March': return 3;
                case 'April': return 4;
                case 'May': return 5;
                case 'June': return 6;
                case 'July': return 7;
                case 'August': return 8;
                case 'September': return 9;
                case 'October': return 10;
                case 'November': return 11;
                case 'December': return 12;
            }
        }
    });