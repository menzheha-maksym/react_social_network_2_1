import React, { useState } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to log out')
        }
    }


    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Dashboard</h2>
                    <h3 className="text-center text-danger mb-4">In development</h3>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email:</strong> {currentUser.email}
                    <Link to={`${currentUser.displayName}/profile`} className="btn btn-primary w-100 mt-3">Profile</Link>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>Log out</Button>
            </div>
        </>
    )
}
