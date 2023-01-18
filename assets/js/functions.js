const urlEstados =
  "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";

const selectEstados = document.querySelector("#state");
const selectMunicipios = document.querySelector("#city");

var estados = [];

async function fetchEstados() {
  await fetch(urlEstados)
    .then((resp) => resp.json())
    .then(function (data) {
      let response = data;
      return response.map(function (estado) {
        estados.push({ sigla: estado.sigla, nome: estado.nome });
      });
    });
}

function adicionaOptionsEstado() {
  estados.forEach((estado) => {
    selectEstados.options[selectEstados.options.length] = new Option(
      estado.nome,
      estado.sigla
    );
  });
}

function adicionaOptionsMunicipios(municipios) {
  while (selectMunicipios.length > 0) {
    selectMunicipios.remove(0);
  }
  municipios.forEach((municipio) => {
    selectMunicipios.options[selectMunicipios.options.length] = new Option(
      municipio,
      municipio
    );
  });
}

window.onload = async (event) => {
  await fetchEstados();
  adicionaOptionsEstado();
};

async function fetchMunicipios(option) {
  selectMunicipios.disabled = true;
  const urlMunicipios = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${option}/municipios`;
  var municipios = [];
  await fetch(urlMunicipios)
    .then((resp) => resp.json())
    .then(function (data) {
      let response = data;
      return response.map(function (municipio) {
        municipios.push(municipio.nome);
      });
    });

  adicionaOptionsMunicipios(municipios);
  selectMunicipios.disabled = false;
}

function handleAccept(check) {
  var btnSubmit = document.querySelector("#btn-submit");
  if (check.checked) {
    check.style.backgroundColor = "green";
    btnSubmit.disabled = false;
  } else {
    check.style.backgroundColor = "red";
    btnSubmit.disabled = true;
  }
}

function validaCPF(strCPF) {
  var Soma;
  var Resto;
  Soma = 0;
  strCPF = strCPF.replaceAll(".", "");
  strCPF = strCPF.replaceAll("-", "");
  if (strCPF == "00000000000") return false;

  for (i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}

$("form").submit(function (event) {
  const cpf = document.getElementById("cpf");
  const btnSubmit = document.getElementById("btn-submit");
  btnSubmit.disabled = true;

  if (!validaCPF(cpf.value)) {
    event.preventDefault();
    $("#cpf").focus();
    $("#cpf-error").css({ display: "block" });
    btnSubmit.disabled = false;
  }
});

function handleChange(src) {
  if (src.name == "marital_status") {
    var spouse = document.querySelector("#spouse");
    var spouseName = document.querySelector("#spouse_name");
    var is_spouse_camper_yes = document.querySelector("#is_spouse_camper_yes");
    var is_spouse_camper_no = document.querySelector("#is_spouse_camper_no");
    if (src.value != 1 && src.value != 5) {
      spouse.style.display = "none";
      spouseName.required = false;
      is_spouse_camper_no.required = false;
      is_spouse_camper_yes.required = false;
    } else {
      spouse.style.display = "flex";
      spouseName.required = true;
      is_spouse_camper_no.required = true;
      is_spouse_camper_yes.required = true;
    }
  }
  if (src.name == "is_addicted") {
    var divAddiction = document.querySelector("#div-addiction");
    var addiction = document.querySelector("#addiction")
    if (src.value != 0) {
      divAddiction.style.display = "grid";
      addiction.required = true;
    } else {
      divAddiction.style.display = "none";
      addiction.required = false;
    }
  }
  if (src.name == "has_medical_attention") {
    var divMedical = document.querySelector("#div-medical");
    var medical_attention = document.querySelector("#medical_attention");
    if (src.value != 0) {
      divMedical.style.display = "grid";
      medical_attention.required = true;
    } else {
      divMedical.style.display = "none";
      medical_attention.required = false;
    }
  }
  if (src.name == "is_retreatant") {
    var divRetreat = document.querySelector("#div-retreat");
    var retreat = document.querySelector("#retreat");
    if (src.value != 0) {
      divRetreat.style.display = "grid";
      retreat.required = true;
    } else {
      divRetreat.style.display = "none";
      retreat.required = false;
    }
  }
  if (src.name == "has_familiar_camper") {
    var divParents = document.querySelector("#parents");
    if (src.value != 0) {
      divParents.style.display = "contents";
    } else {
      divParents.style.display = "none";
    }
  }
}

function formatar(mascara, documento) {
  var i = documento.value.length;
  var saida = mascara.substring(0, 1);
  var texto = mascara.substring(i);

  if (isNaN(documento.value[i - 1])) {
    // impede entrar outro caractere que não seja número
    documento.value = documento.value.substring(0, i - 1);
    return;
  }

  if (texto.substring(0, 1) != saida) {
    documento.value += texto.substring(0, 1);
  }
}

$('#cpf').blur(function () {
  if(!validaCPF(this.value)){
      $('#cpf').css({border: "solid 1px red"});
      $('#cpf-error').css({display: "block"});
  }else{
      $('#cpf').css({border: ""});
      $('#cpf-error').css({display: "none"});
  }
})
