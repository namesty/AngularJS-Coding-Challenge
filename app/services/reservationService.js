angular.module('ReservationService', [])
    .service('reservationService', function () {
        let reservation = {
            address: null
        };
        this.add = (inReservation) => {
            reservation = inReservation;
        };
        this.get = () => {
            return reservation;
        }
        this.delete = () => {
            reservation = {
                address: null
            };
        }
    })