let correspondencias = [];
let idEditar = 0;

function loadPage() {
    document.getElementById('correspondenciaForm').hidden = true;
    document.getElementById('correspondenciasPainel').hidden = false;
    atualizaLista();
}

function abrirForm() {
    document.getElementById('correspondenciaForm').hidden = false;
    document.getElementById('correspondenciasPainel').hidden = true;
}

function fecharForm() {
    document.getElementById('correspondenciaForm').hidden = true;
    document.getElementById('correspondenciasPainel').hidden = false;
}

function salvarCorrespondencia() {
    if(idEditar != 0){
        const correspondencia = {
            id: idEditar,
            remetente: document.getElementById('remetente').value,
            destinatario: document.getElementById('destinatario').value,
            conteudo: document.getElementById('conteudo').value
        };  

        putCorrespondencia(correspondencia);
    }
    else {
        const novaCorrespondencia = {
            remetente: document.getElementById('remetente').value,
            destinatario: document.getElementById('destinatario').value,
            conteudo: document.getElementById('conteudo').value
        };  
    
        postCorrespondencia(novaCorrespondencia);
    }
}

function postCorrespondencia(correspondencia) {
  const formData = new FormData();
  formData.append('remetente', correspondencia.remetente);
  formData.append('destinatario', correspondencia.destinatario);
  formData.append('conteudo', correspondencia.conteudo);

  let url = 'http://127.0.0.1:5000/correspondencia';
  fetch(url, {
    method: 'post',
    body: formData
  })
  .then((response) => {
    if(response.ok){
        atualizaLista();
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function atualizaLista() {
  let url = 'http://127.0.0.1:5000/correspondencias';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      if(data != undefined) {
          correspondencias = data.correspondencias;
          popularLista();
          fecharForm();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function filtrarLista(destinatario) {
  let url = 'http://127.0.0.1:5000/correspondencias/filtro?destinatario=' + destinatario;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      if(data != undefined) {
          correspondencias = data.correspondencias;
          popularLista();
          fecharForm();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function popularLista(){
  const lista = document.getElementById('listaCorrespondencia');
  lista.innerHTML = '';

  correspondencias.forEach((correspondencia) => {
      const item = document.createElement('div');
      item.classList.add('correspondencia-item');
      
      item.innerHTML = `
        <img src="./images/mail_fluent_Icon.svg" width="128" height="128" class="imagem-correspondencia" alt="Imagem Correspondência">
        <div class="correspondencia-textos">
            <p><strong>Remetente:</strong> ${correspondencia.remetente}</p>
            <p><strong>Destinatário:</strong> ${correspondencia.destinatario}</p>
            <p><strong>Conteúdo:</strong> ${correspondencia.conteudo}</p>
            <p><strong>Data:</strong> ${new Date(correspondencia.dataEntrada).toLocaleDateString()} ${new Date(correspondencia.dataEntrada).toLocaleTimeString()}</p>
        </div>
        <button onclick="removerCorrespondencia(${correspondencia.id})">Remover</button>
      `;
      lista.appendChild(item);
  });
}

function removerCorrespondencia(id) {
  let url = 'http://127.0.0.1:5000/correspondencia?id=' + id;

  if (confirm("Tem certeza que deseja remover esta correspondência?")) {
      fetch(url, {
      method: 'delete'
      })
      .then((response) => {
          if(response.ok){
              atualizaLista();
          }
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }
}