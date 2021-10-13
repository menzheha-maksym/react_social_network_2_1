import React from 'react';
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap';

const UserPosts = (props) => {
    const postsList = props.data.map((obj, index) => {
        return (
            <tr key={index}>
                <td>
                    <div className="profile mr-3">
                        <img
                            src={obj || "http://via.placeholder.com/300"}
                            className="rounded mb-2 mx-auto d-block"
                            width="340px"
                            height="160px"
                            alt="post"
                        />
                    </div>
                </td>
            </tr>
        )
    })

    return (
        <>
            <Card>
                <table>
                    <tbody>
                        {props.data == 0 && (
                            <tr><td>User does not have posts</td></tr>
                        )}
                        {postsList} 
                    </tbody>
                </table>
            </Card>
        </>
    )
}

export default UserPosts;