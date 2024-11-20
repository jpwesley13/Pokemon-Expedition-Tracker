import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from "yup";
import { useAuth } from '../context and utility/AuthContext';

export default function Login() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    if(user){
        navigate('/')
    }

    const formSchema = yup.object().shape({
        username: yup.string().required("Username is required."),
        password: yup.string().required("Password is required.")
    });

    const onSubmit = async (values, actions) => {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
        .then(async res => {
            const data = await res.json();
            if(res.status >= 400) {
                actions.setErrors({credentials: data.errors});
            } else {
                setUser(data)
                navigate('/');
            } 
        })
        .catch(error => console.error(error)) 
    };

    const {values, handleBlur, handleChange, handleSubmit, touched, errors, isSubmitting} = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: formSchema,
        onSubmit,
    });

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                id="username" 
                type="text" 
                placeholder="Enter your username"
                className={errors.username && touched.username ? "input-error" : ""} 
            />
            {errors.username && touched.username && <p className="error">{errors.username}</p>}
            <label htmlFor="password">Password</label>
            <input
                style={{ marginBottom: '1rem' }}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                id="password" 
                type="password" 
                placeholder="Enter your password"
                className={errors.password && touched.password ? "input-error" : ""} 
            />
            {errors.password && touched.password && <p className="error">{errors.password}</p>}
            {errors.credentials && <p className="error">{errors.credentials}</p>}
                <button disabled={isSubmitting} type="submit">Login</button>
        </form>
    )
}