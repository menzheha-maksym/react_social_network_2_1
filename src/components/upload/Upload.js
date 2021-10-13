import React, { useRef, useState, useEffect } from 'react'
import { Button, Card, Alert, Form } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import firebase from '../../firebase'

const Upload = () => {

    const descriptionRef = useRef();

    const { currentUser } = useAuth()
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [postId, setPostId] = useState(null);
    const [postNum, setPostNum] = useState(null);
    const [error, setError] = useState("")

    const history = useHistory();

    const handleSubmit = () => {}
    
    const handleChange = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
        console.log(preview);
    }

    const handleUpload = () => {
        if (preview) {
            firebase.storage().ref(`users/` + currentUser.uid + `/posts/${postId}.jpg`).put(file).then(function () {
                console.log('successfully uploaded to firebase');
                setError("");
            })
            firebase.database().ref('users/' + currentUser.uid + '/posts').child(postId).set({
                description: descriptionRef.current.value
            })
            firebase.database().ref('users/' + currentUser.uid + '/posts').update({
                "posts_num": postNum,
                "postIdNum": postNum
            })
            history.push(`${currentUser.displayName}/profile`);
        } else {
            setError("Select an image before uploading")
        }
    }

    useEffect(() => {
        firebase.database().ref('users/' + currentUser.uid + '/posts').once('value', (snapshot) => {
            setPostNum(snapshot.val().postIdNum + 1);     
            setPostId("post" + snapshot.val().postIdNum);
        }) 
    }, []) 

    return (
        <>
            <Card>
                <h1 className="text-center mt-2 mb-2">Upload Image</h1>
            </Card>
            <Card>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="post-image">
                        <Form.Label>Select Image</Form.Label>
                        <div>
                            <input type="file" accept="image/*" onChange={handleChange} />
                        </div>
                        <div className="profile mt-3">
                            <img
                                id="output"
                                src={preview || "http://via.placeholder.com/300"}
                                className="rounded mb-2 mx-auto d-block"
                                width="320px"
                                height="180px"
                                alt="profilePic"
                            />

                        </div>
                        <div className="mx-3">
                            <textarea id="description" className="w-100 mt-2" placeholder="Description" ref={descriptionRef}></textarea><br />
                        </div>
                        <div>
                            <Button className="mt-2 w-100" onClick={handleUpload}>Upload post</Button>
                        </div>
                    </Form.Group>
                </Form>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to={`${currentUser.displayName}/profile`}>Back to profile</Link>
            </div>
        </>
    )
}

export default Upload


