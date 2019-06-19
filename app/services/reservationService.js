let ReservationService = angular.module('ReservationService',[])
.service('reservationService', function(){
    let reservation;
    this.add = (inReservation)=>{
        reservation = inReservation;
    };
    this.get = ()=>{
        return reservation;
    }
})