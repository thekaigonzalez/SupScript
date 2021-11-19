// DeepSlate source code

function DeepSlate_Traverse(obj, str, debug=false) {
    if (obj == null || typeof obj != "object") return null

    let place = "";
    let curnode;

    for (let i = 0 ; i < str.length ; ++i) {
        if (str[i] == '.') {
            if (curnode == null) {
                curnode = obj[place]
            } else {
                
                if (curnode[place] != null && typeof curnode[place] != 'object')
                    return curnode[place]
                else {
                    if (debug) {
                        console.log("debug: deepslate: traversing node " + place)
                    }
                    curnode = curnode[place]
                }
            }
            place = "";
        }
        else {
            place = place + str[i];
        }
    }
    if (curnode == null) return obj[place] || null
    if (place.length >0 && curnode[place] != null) return curnode[place]

    return curnode;
}

// console.log(DeepSlate_Traverse({obj1: { obj2:{ obj3: { obj4: "hello"} } }}, "obj1.obj2.obj3.obj4"));

module.exports.traverse = DeepSlate_Traverse