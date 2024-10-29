import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context and hooks/AuthContext";

function Signup() {

    const { setUser } = useAuth();
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
        username: yup.string().required("Must enter username.").max(24),
        age: yup.number().integer().required("Must enter age.").typeError("Please enter an Integer").min(10, "Must be at least 10 years old to join."),
        password: yup.string().min(6, "Password must be at least 6 characters.").max(30, "Password cannot exceed 30 characters.").required("Must create a password."),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Passwords must match.").required("Required.")
    });

    const onSubmit = async (values, actions) => {
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
        .then(async res => {
            const data = await res.json();
            if (res.status >= 400) {
                actions.setErrors(data.errors);
            } else {
                setUser(data);
                navigate('/');
                actions.resetForm();
            }
        })
        .catch(error => console.error(error))
      };
    
    const {values, handleBlur, handleChange, handleSubmit, touched, errors, isSubmitting} = useFormik({
        initialValues: {
            username: "",
            age: "",
            password: "",
            confirmPassword: ""
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
                type="username" 
                placeholder="Enter your username"
                className={errors.username && touched.username ? "input-error" : ""} 
            />
            {errors.username && touched.username && <p className="error">{errors.username}</p>}
            <label htmlFor="age">Age</label>
            <input
                value={values.age}
                onChange={handleChange}
                onBlur={handleBlur}
                id="age" 
                type="number" 
                placeholder="Enter your age" 
                className={errors.age && touched.age ? "input-error" : ""} 
            />
            {errors.age && touched.age && <p className="error">{errors.age}</p>}
            <label htmlFor="password">Password</label>
            <input
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                id="password" 
                type="password" 
                placeholder="Enter your password"
                className={errors.password && touched.password ? "input-error" : ""} 
            />
            {errors.password && touched.password && <p className="error">{errors.password}</p>}
            <label htmlFor="password">Confirm Password</label>
            <input
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                id="confirmPassword" 
                type="password" 
                placeholder="Confirm your password"
                className={errors.confirmPassword && touched.confirmPassword ? "input-error" : ""} 
            />
            {errors.confirmPassword && touched.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                <button disabled={isSubmitting} type="submit">Submit</button>
        </form>
    )
};
export default Signup;