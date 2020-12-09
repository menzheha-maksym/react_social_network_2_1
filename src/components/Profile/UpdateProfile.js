import React, { useRef, useState, useEffect } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import firebase from '../../firebase'

export default function UpdateProfile() {
    const usernameRef = useRef(); // Can't perform a React state update 
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, updatePassword, updateEmail, updateUsername, checkIfUsernameExists, /* loadProfilePicture, */ updateProfilePicture } = useAuth()
    const [error, setError] = useState("")
    const [ success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    const [profilePicture, setProfilePicture] = useState(null);
    const [file, setFile] = useState(null);

    function handleSubmit(e) {
        e.preventDefault()
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        const promises = []
        setLoading(true)
        setError("")

        if (usernameRef.current.value !== currentUser.displayName) {
            
            checkIfUsernameExists(usernameRef.current.value).then((exist) => {
                if(exist) {
                    setError("username already exist");
                } else {
                    promises.push(updateUsername(usernameRef.current.value))
                    setSuccess("Successfull updated username")
                }
            })
        }

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises)
            .then(() => {
                //history.push('/profile')
            })
            .catch(() => {
                setError('Failed to update Account')
            })
            .finally(() => {
                setLoading(false)
            })

    }

    const handleChange = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setProfilePicture(URL.createObjectURL(e.target.files[0]));
        }
    }

    const handleUpload = () => {
        console.log(file);
        if (file === null) {
            setError("No file selected");
        } else {
            firebase.storage().ref('users/' + currentUser.uid + '/profile.jpg').put(file).then(function () {
                console.log('successfully uploaded to firebase');
                updateProfilePicture('users/' + currentUser.uid + '/profile.jpg');
                setError("");
            })
        }
    }
    //console.log(currentUser)

    useEffect(() => {

        if (currentUser.photoURL) {
            firebase.storage().ref('users/' + currentUser.uid + '/profile.jpg').getDownloadURL().then(url => {
                setProfilePicture(url);
                //console.log('successfully loaded profile picture')
            })
        } else {
            return;
        }


    }, [currentUser.photoURL, currentUser.uid]) // loadProfilePicture



    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="profilePicture">
                            <Form.Label>Select Profile Picture</Form.Label>
                            <input type="file" accept="image/*" onChange={handleChange} />
                            <div className="profile mt-3">
                                <img
                                    id="output"
                                    src={profilePicture || "http://via.placeholder.com/300"}
                                    className="rounded mb-2 mx-auto d-block"
                                    width="200px"
                                    height="150px"
                                    alt="profilePic"
                                />
                                <Button className="mt-2" onClick={handleUpload}>Update Profile Picture</Button>
                            </div>
                        </Form.Group>

                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="username"
                                ref={usernameRef}
                                required
                                defaultValue={currentUser.displayName}
                            />
                        </Form.Group>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                ref={emailRef}
                                required
                                defaultValue={currentUser.email}
                            />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                ref={passwordRef}
                                placeholder="Leave blank to keep the same"
                            />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control
                                type="password"
                                ref={passwordConfirmRef}
                                placeholder="Leave blank to keep the same"
                            />
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">Update</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/profile">Back to profile</Link>
            </div>
        </>
    )
}
