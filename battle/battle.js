/* ===== battle.js — lógica do puzzle 2v2 ===== */
const state = {
  trickUsed: false,
  transformed: false,
  finished: false
};

const CONFIG = {
  rewardImgur: 'https://i.imgur.com/IMGUR_ID_AQUI.png',
  senha: 'iniciacao'
};

const logEl = document.getElementById('log');
const $ = id => document.getElementById(id);
const btnTrick = $('btnTrick');
const btnTreInd = $('btnTransformIndeedee');
const btnTreHat = $('btnTransformHatterene');
const btnDazzling = $('btnDazzling');
const resultEl = $('result');
const defeatedEl = $('defeated');
const erroSenha = $('erroSenha');

function log(msg) {
  logEl.textContent += '\n>>> ' + msg;
  logEl.scrollTop = logEl.scrollHeight;
}

function hpOff(elId) {
  const el = $(elId);
  if (el) el.classList.add('damage');
}

function win() {
  if (state.finished) return;
  state.finished = true;
  log('Ditto, com a velocidade extra do Choice Scarf, ataca primeiro com Dazzling Gleam.');
  log('Indeedee adversário desmaiou. Hatterene não resistiu ao golpe Fada.');
  log('VITÓRIA. Os dois adversários foram derrotados em um único turno.');
  hpOff('hp-o1');
  hpOff('hp-o2');
  [btnTrick, btnTreInd, btnTreHat, btnDazzling].forEach(b => (b.disabled = true));
  const link = $('rewardLink');
  link.href = CONFIG.rewardImgur;
  link.textContent = CONFIG.rewardImgur;
  resultEl.classList.add('show');
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function defeat(reason) {
  if (state.finished) return;
  state.finished = true;
  log('DERROTA: ' + reason);
  [btnTrick, btnTreInd, btnTreHat, btnDazzling].forEach(b => (b.disabled = true));
  defeatedEl.classList.add('show');
}

btnTrick.addEventListener('click', () => {
  if (state.trickUsed || state.finished) return;
  state.trickUsed = true;
  log('Indeedee usa Trick e passa o Choice Scarf para Ditto. Ditto agora é mais rápido que os dois adversários.');
  btnTrick.disabled = true;
  btnTreInd.disabled = false;
  btnTreHat.disabled = false;
  btnDazzling.disabled = false;
  log('Agora escolha em quem Ditto deve se transformar, e depois atacar.');
});

btnTreInd.addEventListener('click', () => {
  if (!state.trickUsed || state.transformed || state.finished) return;
  state.transformed = true;
  log('Ditto se transforma em Indeedee (M). Agora a velocidade do Choice Scarf garante o primeiro golpe.');
  btnTreInd.disabled = true;
  btnTreHat.disabled = true;
  btnDazzling.focus();
});

btnTreHat.addEventListener('click', () => {
  if (!state.trickUsed || state.transformed || state.finished) return;
  defeat('Ditto se transformou em Hatterene, mas Magic Bounce reflete o golpe. A tentativa falhou.');
});

btnDazzling.addEventListener('click', () => {
  if (!state.trickUsed || state.finished) {
    defeat('Sem o Choice Scarf, Ditto não ataca com velocidade suficiente e a vitória escapa.');
    return;
  }
  if (!state.transformed) {
    defeat('Ditto atacou sem se transformar em Indeedee. O dano não foi suficiente.');
    return;
  }
  win();
});

$('btnSenha').addEventListener('click', verificarSenha);
$('senha').addEventListener('keydown', e => {
  if (e.key === 'Enter') verificarSenha();
});

function verificarSenha() {
  const v = $('senha').value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (v === CONFIG.senha) {
    erroSenha.classList.add('hidden');
    log('Senha aceita. Próxima etapa liberada.');
    window.location.href = 'senha.html?p=2';
  } else {
    erroSenha.classList.remove('hidden');
  }
}

$('btnRetry').addEventListener('click', () => location.reload());
