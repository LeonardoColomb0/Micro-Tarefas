<template>
  <div class="register-container">
    <div class="register-card">
      <h1>MicroTarefas</h1>
      <h2>Crie sua conta</h2>
      <p>Preencha seus dados abaixo</p>

      <div class="input-group">
        <label for="email">E-mail</label>
        <input v-model="email" type="email" id="email" placeholder="Digite seu e-mail" />
      </div>

      <div class="input-group">
        <label for="senha">Senha</label>
        <input v-model="senha" type="password" id="senha" placeholder="Digite sua senha" />
      </div>

      <div class="input-group">
        <label for="confirmaSenha">Confirme a senha</label>
        <input v-model="confirmaSenha" type="password" id="confirmaSenha" placeholder="Confirme sua senha" />
      </div>

      <button @click="fazerCadastro">Cadastrar</button>

      <p class="link">
        Já tem conta?
        <router-link to="/login">Faça login aqui</router-link>
      </p>

      <p v-if="erro" class="error">{{ erro }}</p>
      <p v-if="sucesso" class="success">{{ sucesso }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      senha: '',
      confirmaSenha: '',
      erro: '',
      sucesso: ''
    };
  },
  methods: {
    async fazerCadastro() {
      this.erro = '';
      this.sucesso = '';

      if (!this.email || !this.senha || !this.confirmaSenha) {
        this.erro = 'Preencha todos os campos';
        return;
      }

      if (this.senha !== this.confirmaSenha) {
        this.erro = 'As senhas não coincidem';
        return;
      }

      try {
        const resposta = await fetch('http://localhost:3000/auth/register', {
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
          this.sucesso = dados.message || 'Cadastro realizado com sucesso!';
          this.email = '';
          this.senha = '';
          this.confirmaSenha = '';
        } else {
          this.erro = dados.error || 'Erro ao cadastrar';
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

.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
}

.register-card {
  background-color: #1c1c1e;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
}

.register-card h1 {
  margin-bottom: 8px;
  font-size: 2rem;
  color: #4caf50;
}

.register-card h2 {
  margin-bottom: 8px;
  font-weight: 600;
}

.register-card p {
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

.success {
  color: #4caf50;
  margin-top: 12px;
  font-weight: 600;
}
</style>
