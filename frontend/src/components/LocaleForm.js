import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";

function LocaleForm({ onAddLocales, handleClick }) {

    const [regions, setRegions] = useState([]);

    useEffect(() => {
        fetch('/regions')
            .then(res => res.json())
            .then(data => setRegions(data))
            .catch(error => console.error(error));
    }, []);

    const formSchema = yup.object().shape({
        name: yup.string().required("Please enter locale's name.").max(30),
        region_id: yup.string().required("Please select the region this locale is located in.")
    });

    const onSubmit = async (values, actions) => {
        try {
            const localeRes = await fetch('/locales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    region_id: values.region_id,
                }),
            });
            if(localeRes.status >= 400) {
                const data = await localeRes.json();
                actions.setErrors({duplicates: data.errors});
            };

            const localeData = await localeRes.json();

            onAddLocales(localeData);
            handleClick();
            actions.resetForm();
        } catch (error) {
            console.error(error);
        }
    };
    
    const {values, handleBlur, handleChange, handleSubmit, touched, errors, isSubmitting} = useFormik({
        initialValues: {
            name: "",
            region_id: "",
        },
        validationSchema: formSchema,
        onSubmit,
    });

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                id="name" 
                type="name" 
                placeholder="Enter locale's name as it appears on the map"
                className={errors.name && touched.name ? "input-error" : ""} 
            />
            {errors.name && touched.name && <p className="error">{errors.name}</p>}
            <label htmlFor="region">Region</label>
            <select
                value={values.region_id}
                onChange={handleChange}
                onBlur={handleBlur}
                id="region_id" 
                type="text" 
                placeholder="Select the habitat's region" 
                className={errors.region_id && touched.region_id ? "input-error" : ""}>
                    <option value="" hidden disabled>Select a region</option>
                    {regions.map((region) => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                ))}
            </select>
            {errors.region_id && touched.region_id && <p className="error">{errors.region_id}</p>}
            {errors.duplicates && <p className="error">{errors.duplicates}</p>}
                <button disabled={isSubmitting} type="submit">Submit</button>
        </form>
    )
};
export default LocaleForm;