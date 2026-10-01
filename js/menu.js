"use strict";

const botaoMenu = document.querySelector(".menu-toggle");
const menuPrincipal = document.getElementById("menu-principal");
const dropdown = document.querySelector(".dropdown");
const resumoProjetos = dropdown.querySelector("summary");
const telaPequena = window.matchMedia("(max-width: 767px)");

function fecharSubmenu() {
    dropdown.open = false;
}

function definirMenu(aberto) {
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    menuPrincipal.hidden = !aberto;

    if (!aberto) {
        fecharSubmenu();
    }
}

function adaptarMenu() {
    const focoAnterior = document.activeElement;
    const focoNoMenu = menuPrincipal.contains(focoAnterior);

    botaoMenu.hidden = !telaPequena.matches;
    fecharSubmenu();

    if (telaPequena.matches) {
        definirMenu(false);

        if (focoNoMenu) {
            botaoMenu.focus();
        }
    } else {
        menuPrincipal.hidden = false;
        botaoMenu.setAttribute("aria-expanded", "false");

        if (focoAnterior === botaoMenu) {
            menuPrincipal.querySelector("a").focus();
        } else if (dropdown.contains(focoAnterior)) {
            resumoProjetos.focus();
        }
    }
}

botaoMenu.addEventListener("click", function () {
    const aberto = botaoMenu.getAttribute("aria-expanded") === "true";
    definirMenu(!aberto);
});

/* Escape fecha o submenu ou, no celular, o menu principal */
document.addEventListener("keydown", function (evento) {
    if (evento.key !== "Escape") {
        return;
    }

    if (dropdown.open) {
        fecharSubmenu();
        resumoProjetos.focus();
    } else if (telaPequena.matches && !menuPrincipal.hidden) {
        definirMenu(false);
        botaoMenu.focus();
    }
});

/* Fecha o submenu ao clicar ou mover o foco para fora dele */
document.addEventListener("click", function (evento) {
    if (!dropdown.contains(evento.target)) {
        fecharSubmenu();
    }
});

document.addEventListener("focusin", function (evento) {
    if (!dropdown.contains(evento.target)) {
        fecharSubmenu();
    }
});

/* Fecha a navegação móvel depois da escolha de um link */
menuPrincipal.addEventListener("click", function (evento) {
    const link = evento.target.closest("a");

    if (!link) {
        return;
    }

    fecharSubmenu();

    if (telaPequena.matches) {
        definirMenu(false);
        botaoMenu.focus();
    }
});

/* Identifica a página atual sem marcar os links de âncoras */
menuPrincipal.querySelectorAll("a").forEach(function (link) {
    const destino = new URL(link.href);

    if (
        destino.pathname === window.location.pathname &&
        !destino.hash
    ) {
        link.setAttribute("aria-current", "page");
    }
});

telaPequena.addEventListener("change", adaptarMenu);
adaptarMenu();