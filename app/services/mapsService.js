angular.module('MapsService',[])
.service('mapsService', function($http){
    this.sendAddress = async (address)=>{
        try{
            console.log(address)
            return await $http.post('http://www.mocky.io/v2/5d09cda73400004227d82fd9', address);
        }catch(err){
            console.log(err)
        }
    }
})