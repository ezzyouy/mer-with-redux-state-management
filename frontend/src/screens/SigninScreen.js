import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signin } from '../actions/userActions';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';

function SigninScreen() {
    const navigate = useNavigate();

    const { search } = useLocation();

    const redirectUrl = new URLSearchParams(search).get('redirect');

    const redirect = redirectUrl ? redirectUrl : '/';


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const userSignin = useSelector(state => state.userSignin)
    const { userInfo, loading, error } = userSignin;
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(signin(email, password));
    }
    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate]) 
    
    return (
        <div>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>Sign In</h1>
                </div>
                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                <div>
                    <label htmlFor="email">Email address</label>
                    <input
                        type='email'
                        id='email'
                        placeholder='Enter email'
                        required
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password address</label>
                    <input
                        type='password'
                        id='password'
                        placeholder='Enter password'
                        required
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label />
                    <button className='primary' type='submit'>
                        Sign In
                    </button>
                </div>
                <div>
                    <label />
                    <div>
                        New customer? {' '}
                        <Link to={`/register?redirect=${redirect}`}>Create your account</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SigninScreen
