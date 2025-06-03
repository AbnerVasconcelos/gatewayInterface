import { db } from '../firebase/config'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth';

import {useState, useEffect} from 'react';

export const useAuthentication = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)
    //cleanup
    //deal with memory leak
    const [cancelled, setCancelled] = useState(false)
    const auth = getAuth();

    function checkIfIsCancelled(){
        if(cancelled){
            return;
        }
    }

    const createUser = async (data) => {       //passando dados para o firebase
        checkIfIsCancelled()//cleanUP
        setLoading(true)
        setError(null)

        try {
            const {user} = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            )
            await updateProfile(user,{displayName: data.displayName})// atualização para passar nome
            setLoading(false) //acabou a função, acaba o loading
            return user

        } catch (error) {
            console.log(error.message)
            console.log(typeof error.message)
            let systemErrorMessage

            if(error.message.includes("Password")){
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
            } else if (error.message.includes("email-already")){
                systemErrorMessage = "E-mail já cadastrado";
            }else if(error.message.includes("invalid-email")){ 
                systemErrorMessage = "O email é invalido";
            }else{
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde";
            }
            setLoading(false) //acabou a função, acaba o loading
            setError(systemErrorMessage)
        }
    }
//logout - sign out

    const logout = () =>{
        checkIfIsCancelled()
        signOut(auth)
    }
//Login - sign in
    const login = async(data) =>{
        checkIfIsCancelled()
        setLoading(true)
        setError(false)

        try{
            await signInWithEmailAndPassword(auth,data.email, data.password)
            setLoading(false) //acabou a função, acaba o loading

        }catch(error){
            let systemErrorMessage

            if(error.message.includes("user-not-found")){
                systemErrorMessage = "Usuário não encontrado";
            } else if (error.message.includes("wrong-password")){
                systemErrorMessage = "E-mail já cadastrado";
            } else{ 
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde";
            }
            setError(systemErrorMessage); //Passa o erro para o componente
            setLoading(false); //acabou a função, acaba o loading


        }

    }


    useEffect(() =>{ // executado seta cancelado como true, resolve problema de memória 
        return () => setCancelled(true)
    },[])



    return{
        auth,
        createUser,
        error,
        loading,
        logout,
        login,
    };
};

