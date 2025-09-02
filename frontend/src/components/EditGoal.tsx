import { useFormik } from "formik";
import * as yup from "yup";

interface FormValues {
    content: string;
    target_date: Date | string;
}

function EditGoal({ goal, setGoals, handleClick}) {

    const initialFormValues = {
            content: goal.content,
            target_date: goal.target_date
        };

    const formSchema = yup.object().shape({
        content: yup.string().required("Goals cannot be empty! If you wish to remove this goal, please discard changes and press the Delete button."),
        target_date: yup.date().optional()
    });

    const onSubmit = async (values: FormValues, actions) => {
        fetch(`/goals/${goal.id}`, {
            method: "PATCH",
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
                setGoals(goals => goals.map(goal => goal.id === data.id ? data : goal));
                handleClick();
                actions.resetForm();
            }
        })
        .catch(error => console.error(error))
    };

    const {values, handleBlur, handleChange, handleSubmit, touched, errors, isSubmitting} = useFormik({
        initialValues: initialFormValues,
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
                placeholder="Update your goal here."
                rows={5}
                cols={54}
                className={errors.content && touched.content ? "input-error" : ""} 
            />
            {errors.content && touched.content && <p className="error">{String(errors.content)}</p>}
            <label htmlFor="target_date">Updated Target Date</label>
            <input
                value={values.target_date}
                onChange={handleChange}
                onBlur={handleBlur}
                type="date"
                id="target_date"
                className={errors.target_date && touched.target_date ? "input-error" : ""}
            />
            {errors.target_date && touched.target_date && <p className="error">{String(errors.target_date)}</p>}
            <button disabled={isSubmitting} type="submit">Submit</button>
        </form>
    )
}

export default EditGoal;