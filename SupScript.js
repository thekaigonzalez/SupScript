// Copyright (C) 2021 Kai D. Gonzalez
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

const OPM = require("./operatormatch")
const ds = require("./DeepSlate")

function MyAST(code) {
    let state = 0;
    let temp_buf = "";
    let fname = ""
    for (let i = 0 ; i < code.length ; ++ i) {
        if (code[i] == '(' && state == 0) {
            state = 1;
            fname = temp_buf

        
            temp_buf = "";

            temp_buf += '('
        } else {
            temp_buf += code[i]
        }
    }

    if (state == 0) return temp_buf

    let ctx = OPM.match(temp_buf, '(', ')').substring(0, OPM.match(temp_buf, '(', ')').lastIndexOf(")"))

    let argar = []
    state = 0
    temp_buf = "";
    for (let i =0 ;i < ctx.length ; ++ i) {
        if (ctx[i] == '.' && state == 0) {
            argar.push(temp_buf.trim())
            temp_buf = "";
        } else {
            temp_buf += ctx[i]
        }
    }

    if (temp_buf.length >0) {
        argar.push(temp_buf.trim())
        temp_buf = "";
    }
    return {
        "fun": fname,
        "args": argar
    }
}

function b_print(a) {
    console.log(a[0])
}

function std_add(a) {
    return a[0] + a[1]
}

let mymem = {
    'std': {
        'print': b_print,
        "math": {
            "add": std_add
        }
    },
    'test': b_print
}

function append_jsclosure(tab, name, func) {
    if (mymem[tab] == null) return null;

    mymem[tab][name] = func
}

function sup_register(name, bind) {
    mymem[name] = bind
}

function Myeval(str) {
    let ast = MyAST(str)
    // console.log(ast.fun)
    // console.log(ast)
    if (typeof ast == 'string') {
        if (ds.traverse(mymem, ast) != null) return ds.traverse(mymem, ast)
        return ast
    };
    for (let i = 0; i < ast["args"].length ; ++i) {
        
        ast.args[i] = eval(Myeval(ast.args[i]))
    }
    
    return ds.traverse(mymem, ast.fun)(ast.args)
}
module.exports.eval = Myeval;

module.exports.devtools = {}

module.exports.devtools.ast_generate = MyAST

module.exports.sup_register = sup_register;

module.exports.append_jsclosure = append_jsclosure