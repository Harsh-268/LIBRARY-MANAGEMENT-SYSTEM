import React, { useContext } from "react";
import { useState } from "react";
import api from "../api/axios";

const AuthContext=React.createContext();


const AuthProvider = ({children}) => {
    const[user,setUser]=useState(null)
    

    const login=async(email,password)=>{
    try {
        const response=await api.post("/users/login",{email,password})
        setUser(response.data.data.user)
        console.log(response.data.data.user)

        return {
            success:true,
            message:"User has been successfully logged in",
            user:response.data.data.user

        }

    } catch (error) {
        return{
            success:false,
            message:"Invalid Credentials"
        }
    }
}
  return (
    <AuthContext.Provider value={{user,setUser,login}}>
     {children}
    </AuthContext.Provider>
  )
}

const useAuth=()=>{
    const context=useContext(AuthContext)
    return context
}

export  {AuthProvider,AuthContext,useAuth}

