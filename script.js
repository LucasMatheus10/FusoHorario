const key = '2JTZYR5LZUAB';
const horasElement = document.querySelector('.horas');
const minutosElement = document.querySelector('.minutos');
const segundosElement = document.querySelector('.segundos');
const inputElement = document.querySelector('.input');
const selectElement = document.querySelector('.timezone-select');
const selectInputContainer = document.querySelector('.selectInput');

selectElement.style.display = 'none';
selectInputContainer.style.height = "auto";

let relogio = setInterval(function mostraHoraLocal() {
    const formattedDate = new Date();
    const hours = formattedDate.getHours();
    const minutes = formattedDate.getMinutes();
    const seconds = formattedDate.getSeconds();

    atualizarElemento(horasElement, hours, 'Horas');
    atualizarElemento(minutosElement, minutes, 'Minutos');
    atualizarElemento(segundosElement, seconds, 'Segundos');
}, 1000);

function atualizarElemento(elemento, valor, unidade) {
    const valorFormatado = formatZeroPrefix(valor);
    elemento.innerHTML = `<span>${valorFormatado}</span><p>${unidade}</p>`;
}

function formatZeroPrefix(value) { // verifica se o elemento é menor que 10, caso seja adiciona um 0 a frente
    if (value < 10) {
        return `0${value}`;
    } else {
        return value;
    }
}

async function buscaInput(input, timezone) {
    const data = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${key}&format=json&by=zone&zone=${timezone}`).then(response => response.json());
    
    clearInterval(relogio);

    // Atualiza o intervalo com a nova hora
    relogio = setInterval(function mostraHoraPesquisada() {
        const formattedDate = new Date(data.formatted);
        const hours = formattedDate.getHours();
        const minutes = formattedDate.getMinutes();
        const seconds = formattedDate.getSeconds();

        atualizarElemento(horasElement, hours, 'Horas');
        atualizarElemento(minutosElement, minutes, 'Minutos');
        atualizarElemento(segundosElement, seconds, 'Segundos');
    }, 1000);
}

selectElement.addEventListener('change', function () {
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    if (selectedOption) { // Verifica se uma opção foi selecionada
        const timezone = selectedOption.value;
        // Atualiza o valor do inputElement com o valor da opção selecionada
        inputElement.value = timezone;
    }
});

function clique() {
    let timezone;

    if (inputElement.value.trim() === '' && selectElement.selectedIndex !== -1) { // Se o input está vazio e uma opção foi selecionada no select, usa a opção selecionada
        timezone = selectElement.options[selectElement.selectedIndex].value;
    } else { // Se o input não está vazio, usa o valor digitado no input
        timezone = inputElement.value.trim(); // .trim remove espaços em branco no início ou final da string
    }

    // Chama a função buscaInput com os valores atualizados
    buscaInput(inputElement.value, timezone);
}

inputElement.addEventListener('input', function () { // filtra as opções do select com base no que é digitado no input
    const input = this.value.toLowerCase(); // deixa tudo minúsculo pra facilitar a comparação

    for (let i = 0; i < selectElement.options.length; i++) {
        const optionText = selectElement.options[i].text.toLowerCase();

        if (optionText.includes(input)) { // se o texto digitado conter uma possível opção, ele é exibido, se não, ele é ocultado
            selectElement.options[i].style.display = 'block';
        } else {
            selectElement.options[i].style.display = 'none';
        }
    }
});

async function preencherTimezones() {
    selectElement.innerHTML = '';

    const data = await fetch(`http://api.timezonedb.com/v2.1/list-time-zone?key=${key}&format=json`).then(response => response.json());

    // pega a lista de timezones fornecida pela api, cria um elemento option e adiciona ao select
    data.zones.forEach(zone => {
        const option = document.createElement('option');
        option.value = zone.zoneName;
        option.text = zone.zoneName;
        selectElement.appendChild(option);
    });
}

inputElement.addEventListener('click', function () {
    selectElement.style.display = "flex";
});

document.addEventListener('click', function (event) { // pra quando clicar em qualquer lugar fora do input e do select, o select desaparecer
    if (event.target !== inputElement && event.target !== selectElement) {
        selectElement.style.display = "none";
    }
});

document.addEventListener('DOMContentLoaded', preencherTimezones);