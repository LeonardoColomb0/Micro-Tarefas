<template>
  <div class="tarefas-container">
    <div class="tarefas-card">
      <h1>MicroTarefas</h1>
      <h2>Suas Tarefas</h2>
      <p>Organize suas atividades abaixo</p>

      <!-- Formulário de Nova Tarefa (mesmo layout) -->
      <div class="input-group">
        <label>Descrição da tarefa</label>
        <input v-model="novaTarefa" type="text" placeholder="Digite a tarefa" />
      </div>

      <div class="input-group">
        <label>Data</label>
        <input v-model="dataTarefa" type="date" />
      </div>

      <div class="input-group">
        <label>Hora</label>
        <input v-model="horaTarefa" type="time" />
      </div>

      <button @click="adicionarTarefa">Adicionar Tarefa</button>

      <!-- Lista de tarefas existentes -->
      <ul class="lista-tarefas">
        <li v-for="tarefa in tarefas" :key="tarefa.id">
          <div class="tarefa-info">
            <input v-model="tarefa.texto" />
            <input type="date" v-model="tarefa.data" />
            <input type="time" v-model="tarefa.hora" />
          </div>
          <div class="botoes">
            <button @click="atualizarTarefa(tarefa)">Salvar</button>
            <button class="remove" @click="removerTarefa(tarefa.id)">Remover</button>
          </div>
        </li>
      </ul>

      <button class="logout" @click="fazerLogout">Sair</button>

      <p v-if="erro" class="error">{{ erro }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tarefas: [],
      novaTarefa: '',
      dataTarefa: '',
      horaTarefa: '',
      erro: ''
    };
  },
  methods: {
    async carregarTarefas() {
      this.erro = '';
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        const resposta = await fetch('http://localhost:3000/tarefas', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });

        const dados = await resposta.json();

        if (resposta.ok) {
          this.tarefas = dados;
        } else {
          this.erro = dados.error || 'Erro ao carregar tarefas';
          if (resposta.status === 401 || resposta.status === 403) {
            this.fazerLogout();
          }
        }
      } catch (error) {
        this.erro = 'Erro de conexão';
      }
    },

    async adicionarTarefa() {
      this.erro = '';
      if (!this.novaTarefa) {
        this.erro = 'Digite a descrição da tarefa';
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const resposta = await fetch('http://localhost:3000/tarefas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
          body: JSON.stringify({
            texto: this.novaTarefa,
            data: this.dataTarefa,
            hora: this.horaTarefa
          })
        });

        const dados = await resposta.json();

        console.log('Resposta do backend (add):', dados);

        if (resposta.ok) {
          this.novaTarefa = '';
          this.dataTarefa = '';
          this.horaTarefa = '';
          this.carregarTarefas();
        } else {
          this.erro = dados.error || 'Erro ao adicionar tarefa';
        }
      } catch (error) {
        console.error(error);
        this.erro = 'Erro de conexão';
      }
    },

    async atualizarTarefa(tarefa) {
      try {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`http://localhost:3000/tarefas/${tarefa.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
          body: JSON.stringify({
            texto: tarefa.texto,
            data: tarefa.data,
            hora: tarefa.hora
          })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
          this.erro = dados.error || 'Erro ao atualizar';
        } else {
          this.erro = '';
        }
      } catch (error) {
        this.erro = 'Erro de conexão';
      }
    },

    async removerTarefa(id) {
      try {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`http://localhost:3000/tarefas/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + token
          }
        });

        if (resposta.ok) {
          this.tarefas = this.tarefas.filter(t => t.id !== id);
        } else {
          const dados = await resposta.json();
          this.erro = dados.error || 'Erro ao remover';
        }
      } catch (error) {
        this.erro = 'Erro de conexão';
      }
    },

    fazerLogout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  },

  mounted() {
    this.carregarTarefas();
  }
};
</script>

<style scoped>
/* Seu CSS continua igual, mantendo o layout */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

* {
  box-sizing: border-box;
}

.tarefas-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
}

.tarefas-card {
  background-color: #1c1c1e;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
}

.tarefas-card h1 {
  margin-bottom: 8px;
  font-size: 2rem;
  color: #4caf50;
}

.tarefas-card h2 {
  margin-bottom: 8px;
  font-weight: 600;
}

.tarefas-card p {
  margin-bottom: 24px;
  font-size: 0.95rem;
  color: #ccc;
}

.input-group {
  text-align: left;
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #aaa;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #444;
  background-color: #121212;
  color: #eee;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  border-color: #4caf50;
  outline: none;
  background-color: #1f1f1f;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3e8e41;
}

.lista-tarefas {
  list-style: none;
  padding: 0;
  margin-top: 24px;
}

.lista-tarefas li {
  background-color: #2a2a2e;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.tarefa-info {
  flex: 1;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tarefa-info input {
  flex: 1;
  min-width: 100px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #121212;
  color: #eee;
  font-size: 1rem;
}

.tarefa-info input:focus {
  border-color: #4caf50;
  outline: none;
}

.botoes {
  display: flex;
  gap: 8px;
}

.botoes button {
  background-color: #4caf50;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.botoes .remove {
  background-color: crimson;
}

.botoes .remove:hover {
  background-color: darkred;
}

button.logout {
  background-color: crimson;
  margin-top: 16px;
}

button.logout:hover {
  background-color: darkred;
}

.error {
  color: crimson;
  margin-top: 12px;
}
</style>
