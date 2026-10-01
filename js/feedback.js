"use strict";

const abrirModal = document.getElementById("abrir-modal");
const modalParticipacao = document.getElementById("modal-participacao");

abrirModal.addEventListener("click", function () {
    if (!modalParticipacao.open) {
        modalParticipacao.showModal();
    }
});

modalParticipacao.addEventListener("close", function () {
    abrirModal.focus();
});