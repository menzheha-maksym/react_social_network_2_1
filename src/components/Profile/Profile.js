import React, { useState, useEffect } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import firebase from '../../firebase'

export default function Profile() {

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    const [profilePicture, setProfilePicture] = useState(currentUser.photoURL);
    const [username, setUsername] = useState(null);

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to log out')
        }
    }



    useEffect(() => {
        // load profile picture
        if (profilePicture) {
            firebase.storage().ref('users/' + currentUser.uid + '/profile.jpg').getDownloadURL().then(url => {
                setProfilePicture(url);
            })
        }

        firebase.database().ref('users/' + currentUser.uid).once('value').then((snapshot) => {
            setUsername(snapshot.val() && snapshot.val().username);
        })

    })


    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <div className="profile mr-3">
                        <img
                            src={profilePicture || "http://via.placeholder.com/300"}
                            className="rounded mb-2 mx-auto d-block"
                            width="200px"
                            height="150px"
                            alt="avatar"
                        />
                    </div>
                    <div className="mt-2 mb-3">
                        <strong>Username: </strong> {username}
                    </div>
                    <strong>Email:</strong> {currentUser.email}
                    <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Update Profile</Link>
                    <Link to="/search-users" className="btn btn-primary w-100 mt-3">Search Users</Link>
                    {/* <Link to="/dialogs" className="btn btn-primary w-100 mt-3">Dialogs</Link> */}
                    <Link to="/upload" className="btn btn-primary w-100 mt-3">Upload</Link>
                    {/* <Button className="w-100 mt-3">Upload</Button> */}
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>Log out</Button>
            </div>
        </>
    )
}
