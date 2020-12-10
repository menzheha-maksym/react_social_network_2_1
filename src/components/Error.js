import React from 'react';
import { Link } from 'react-router-dom'

export default function Error() {
    return (
        <div>
            <h1>
                404 Error
            </h1>
            <h2>
                Unable to find requested content
            </h2>
            <Link to="/"><button>Home</button></Link>
        </div>
    )
}