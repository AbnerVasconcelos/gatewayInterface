
import { useAuthentication } from '../../hooks/useAuthentication'
import styles from './Register.module.css'
import React, { useEffect, useState } from 'react'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] =useState('')
  const [confirmPassword, setconfirmPasswod] = useState('')
  const [error, setError] = useState('')
  const {createUser, error: authError, loading} = useAuthentication();//desconstroi o objeto
  
  
const handleSubmit = async (e) =>{
  e.preventDefault();
  setError('');
  const user = {   ///grava vaiáveis do usuário
    name,
    email,
    password
  }

  if(password !== confirmPassword){
    setError("As senhas precisam ser iguais!")
    return
  }
  const res = await createUser(user)
  console.log(user);
}
useEffect(()=>{if(authError){setError(authError);}},[authError]);

  return (
    <div className={styles.register}>
      <h1>Cadastre-se</h1>
      <p>Crie seu usuáio e compartilhe suas histórias</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nome:</span>
          <input 
          type= 'text'
          name='displayName'
          required
          placeholder='Nome do usuário'
          value={name}
          onChange={(e)=> setName(e.target.value)}
          />
        </label>

        <label>
          <span>E-mail:</span>
          <input 
          type= 'e-mail'
          name='e-mail'
          required
          placeholder='E-mail do usuário'
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>Senha:</span>
          <input 
          type= 'password'
          name='password'
          required
          placeholder='insira sua senha'
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          />
        </label>
        <label>
          <span>Confirmação de senha:</span>
          <input 
          type= 'password'
          name='confirmpassword'
          required
          placeholder='Confime sua senha'
          value={confirmPassword}
          onChange={(e)=> setconfirmPasswod(e.target.value)}
          />
        </label>
        {!loading && <button  className='btn'>Cadastrar</button>}
        {loading && (
          <button className='btn' disabled>Aguarde ...</button>
        )}
        {error && <p className='error'>{error}</p>}
      </form>
    </div>
  )
}

export default Register