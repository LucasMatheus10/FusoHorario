const key = '2JTZYR5LZUAB';
const horas = document.querySelector('.horas'); // alterado de 'horas' para '.horas'
const minutos = document.querySelector('.minutos'); // alterado de 'minutos' para '.minutos'
const segundos = document.querySelector('.segundos'); // alterado de 'segundos' para '.segundos'

function mostraDados(data) {
    const formattedDate = new Date(data.formatted);
    const hours = formattedDate.getHours();
    const minutes = formattedDate.getMinutes();
    const seconds = formattedDate.getSeconds();

    atualizarElemento(horas, hours, 'Horas');
    atualizarElemento(minutos, minutes, 'Minutos');
    atualizarElemento(segundos, seconds, 'Segundos');
}

function atualizarElemento(elemento, valor, unidade) {
    const valorFormatado = formatZeroPrefix(valor);
    elemento.innerHTML = `<span>${valorFormatado}</span><p>${unidade}</p>`;
}

function formatZeroPrefix(value) { //adiciona o 0 a frente de valores menores que 10
    return value < 10 ? `0${value}` : value;
}

async function buscaInput(input, timezone) {
    const data = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${key}&format=json&by=zone&zone=${timezone}`).then(response => response.json());
    mostraDados(data);
    console.log(data);
}

function clique(){
    const inputElement = document.querySelector('.input');
    const selectElement = document.querySelector('.timezone-select');
    const timezone = selectElement.options[selectElement.selectedIndex].value;
    buscaInput(inputElement.value, timezone);
}

document.querySelector('.input').addEventListener('input', function() {
    const input = this.value.toLowerCase();
    const selectElement = document.querySelector('.timezone-select');

    // Filtra as opções do dropdown com base no que é digitado no input
    for (let i = 0; i < selectElement.options.length; i++) {
        const optionText = selectElement.options[i].text.toLowerCase();
        selectElement.options[i].style.display = optionText.includes(input) ? 'block' : 'none';
    }
});

async function preencherTimezones() {
    const selectElement = document.querySelector('.timezone-select');
    selectElement.innerHTML = ''; // Limpa a caixa de seleção

    const data = await fetch(`http://api.timezonedb.com/v2.1/list-time-zone?key=${key}&format=json`).then(response => response.json());

    data.zones.forEach(zone => { // Adiciona as opções passadas pelo json no select
        const option = document.createElement('option');
        option.value = zone.zoneName;
        option.text = zone.zoneName;
        selectElement.appendChild(option);
    });     
}

// Chame a função ao carregar a página
document.addEventListener('DOMContentLoaded', preencherTimezones);