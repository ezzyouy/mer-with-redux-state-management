import React, { useState } from 'react'
import { Link } from "react-router-dom";

function SigninScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const submitHandler=(e)=>{
        e.preventDefault();
    }
    return (
        <div>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>Sign In</h1>
                </div>
                <div>
                    <lable htmlFor="email">Email address</lable>
                    <input
                    type='email'
                    id='email'
                    placeholder='Enter email'
                    required
                    onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <lable htmlFor="password">Password address</lable>
                    <input
                    type='password'
                    id='password'
                    placeholder='Enter password'
                    required
                    onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label/>
                    <button className='primary' type='submit'>
                        Sign In
                    </button>
                </div>
                <div>
                    <lable/>
                    <div>
                        New customer? {' '}
                        <Link to="/register">Create your account</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SigninScreen
