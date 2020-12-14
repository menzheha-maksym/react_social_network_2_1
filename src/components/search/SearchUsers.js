import React, { useRef, useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import firebase from '../../firebase';
import Results from './Results';

export default function SearchUsers() {

    const usernameRef = useRef();
    const [loading, setLoading] = useState("");
    const { currentUser } = useAuth()
    const [foundUser_username, setFoundUser_username] = useState(null);
    const [foundUser_uid, setFoundUser_uid] = useState(null);
    const [foundUser_email, setFoundUser_email] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);


    function handleSearch(e) {
        e.preventDefault();

        setLoading(true)
        setError('');

        if (usernameRef.current.value) {
            firebase.database().ref(`usernames/${usernameRef.current.value}`).once("value", (snapshot) => {
                if (snapshot.val()) {
                    setError('');
                    //console.log("user found");
                    setFoundUser_uid(snapshot.val());
                } else {
                    setError("user not found");
                    //console.log("user not found");
                    setFoundUser_uid(null);
                }
            })
        }
    }

    function checkNotNull(obj) {
        for (var key in obj) {
            if (obj[key] === null) {
                return false;
            }
        }
        return true;
    }

    useEffect(() => {

        if (foundUser_uid) {
            firebase.storage().ref('users/' + foundUser_uid + '/profile.jpg').getDownloadURL().then(url => {
                setProfilePicture(url);
            })
            firebase.database().ref('users/' + foundUser_uid).once('value').then((snapshot) => {
                setFoundUser_username(snapshot.val().username);
                setFoundUser_email(snapshot.val().email);
            })

            let value = {
                profile_pic: profilePicture,
                username: foundUser_username,
                email: foundUser_email,
            }

            if (checkNotNull(value)) {
                setData([{
                    profile_pic: profilePicture,
                    username: foundUser_username,
                    email: foundUser_email
                }]);
            }
        }
        setLoading(false);

    }, [foundUser_uid, foundUser_email, foundUser_username, loading, profilePicture])

    return (
        <>
            <div>
                <h1>search</h1>
            </div>
            <Card>
                <Card.Body>
                    <Form.Group id="search">
                        <Form.Label>Enter username to search</Form.Label>
                        <Form.Control
                            type="username"
                            ref={usernameRef}
                            required
                            placeholder="Enter username here"
                        />
                        <Button disabled={loading} onClick={handleSearch}>SEARCH</Button>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <div className="w-100 text-center mt-2">
                            <Link to={`${currentUser.displayName}/profile`}>Back to profile</Link>
                        </div>
                    </Form.Group>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <h1>Results</h1>
                    <Results data={data} />
                </Card.Body>
            </Card>
        </>
    )
}