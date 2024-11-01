import { useFormik } from "formik";
import * as yup from "yup";

function EditGoal({ goal, setGoals, handleClick}) {

    const formSchema = yup.object().shape({
        content: yup.string().optional(),
        target_date: yup.date().optional()
    });

    const onSubmit = async (values, actions) => {
        const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
            if(value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        fetch(`/goals/${goal.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filteredValues),
        })
        .then(async res => {
            const data = await res.json();
            if (res.status >= 400) {
                actions.setErrors(data.errors);
            } else {
                setGoals(goals => goals.map(goal => goal.id === data.id ? data : goal));
                handleClick();
                actions.resetForm();
            }
        })
        .catch(error => console.error(error))
    };

    const {values, handleBlur, handleChange, handleSubmit, touched, errors, isSubmitting} = useFormik({
        initialValues: {
            content: goal.content,
            target_date: goal.target_date,
            user_id: ""
        },
        validationSchema: formSchema,
        onSubmit
    });

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="content">Updated Goal</label>
            <textarea
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
                id="content" 
                placeholder="Update your goal here"
                rows="5"
                cols="54"
                className={errors.content && touched.content ? "input-error" : ""} 
            />
            {errors.content && touched.content && <p className="error">{errors.content}</p>}
            <label htmlFor="target_date">Updated Target Date</label>
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

export default EditGoal;