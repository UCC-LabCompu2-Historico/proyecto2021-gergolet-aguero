//Carga tableros del archivo o manualmente
const facil = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medio = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const dificil = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

//Crear variables
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

/**
 * Valida el Ingreso en el input "Nombre" verificando que sean solo letras;
 * @method SoloLetras
 * @param (key) e-- ingreso por teclado en el input.
 * @return si ecneuntra elementos que no son letras, false acompañado de un alert.
 */
function SoloLetras(e)
{
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toString();
    letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚabcdefghijklmnopqrstuvwxyzáéíóúñÑüÜ";
    especiales = [8,13];
    tecla_especial = false;
    for(var i in especiales) {
        if(key == especiales[i]){
            tecla_especial = true;
            break;
        }
    }
    if(letras.indexOf(tecla) == -1 && !tecla_especial)
    {
        alert("Ingresar solo letras");
        return false;
    }
}
/**
 * Funcion creadora del canvas
 * @method BoxWhite
 */
function BoxWhite(){
    var canvas=document.getElementById("myCanvas");
    var ctx=canvas.getContext("2d")
}

//Correr el inicio del juego - funcion cuando el boton es clickeado
window.onload = function() {
    id("empezar").addEventListener("click", startGame);
    //Agregue un event listener a cada número en el contenedor de números
    for (let i=0; i<id("number-container").children.length; i++){
        id("number-container").children[i].addEventListener("click", function (){
            //Si la selección no está deshabilitada
            if(!disableSelect){
                //Si el numero esta seleccionado
                if(this.classList.contains("selected")){
                    //Ahora removemos la seleccion
                    this.classList.remove("selected");
                    selectedNum = null;
                }else{
                    //Deseleccionar todos los otros numeros
                    for(let i=0; i<9;i++){
                        id("number-container").children[i].classList.remove("selected");
                    }
                    //Seleccionamos y actualizamos la variable "selectedNum"
                    this.classList.add("selected");
                    selectedNum=this;
                    updateMove();
                }
            }
        });
    }
}

/**
 * Selecciona un tablero segun el id que haya elegido (easy, med, dif) y hace visibles a los numeros antes ocultos (number-container)
 * @method startGame
 * @param (string) id - (llamados dentro de la funcion) los id de los 3 tipos de juego: facil, medio, dificil (este ultimo no se llama porque se llama de manera automatica con el ultimo else)
 * @param (string) id - el id number-container (mosaicos chicos al cosatdo del tablero con los numeros que van del 1 al 9)
 */
function startGame() {
//Elegir dificultad en el tablero
    if(document.getElementById("nombre").value==""){
        alert("ES OBLIGATORIO INGRESAR EL NOMBRE");
    }
    else{
        let board;
        if (id("easy").checked) board = facil[0];
        else if (id("med").checked) board = medio[0];
        else board = dificil[0];
        //Establecer 10 vidas y seleccionar numeros y mosaicos
        lives=10;
        disableSelect = false;
        id("lives").textContent = "Vidas Restantes: 10";
        //Crear tablero en base a la dificultad
        generateBoard(board);
        //Empezar temporizador
        startTimer();
        //Muestra el numero en el contenedor
        id("number-container").classList.remove("hidden");
    }
}


/**
 * Comienza un conntador en reversa primeramente en segundos para los distintos id (180=3min, etc)
 * @method startTimer
 * @param (string) id - (llamados dentro de la funcion) Los 3 id de time: time-1, time-2, time-3 (este ultimo no se llama porque se llama de manera automatica con el ultimo else).
 * @param (string) id - (llamado dentro de la funcion) el id timer, para luego extraer su contenido y mandarlo a otra funcion.
 */
function startTimer(){
    //Establece tiempo restante basado en lo ingresado
    if(id("time-1").checked) timeRemaining = 180;
    else if(id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;
    //Establece temporizador en el primer segundo
    id("timer").textContent = timeConversion(timeRemaining);
    //Establece que el temporizador se actualice cada segundo
    timer = setInterval(function() {
        timeRemaining --;
        //Establece que si no hay mas tiempo se termina el juego
        if (timeRemaining==0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000)
}


/**
 * Conversor de tiempo. De segundos a formato 24hs (00:00)
 * @method timeConversion
 * @param (var) valor - El valor de timeRemaining (tiempo restante)
 * @return (let) valor - El tiempo por separado, minutos::segundos (00:00)
 */

function timeConversion(time){
//Cambia el formato del temporizador (mm:ss)
    let minutes = Math.floor(time/60);
    if(minutes<10) minutes = "0" + minutes;
    let seconds = time%60;
    if(seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}


/**
 * Crea el tablero de 9x9 mosaicos
 * @method generateBoard
 * @param (let) valor - El valor de board definido en la funcion startGame segun la dificultad elegida
 * @param (string) id - (llamado dentro de la funcion) El id del tablero para agregarle appendChild;
 */
function generateBoard(board) {
    //Limpiar tablero previo
    clearPrevious();
    //Lo usamos para incrementar los id de los mosaicos
    let idCount = 0;
    //Crear los 81 mosaicos
    for(let i = 0; i < 81; i++){
        //Crear un nuevo elemento de parrafo
        let tile = document.createElement("p");
//Si el mosaico no se supone que este en blanco
        if (board.charAt(i) != "-"){
            //Establecer el texto del mosaico en el numero correcto
            tile.textContent = board.charAt(i);
        } else{
            //Añadir event listener de click al mosaico
            tile.addEventListener("click", function(){
                //Si la seleccion no esta desactivada
                if(!disableSelect){
                    //Si el mosaico esta todavia seleccionado
                    if(tile.classList.contains("selected")){
                        //Removemos seleccion
                        tile.classList.remove("selected");
                        selectedTile = null;
                    }else{
                        //Deseleccionamos todos los otros mosaicos
                        for (let i=0;i<81;i++){
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //Añade seleccion y actualiza la variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
        tile.id = idCount;
        idCount ++;
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27)||(tile.id > 44 && tile.id < 54)){
            tile.classList.add("bottomBorder");
        }
        if((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6){
            tile.classList.add("rightBorder");
        }
        //Añade mosaico al tablero
        id("board").appendChild(tile);
    }
}


/**
 * Realiza todos los cambios al tocar un numero primero y un mosaico despues, o viceversa.
 * @method updateMove
 * @param (string) id - (llamado dentro de la funcion) El id de vidas para restarlas en caso de que checkCorrect sea falso.
 */
function updateMove(){
    //Si un mosaico y un numero son seleccionados
    if(selectedTile && selectedNum){
        //Establece el mosaico en el numero correcto
        selectedTile.textContent = selectedNum.textContent;
        //Si el numero corresponde al numero solucion
        if(checkCorrect(selectedTile)){
            //Deselecciona el mosaico
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //Limpia las variables seleccionadas
            selectedNum = null;
            selectedTile = null;
            //Se fija si el tablero esta completo
            if(checkDone()){
                endGame();
            }
            //Si el numero no corresponde a la solucion...
        }else{
            //Inhabilita el numero seleccionado por un segundo
            disableSelect = true;
            //El mosaico se pone rojo
            selectedTile.classList.add("incorrect");
            //Lo corre en un segundo
            setTimeout(function(){
                //Resta la vida en uno
                lives --;
                //Si las vidas llegan a 0 se termina el juego
                if (lives === 0) {
                    endGame();
                }else{
                    //Si la vida no es igual a 0
                    //Se actualiza el numero de vidas
                    id("lives").textContent = "Vidas Restantes: " + lives;
                    //Habilitar seleccion de numeros y mosaicos
                    disableSelect = false;
                }
                //Reestablecer el color del mosaico y la seleccion de ambos
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                //Limpia el texto de el mosaico y limpia las variables seleccionadas
                selectedTile.textContent= "";
                selectedTile = null;
                selectedNUm = null;
            },1000);
        }
    }
}


/**
 * Verifica cuando TODO el tablero esta completo
 * @method checkDone
 * @return true para tablero sin mosaicos vacios("") y false para lo contrario
 */
function checkDone(){
    let tiles = qsa(".tile");
    for(let i=0; i<tile.length;i++){
        if(tiles[i].textContent === "") return false;
    }
    return true;
}


/**
 * Bloquea todo los movimientos (termina el juego).
 * @method endGame
 * @param (string) id - (llamado dentro de la funcion) El id de vidas
 */
function endGame() {
    //Desactiva lo movimientos y para el temporizador
    disableSelect=true;
    clearTimeout(timer);
    if(lives===0 || timeRemaining === 0){
        //Muestra si ganaste o perdiste
        id("lives").textContent = "PERDISTE!!";
    }else{
        id("lives").textContent = "GANASTE!!";
    }
}


/**
 * Elige la solucion segun el nivel elegido.
 * @method checkCorrect
 * @param (var)  Mosaico Seleccionado
 * @param (string) id - (llamadas dentro de la funcion) las 3 id de los 3 niveles.
 * @return true or false segun si esta bien colocado o no el numero que espera el juego.
 */
function checkCorrect(tile){
    //Establece la solucion basado en la dificultad seleccionada
    let solution;
    if (id("easy").checked) solution = facil[1];
    else if (id("med").checked) solution = medio[1];
    else solution = dificil[1];
    //Si el numero del mosaico corresponde a al numero de la solucion
    if (solution.charAt(tile.id) === tile.textContent)return true;
    else return false;
}

/**
 * Limpia el tablero anterior.
 * @method clearPrevious
 * @param (string) id - (llamada dentro de la funcion) el id number-container
 */
function clearPrevious() {
    //Acceso total a los mosaicos
    let tiles = qsa(".tile");
    //Remover cada mosaico
    for (let i=0; i<tiles.length;i++){
        tiles[i].remove();
    }
    //Si hay un temporizador, limpiarlo
    if (timer) clearTimeout(timer);
    //Deseleccionar cualquier numero
    for (let i=0; i<id("number-container").children.length; i++){
        id("number-container").children[i].classList.remove("selected");
    }
    //Limpiar variables seleccionadas
    selectedTile = null;
    selectedNum = null;
}


/**
 * Funciones de Ayuda que retornan disntintos valores cuando son llamadas
 */
//funciones de ayuda
function id(id) {
    return document.getElementById(id);
}
function qs(selector){
    return document.querySelector(selector);
}
function qsa(selector){
    return document.querySelectorAll(selector);
}