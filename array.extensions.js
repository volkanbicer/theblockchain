if(!Array.prototype.last){
    Array.prototype.last = function(){
        return this.slice(-1)[0];
    }
}

if(!Array.prototype.first){
    Array.prototype.first = function(){
        return this[0];
    }
}
