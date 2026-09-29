"use strict";

const formulario = document.getElementById("formulario-cadastro");
const resultado = document.getElementById("resultado");
const nascimento = document.getElementById("nascimento");
const botaoValidar = document.getElementById("botao-validar");

/* Formatação dos campos */
function formatarCPF(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    return numeros
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/(\d{3}\.\d{3}\.\d{3})(\d)/, "$1-$2");
}

function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
        return numeros;
    }

    if (numeros.length <= 7) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function formatarCEP(valor) {
    return valor
        .replace(/\D/g, "")
        .slice(0, 8)
        .replace(/^(\d{5})(\d)/, "$1-$2");
}

/* Aplica a máscara e mantém o cursor próximo da posição editada */
function aplicarMascara(id, formatar) {
    const campo = document.getElementById(id);

    campo.addEventListener("input", function () {
        const posicao = campo.selectionStart ?? campo.value.length;
        const numerosAntesDoCursor = campo.value
            .slice(0, posicao)
            .replace(/\D/g, "").length;

        campo.value = formatar(campo.value);

        let novaPosicao = 0;
        let quantidade = 0;

        while (
            novaPosicao < campo.value.length &&
            quantidade < numerosAntesDoCursor
        ) {
            if (/\d/.test(campo.value[novaPosicao])) {
                quantidade++;
            }

            novaPosicao++;
        }

        campo.setSelectionRange(novaPosicao, novaPosicao);
    });

    /* Permite colar valores com ou sem pontuação */
    campo.addEventListener("paste", function (evento) {
        if (!evento.clipboardData) {
            return;
        }

        evento.preventDefault();

        const texto = evento.clipboardData.getData("text");
        const inicio = campo.selectionStart ?? 0;
        const fim = campo.selectionEnd ?? inicio;

        campo.value = formatar(
            campo.value.slice(0, inicio) +
            texto +
            campo.value.slice(fim)
        );

        campo.setSelectionRange(campo.value.length, campo.value.length);
        campo.dispatchEvent(new Event("input", { bubbles: true }));
    });

    campo.value = formatar(campo.value);
}

aplicarMascara("cpf", formatarCPF);
aplicarMascara("telefone", formatarTelefone);
aplicarMascara("cep", formatarCEP);

/* Impede a escolha de uma data de nascimento futura */
const hoje = new Date();

nascimento.max = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0")
].join("-");

/* O navegador verifica required, pattern e os demais atributos
   antes de disparar o evento submit. */
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    resultado.textContent =
        "Os campos passaram pela validação do navegador. " +
        "Nenhum dado foi enviado ou armazenado.";
});

/* Remove a mensagem anterior ao alterar qualquer campo */
formulario.addEventListener("input", function () {
    resultado.textContent = "";
});

formulario.addEventListener("change", function () {
    resultado.textContent = "";
});

/* Habilita o botão quando a configuração estiver concluída */
botaoValidar.disabled = false;