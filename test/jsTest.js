// testing err, undefined, null


bla = function ausgabe(i) {
    var err
    if (i) {
        x = i ** 2
        if (err) {
            return(err)
        }
        return (x)
    }
}

blub = bla(2)

console.log(blub)