import {writable} from "svelte/store"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, 
signOut } from "firebase/auth"; 
import{auth} from "../lib/firebase/firebase";

export const authStore = writable({
    user:null,
})
export let dataStore = writable({
    basicinfo:{},
    reportlist:[],
    conversationlist:[],
})
export let extraStore = writable({
    chatcount: 0,
    retrivedresource:false,
    reportcount: 0,
})
export const authHandlers = {
    signup: async (email, pass) => {
    await createUserWithEmailAndPassword (auth, email, pass)
    },
    login: async (email, pass) => {
    await signInWithEmailAndPassword(auth, email, pass)
    },
    logout: async() => {
    await signOut (auth)
    }
}

    