// const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado","Domingo"];
const diasNew = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
const mesesAbreviados = ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sep.", "Oct.", "Nov.", "Dic."];
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

//todas las fechas se manejan con el siguiente fornato |MES/DIA/AÑO
const Fecha_Dia_DiaNumero_Mes = (fecha) =>{

    let date = new Date(fecha);

    let fechaNum = date.getDate();
    let mes_name = date.getMonth();
    let fechaTexto = diasNew[date.getDay()] + " " + fechaNum +" "+ meses[mes_name];
    return fechaTexto;
    
}

const Fecha_Formatear = (fecha) => {
    let mes = fecha.getMonth()+1;
    let dia = fecha.getDate();
    const anio = fecha.getFullYear();
    
    if(parseInt(dia) >= 1 && parseInt(dia) <= 9){
        dia = 0 + dia.toString();
    }

    if(parseInt(mes) >= 1 && parseInt(mes) <= 9){
        mes = 0 + mes.toString();
    }

    const fechaFinal = dia + '/' + mes + '/' + anio;

    return fechaFinal;
}

const Fecha_Formatear_Con_Horas = (fecha) => {
    const mes = fecha.getMonth()+1;
    const anio = fecha.getFullYear();
    let dia = fecha.getDate();

    if(parseInt(dia) >= 1 && parseInt(dia) <= 9){
        dia = 0 + dia.toString();
    }

    const fechaFinal = dia + '/' + mes + '/' + anio;

    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();

    const segundaParte = horas + ':' + minutos + ':' + segundos;

    return fechaFinal + ' ' + segundaParte;
}

// const QuitarHoras = (fecha) => {
//     fecha.setHours(0);
//     fecha.setMinutes(0);
//     fecha.setSeconds(0);
//     fecha.setMilliseconds(0);

//     return fecha;
// }


//todas las fechas se manejan con el siguiente fornato |MES/DIA/AÑO
const Fecha_Dia_DiaNumero_Mes_Anio = (fecha) =>{
    let date = new Date(fecha);

    let fechaNum = date.getDate();
    let mes_name = date.getMonth();
    let fechaTexto = diasNew[date.getDay()] + " " + fechaNum + " " + meses[mes_name] + " de " + date.getFullYear();
    return fechaTexto;
}

//LA FUNCION SE MANEJA CON FECHA DE JAVASCRIPT
const Fecha_Nombre_Dia = (date) =>{

    let diaNombre = diasNew[date.getDay()];

    return diaNombre;
}

//LA FUNCION SE MANEJA CON FECHA DE JAVASCRIPT
const Fecha_Dia_MesNombreAbreviado = (date) =>{
    let dia = date.getDate();
    let mesNombreAbreviado = mesesAbreviados[date.getMonth()];

    let fechaDiaMesNombreAbreviado = dia + " " + mesNombreAbreviado;

    return fechaDiaMesNombreAbreviado;
}

//funcion encargada de rellenar los dias
const rellenarDias = (fechaInicioSistema) =>{

    const fechaActual = obtenerFechaActual();

    let arregloDias = [];
    let fechaAux = fechaActual;

    //se agregaran al arreglo 15 dias hacia el futuro
    for (let i = 0; i <= 15; i++) {
        let obj = {FechaCompleta:"", NombreDia:"", DiaMesAbreviado:"", Porcentaje:"", Estado:"",FechaJS:"",DescripcionFeriado:"",TIPO_DIA:"NORMAL"};

        if(i == 0){
        obj.Estado = "HOY";
        }else{
        obj.Estado = "FUTURO";
        }

        obj = EsFindesemana(obj,fechaAux);
        
        //obtengo la fecha 
        let diaNombre = Fecha_Nombre_Dia(fechaAux);
        
        //obtengo la fecha con su nombre abreviado
        let fechaDiaMesNombreAbreviado = Fecha_Dia_MesNombreAbreviado(fechaAux);

        //formateo la fecha con el formato (dd-mm-yyyy)
        obj.FechaCompleta = Fecha_Formatear(fechaAux);
        obj.FechaJS = fechaAux.toString();
        obj.NombreDia = diaNombre;
        obj.DiaMesAbreviado = fechaDiaMesNombreAbreviado;
        fechaAux.setDate(fechaAux.getDate() + 1);  
        arregloDias.push(obj);
    }

    fechaAux = obtenerFechaActual();
   

    let fechaInicioSistemaDate = stringADate(fechaInicioSistema);
    fechaAux.setHours(0,0,0,0);


    //se agregaran al arreglo 15 dias hacia el pasado
        for (let i = 0; i <= 15; i++) {


    
            fechaAux.setDate(fechaAux.getDate() - 1);  

            let obj = {FechaCompleta:"", NombreDia:"", DiaMesAbreviado:"", Porcentaje:"", Estado:"",FechaJS:"",DescripcionFeriado:"",TIPO_DIA:"NORMAL"};

            if(i == 0){
                obj.Estado = "MODIFICABLE";
            }else{
                obj.Estado = "PASADO";
            }
            
            obj = EsFindesemana(obj,fechaAux);

            //obtengo la fecha 
            let diaNombre = Fecha_Nombre_Dia(fechaAux);


            //obtengo la fecha con su nombre abreviado
            let fechaDiaMesNombreAbreviado = Fecha_Dia_MesNombreAbreviado(fechaAux);


            //formateo la fecha con el formato (dd-mm-yyyy)
            obj.FechaCompleta = Fecha_Formatear(fechaAux);
            obj.FechaJS = fechaAux.toString();
            obj.NombreDia = diaNombre;
            obj.DiaMesAbreviado = fechaDiaMesNombreAbreviado;
            
            if(fechaAux.getTime() >= fechaInicioSistemaDate.getTime()){
                arregloDias.unshift(obj);
            }
        }


    return arregloDias;
}
//convierte la fecha dd/mm/yyyy a  date en javascript
const stringADate = (fechaString)=>{
    var dateString = fechaString; 

    var dateParts = dateString.split("/");

    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return dateObject;
}

const EsFindesemana = (ObjetoConFecha,FechaVerificar) =>{

    let dia = FechaVerificar.getDay();

    if(dia == 0 || dia == 6){
        ObjetoConFecha.TIPO_DIA = "FIN_DE_SEMANA";
    }

    return ObjetoConFecha;
}


const obtenerFechaActual = () =>{
    const fechaActual = new Date();
    return fechaActual;
}

    
module.exports = {
    Fecha_Dia_DiaNumero_Mes,
    Fecha_Dia_DiaNumero_Mes_Anio,
    rellenarDias,
    obtenerFechaActual,
    Fecha_Formatear_Con_Horas,
    Fecha_Formatear
}