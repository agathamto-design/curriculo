// barra de progresso
const barra = document.createElement("div");
barra.id = "barraProgresso";
document.body.prepend(barra);

const printBtn = document.getElementById("print-pdf-btn");
const themeToggleBtn = document.getElementById("theme-toggle-btn");

function aplicarTema(temaEscuro) {
    document.body.classList.toggle("dark-mode", temaEscuro);

    if (themeToggleBtn) {
        themeToggleBtn.setAttribute("aria-pressed", temaEscuro ? "true" : "false");
        themeToggleBtn.querySelector(".theme-text").textContent = temaEscuro ? "Modo claro" : "Modo escuro";
        themeToggleBtn.querySelector(".theme-icon").textContent = temaEscuro ? "☀️" : "🌙";
    }

    localStorage.setItem("tema-curriculo", temaEscuro ? "dark" : "light");
}

if (printBtn) {
    printBtn.addEventListener("click", () => {
        window.print();
    });
}

const temaSalvo = localStorage.getItem("tema-curriculo");

if (temaSalvo === "dark") {
    aplicarTema(true);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        aplicarTema(!document.body.classList.contains("dark-mode"));
    });
}

window.addEventListener("scroll", () => {
    const altura = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = altura > 0 ? (window.scrollY / altura) * 100 : 0;
    barra.style.width = `${Math.min(100, Math.max(0, progresso))}%`;
});

const foto = document.querySelector(".header img");

if (foto) {
    foto.addEventListener("click", () => {
        confetti({
            particleCount: 180,
            spread: 120,
            origin: { y: 0.6 }
        });
    });
}

const emailElemento = document.querySelector(".pessoal li:nth-child(3)");

if (emailElemento) {
    emailElemento.addEventListener("click", () => {
        navigator.clipboard.writeText("agathamtoleite@gmail.com");
        alert("E-mail copiado com sucesso!");
    });
}

const chatLauncher = document.querySelector(".chat-launcher");
const chatPanel = document.querySelector(".chat-panel");
const chatClose = document.querySelector(".chat-close");
const chatBody = document.querySelector(".chat-body");
const chatQuestions = document.querySelectorAll(".chat-question");
const gameToggleBtn = document.getElementById("game-toggle-btn");
const gameWidget = document.getElementById("game-widget");
const gameClose = document.querySelector(".game-close");
const gameRestart = document.querySelector(".game-restart");
const gameStatus = document.querySelector(".game-status");
const gameCells = document.querySelectorAll(".game-cell");
const avaliacaoForm = document.getElementById("avaliacao-form");

const combinacoesVencedoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let tabuleiro = Array(9).fill("");
let jogoAtivo = false;
let jogadorAtual = "X";

const respostasChat = {
    objetivo: "Busco uma oportunidade como Estagiária para desenvolver minhas habilidades profissionais, adquirir experiência e contribuir com dedicação para a empresa.",
    horario: "Tenho disponibilidade para estágio a combinar, com foco em conciliar aprendizado e rotina da vaga.",
    localizacao: "Moro em Nova Iguaçu - RJ e estou cursando engenharia de software, além do curso programador full-stack em andamento."
};

function atualizarStatus(mensagem) {
    if (gameStatus) {
        gameStatus.textContent = mensagem;
    }
}

function verificarVencedor(jogador) {
    return combinacoesVencedoras.some((combinacao) => {
        return combinacao.every((indice) => tabuleiro[indice] === jogador);
    });
}

function verificarEmpate() {
    return tabuleiro.every((casa) => casa !== "");
}

function encerrarJogo(mensagem) {
    jogoAtivo = false;
    atualizarStatus(mensagem);
    gameCells.forEach((cell) => {
        cell.disabled = true;
    });
}

function jogadaComputador() {
    if (!jogoAtivo) {
        return;
    }

    const casasDisponiveis = tabuleiro
        .map((valor, indice) => (valor === "" ? indice : null))
        .filter((indice) => indice !== null);

    if (casasDisponiveis.length === 0) {
        return;
    }

    const indiceEscolhido = casasDisponiveis[Math.floor(Math.random() * casasDisponiveis.length)];
    tabuleiro[indiceEscolhido] = "O";
    const cell = document.querySelector(`.game-cell[data-index="${indiceEscolhido}"]`);

    if (cell) {
        cell.textContent = "O";
        cell.disabled = true;
    }

    if (verificarVencedor("O")) {
        encerrarJogo("A máquina venceu esta partida. Tente novamente.");
        return;
    }

    if (verificarEmpate()) {
        encerrarJogo("Empate! Quer jogar outra rodada?");
        return;
    }

    jogadorAtual = "X";
    atualizarStatus("Sua vez: escolha outra casa.");
}

function fazerJogada(indice) {
    if (!jogoAtivo || tabuleiro[indice] !== "") {
        return;
    }

    tabuleiro[indice] = "X";
    const cell = document.querySelector(`.game-cell[data-index="${indice}"]`);

    if (cell) {
        cell.textContent = "X";
        cell.disabled = true;
    }

    if (verificarVencedor("X")) {
        encerrarJogo("Você venceu! Boa leitura e boa partida.");
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 } });
        return;
    }

    if (verificarEmpate()) {
        encerrarJogo("Empate! Tente outra vez.");
        return;
    }

    jogadorAtual = "O";
    atualizarStatus("Agora é a vez da máquina...");
    setTimeout(jogadaComputador, 350);
}

function reiniciarJogo() {
    tabuleiro = Array(9).fill("");
    jogoAtivo = true;
    jogadorAtual = "X";

    gameCells.forEach((cell) => {
        cell.textContent = "";
        cell.disabled = false;
    });

    atualizarStatus("Você começa. Escolha uma casa.");
}

function abrirJogo() {
    if (!gameWidget) {
        return;
    }

    gameWidget.hidden = false;
    if (!jogoAtivo) {
        reiniciarJogo();
    }
}

function fecharJogo() {
    if (gameWidget) {
        gameWidget.hidden = true;
    }
}

if (gameToggleBtn) {
    gameToggleBtn.addEventListener("click", abrirJogo);
}

if (gameClose) {
    gameClose.addEventListener("click", fecharJogo);
}

if (gameRestart) {
    gameRestart.addEventListener("click", reiniciarJogo);
}

if (gameCells.length > 0) {
    gameCells.forEach((cell) => {
        cell.addEventListener("click", () => {
            const indice = Number(cell.dataset.index);
            fazerJogada(indice);
        });
    });
}

function adicionarMensagem(texto, tipo) {
    if (!chatBody) {
        return;
    }

    const mensagem = document.createElement("div");
    mensagem.className = `chat-message ${tipo}`;
    mensagem.textContent = texto;
    chatBody.appendChild(mensagem);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function abrirChat() {
    if (!chatPanel || !chatLauncher) {
        return;
    }

    chatPanel.hidden = false;
    chatLauncher.setAttribute("aria-expanded", "true");

    if (!chatBody || chatBody.childElementCount === 0) {
        adicionarMensagem("Olá! Sou o Atendente Virtual. Clique em uma das perguntas abaixo para saber mais sobre o currículo.", "bot");
    }
}

function fecharChat() {
    if (!chatPanel || !chatLauncher) {
        return;
    }

    chatPanel.hidden = true;
    chatLauncher.setAttribute("aria-expanded", "false");
}

if (chatLauncher && chatPanel) {
    chatLauncher.addEventListener("click", () => {
        if (chatPanel.hidden) {
            abrirChat();
        } else {
            fecharChat();
        }
    });
}

if (chatClose) {
    chatClose.addEventListener("click", fecharChat);
}

if (chatQuestions.length > 0) {
    chatQuestions.forEach((button) => {
        button.addEventListener("click", () => {
            const pergunta = button.textContent || "";
            const chaveResposta = button.dataset.answer;
            const resposta = chaveResposta ? respostasChat[chaveResposta] : "";

            adicionarMensagem(pergunta, "user");
            adicionarMensagem(resposta, "bot");

            if (chatPanel && chatPanel.hidden) {
                abrirChat();
            }
        });
    });
}

if (avaliacaoForm) {
    avaliacaoForm.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const nome = document.getElementById("avaliacao-nome").value.trim();
        const nota = document.getElementById("avaliacao-nota").value;
        const mensagem = document.getElementById("avaliacao-mensagem").value.trim();
        const telefoneWhatsApp = "5521981754922";
        const texto = `Olá, meu nome é ${nome}.\n\nAvaliação do site: ${nota}/5\n\nMensagem: ${mensagem}`;
        const urlWhatsApp = `https://wa.me/${telefoneWhatsApp}?text=${encodeURIComponent(texto)}`;

        window.open(urlWhatsApp, "_blank", "noopener,noreferrer");
        avaliacaoForm.reset();
    });
}
