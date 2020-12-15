import React, { useContext, useState, useEffect } from 'react'
import firebase, { auth } from '../../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(username, email, password) {
        return auth.createUserWithEmailAndPassword(email, password).then((obj) => {
            firebase.database().ref('users/').child(obj.user.uid).set({
                email: email,
                name: username,
                photoURL: "http://via.placeholder.com/300", 
                username: username          
            }).then(() => {
                obj.user.updateProfile({
                    displayName: username
                })
            })
            // add new username to usernames list
            let newUsername = {}
            newUsername[username] = obj.user.uid;
            firebase.database().ref('usernames/').update(newUsername);
        }).catch((error) => {
            console.log(error.message);
        })

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
        profilePicture = currentUser.photoURL;
        return profilePicture;
    }

    function updateProfilePicture(profilePicture) {
        currentUser.updateProfile({ photoURL: profilePicture });
        firebase.database().ref('users/').child(currentUser.uid).update({
            "photoURL": profilePicture
        });
        console.log("Photo in Database uploaded " + currentUser.photoURL);
    }

    function updateUsername(username) {
        let oldUsername = currentUser.displayName;

        // add new username to usernames list
        let newUsername = {}
        newUsername[username] = currentUser.uid;
        firebase.database().ref('usernames/').update(newUsername);

        //add new username to users list
        firebase.database().ref('users/').child(currentUser.uid).update({
            "name": username,
            "username": username,
        });
        currentUser.updateProfile({ displayName: username });

        // remove old username
        firebase.database().ref(`usernames/${oldUsername}`).remove()
    }

    async function checkIfUsernameExists(username) {
        var result = false;

        await firebase.database().ref(`usernames/${username}`).once("value", (snapshot) => {
            if (snapshot.val()) {
                result = true;
                return result;
            }
        })
        return result;
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
        updateUsername,
        checkIfUsernameExists,
        loadProfilePicture,
        updateProfilePicture,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
