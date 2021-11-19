// operator match source code

function contentInside(string, op1, op2) {
    let buf = "";
    let state = -1
    for (let i= 0 ; i < string.length ; ++ i) {
        if (string[i] == op1 && state == -1) {
            state = 0;
            state += 10
        } else if (string[i] == op1 && state != -1) {
            state += 10
            buf += op1
            
            // console.log("matched " + buf + "\nstate: " + state)
        } else if (string[i] == op2 && state != 0) {
            state -= 10
            buf += op2
            
            // console.log("matched " + buf + "\nstate: " + state)
        } else if (string[i] == op2 && state == 0) {
            break;
        } else {
            buf += string[i]
        }
    }

    if (state != 0 && buf.length > 0) {
        console.error(string + "\n^\nerror: unbalanced tokens (-Wstate--not-zero)")
        return "ERR"
    }

    else if (buf.length == 0 && state != 0) { console.error(string + "\n^\nerror: nothing to return (did you open the match?) (-Wbuffer--not-full)"); return "ERR" }

    return buf.trim();
}

module.exports.match = contentInside

contentInside("((()))", '(', ')')