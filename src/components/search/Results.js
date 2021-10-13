import React from 'react';
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap';

const Results = (props) => {
    const resultsList = props.data.map((obj, index) => {
        return (
            <tr key={index}>
                <td>
                    <div className="profile mr-3">
                        <img
                            src={obj.profile_pic || "http://via.placeholder.com/300"}
                            className="rounded mb-2 mx-auto d-block"
                            width="200px"
                            height="150px"
                            alt="avatar"
                        />
                    </div>
                    <div className="mt-2 mb-3">
                        <strong>Username: </strong> {obj.username}
                    </div>
                    <strong>Email:</strong> {obj.email}
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
                            <tr><td>Enter username and click search to start</td></tr>
                        )}
                        {resultsList}
                    </tbody>
                </table>
            </Card>
        </>
    )
}

export default Results;