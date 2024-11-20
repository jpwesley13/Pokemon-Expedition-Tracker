import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context and utility/AuthContext";

function GoalForm({ onAddGoal, handleClick}) {
    const { user } = useAuth();

    const formSchema = yup.object().shape({
        content: yup.string().required("Must enter content for your goal!"),
        target_date: yup.date().required("Enter the target date for completing your goal!")
    });

    const onSubmit = async (values, actions) => {
        const goalData = {
            ...values,
            user_id: user.id
        };

        fetch('/goals', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(goalData),
        })
        .then(res =>{
            if(res.ok) {
                return res.json()
            } else {
                throw new Error("Error occurred in adding new goal.");
            }
        })
        .then(data => {
            onAddGoal(data);
            handleClick();
        })
        .catch(error => console.error(error))
        actions.resetForm()
    };

    const {values, handleBlur, handleChange, handleSubmit, touched, errors, isSubmitting} = useFormik({
        initialValues: {
            content: "",
            target_date: ""
        },
        validationSchema: formSchema,
        onSubmit
    });

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="content">Goal</label>
            <textarea
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
                id="content" 
                placeholder="Write your goal here"
                rows="5"
                cols="54"
                className={errors.content && touched.content ? "input-error" : ""} 
            />
            {errors.content && touched.content && <p className="error">{errors.content}</p>}
            <label htmlFor="target_date">Target Date</label>
            <input
                value={values.target_date}
                onChange={handleChange}
                onBlur={handleBlur}
                type="date"
                id="target_date"
                className={errors.target_date && touched.target_date ? "input-error" : ""}
            />
            {errors.target_date && touched.target_date && <p className="error">{errors.target_date}</p>}
            <button disabled={isSubmitting} type="submit">Submit</button>
        </form>
    )
}

export default GoalForm;