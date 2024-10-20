const monto = document.querySelector(".monto");
const resultado = document.querySelector(".resultado")
const graficos = document.querySelector(".grafico");
let moneda = ""
async function loadData() {
    try {
        const section = document.querySelector(".listado")
        const urlDatos = "https://mindicador.cl/api/"
        const res = await fetch(urlDatos)
        const datos = await res.json()
        console.table(datos)
        let html = ""
        html += `<select name="monedas" id="monedas" onchange="limpiaRegistro()">`
        html += `<option value = "${datos["euro"].codigo + '*|*' + datos["euro"].valor}">${datos["euro"].nombre}</option>`
        html += `<option value = "${datos["dolar"].codigo + '*|*' + datos["dolar"].valor}">${datos["dolar"].nombre}</option>`
        html += `<option value = "${datos["uf"].codigo + '*|*' + datos["uf"].valor}">${datos["uf"].nombre}</option>`
        html += `<option value = "${datos["bitcoin"].codigo + '*|*' + datos["bitcoin"].valor}">${datos["bitcoin"].nombre}</option>`
        html += `</select>`
        section.innerHTML = html;
        moneda = document.querySelector("#monedas");
        graficos.style.background = "rgb(59, 58, 58)"
    } catch (error) {
        console.error(error)
    }
}
function valida(){
    let valor = monto.value
    if(valor===""){
        alert("Elemento vacio")
    }
    else{
        convertir()
    }
}
function limpiaRegistro(){
    resultado.textContent=""
    graficos.style.background = "rgb(59, 58, 58)"
    graficos.innerHTML= `<canvas id="myChart"></canvas>`
    moneda = document.querySelector("#monedas");
}
function convertir() {

    const arrMoneda = moneda.value.split("*|*")

    let calculo = monto.value / Number(arrMoneda[1])

    let resultadoCalculo = parseFloat(calculo).toFixed(5)
    resultado.innerHTML = `Resultado: $${resultadoCalculo}`
   
    grafico(arrMoneda[0]);
}
async function datosGraficos(moneda){
    try {
        const urlGrafico = `https://mindicador.cl/api/${moneda}`
        const res = await fetch(urlGrafico)
        let datos = await res.json()
        let labels = datos.serie.map((dato) => {
            const fechaUTC = new Date(dato.fecha);
            const diaFormateadoUTC = new Intl.DateTimeFormat('es-ES', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                timeZone: 'America/Santiago'
            }).format(fechaUTC);

            return diaFormateadoUTC;
        
        });
        let data = datos.serie.map((dato) => {
            return Number(dato.valor);
        });
        let datasets = [
            {
                label: moneda,
                borderColor: "rgb(255, 99, 132)",
                data
            }
        ];
        return { labels, datasets };
    } catch (error) {
        console.error(error)
    }    
}
async function grafico(moneda) {
    try {
        graficos.innerHTML= `<canvas id="myChart"></canvas>`
        graficos.style.background = "#fff"

        let data = await datosGraficos(moneda);
        let config = {
            type: "line",
            data
        };
        const myChart = document.querySelector("#myChart");
        new Chart(myChart, config);

    } catch (error) {
        console.error(error)
    }
}
loadData();

