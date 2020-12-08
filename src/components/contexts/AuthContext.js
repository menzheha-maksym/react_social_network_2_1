import React, { useContext, useState, useEffect } from 'react'
import { auth }  from '../../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    function loadProfilePicture(profilePicture) {
        console.log(currentUser.photoURL);
        profilePicture = currentUser.photoURL;
        console.log(profilePicture);
        return profilePicture;
 
    }

    function updateProfilePicture(profilePicture) {
        currentUser.updateProfile({ photoURL: profilePicture});
        console.log("Photo in Database uploaded " + currentUser.photoURL);
        console.log("currentUser.photoUrl updated")
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    
    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        loadProfilePicture,
        updateProfilePicture,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
