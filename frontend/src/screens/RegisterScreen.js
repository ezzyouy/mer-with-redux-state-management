import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { register } from '../actions/userActions';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';

function RegisterScreen() {
    const navigate = useNavigate();

    const { search } = useLocation();

    const redirectUrl = new URLSearchParams(search).get('redirect');

    const redirect = redirectUrl ? redirectUrl : '/';

    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const userRegister = useSelector(state => state.userRegister)
    const { userInfo, loading, error } = userRegister;
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('password and confirm password are not match')
        } else {
            dispatch(register(name, email, password));
        }
    }
    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [userInfo, redirect])

    return (
        <div>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>Create Account</h1>
                </div>
                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                <div>
                    <lable htmlFor="email">Name</lable>
                    <input
                        type='text'
                        id='name'
                        placeholder='Enter name'
                        required
                        onChange={(e) => setName(e.target.value)} />
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
                    <lable htmlFor="password">Password</lable>
                    <input
                        type='password'
                        id='password'
                        placeholder='Enter password'
                        required
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <lable htmlFor="confirmPassword">Confirm Password</lable>
                    <input
                        type='password'
                        id='confirmPassword'
                        placeholder='Enter confirm password'
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div>
                    <label />
                    <button className='primary' type='submit'>
                        Register
                    </button>
                </div>
                <div>
                    <lable />
                    <div>
                        Already have an account? {' '}
                        <Link to={`/signin?redirect=${redirect}`}>Create your account</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RegisterScreen
