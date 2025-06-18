<template>
  <div class="login-container">
    <div class="login-card">
      <h1>MicroTarefas</h1>
      <h2>Bem-vindo</h2>
      <p>Entre com seu e-mail e senha</p>

      <div class="input-group">
        <label for="email">E-mail</label>
        <input v-model="email" type="email" id="email" placeholder="Digite seu e-mail" />
      </div>

      <div class="input-group">
        <label for="senha">Senha</label>
        <input v-model="senha" type="password" id="senha" placeholder="Digite sua senha" />
      </div>

      <button @click="fazerLogin">Entrar</button>

      <p class="link">
        Não tem conta?
        <router-link to="/cadastro">Cadastre-se aqui</router-link>
      </p>

      <p v-if="erro" class="error">{{ erro }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      senha: '',
      erro: ''
    };
  },
  methods: {
    async fazerLogin() {
      this.erro = '';

      if (!this.email || !this.senha) {
        this.erro = 'Preencha todos os campos';
        return;
      }

      try {
        const resposta = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            senha: this.senha
          })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
          localStorage.setItem('token', dados.token);
          this.$router.push('/tarefas');
        } else {
          this.erro = dados.error || 'Erro ao fazer login';
        }
      } catch (error) {
        this.erro = 'Erro ao conectar com o servidor';
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
}

.login-card {
  background-color: #1c1c1e;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
}

.login-card h1 {
  margin-bottom: 8px;
  font-size: 2rem;
  color: #4caf50;
}

.login-card h2 {
  margin-bottom: 8px;
  font-weight: 600;
}

.login-card p {
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

.link {
  margin-top: 16px;
  color: #bbb;
}

.link a {
  color: #4caf50;
  text-decoration: none;
  font-weight: 600;
}

.link a:hover {
  text-decoration: underline;
}

.error {
  color: crimson;
  margin-top: 12px;
}
</style>
