import React, { useState } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import firebase from '../../firebase'

export default function Profile() {

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    const [avatar, setAvatar] = useState(undefined);

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to log out')
        }
    }

    function loadAvatar() {
        firebase.storage().ref('users/' + currentUser.uid + '/profile.jpg').getDownloadURL().then(url => {
            setAvatar(url);
            console.log('successfully loaded avatar')
        })
    }

    loadAvatar();


    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <div className="profile mr-3">
                    <img
                        src={avatar || "http://via.placeholder.com/300"}
                        className="rounded mb-2 mx-auto d-block" 
                        width="200px"
                        height="150px"
                        alt="avatar"
                    />
                    </div>
                    <strong>Email:</strong> {currentUser.email}
                    <Link to="update-profile" className="btn btn-primary w-100 mt-3">Update Profile</Link>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>Log out</Button>
            </div>
        </>
    )
}
