import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context and hooks/AuthContext";

function ExpeditionForm({ onAddExpedition, handleClick }) {
    const { user } = useAuth();

    const formSchema = yup.object().shape({
        date: yup.date().required("Enter the date of this expedition."),
        locale_id: yup.string().required("Please enter the locale of this expedition."),
        name: yup.string().required("Please enter a Pokémon name."),
        dex_number: yup.number().required("Dex number will be auto-populated."),
        types: yup.string().required("Types will be auto-populated.")
    });

    const onSubmit = async(values, actions) => {
        // do the thing
        console.log("Form submitted", values);
        actions.resetForm();
    };

    const {values, handleBlur, handleChange, handleSubmit, setFieldValue, touched, errors, isSubmitting} = useFormik({
        initialValues: {
            date: "",
            locale_id: "",
            name: "",
            dex_number: "",
            types: ""
        },
        validationSchema: formSchema,
        onSubmit,
    });

    const handleNameChange = async (e) => {
        const speciesName = e.target.value.toLowerCase();
        handleChange(e);

        if(speciesName) {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}`);
                if (!res.ok) throw new Error('Species not found');

                const data = await res.json();
                setFieldValue('dex_number', data.id);
                setFieldValue('types', data.types.map(typeInfo => typeInfo.type.name).join(', '))
            } catch(error) {
                console.error(error);
                setFieldValue('dex_number', "");
                setFieldValue('types', "");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="date">Date</label>
            <input
                value={values.date}
                onChange={handleChange}
                onBlur={handleBlur}
                type="date"
                id="date"
                className={errors.date && touched.date ? "input-error" : ""}
            />
            {errors.date && touched.date && <p className="error">{errors.date}</p>}
            <label htmlFor="name">Pokémon Name</label>
            <input
                id="name"
                type="text"
                placeholder="Enter species name here"
                value={values.name}
                onChange={handleNameChange}
                onBlur={handleBlur}
                className={errors.name && touched.name ? "input-error" : ""}
            />
            {errors.name && touched.name && <p className="error">{errors.name}</p>}
            <label htmlFor="dex_number">Dex Number</label>
            <input
                id="dex_number"
                type="text"
                value={values.dex_number}
                readOnly
                className={errors.dex_number && touched.dex_number ? "input-error" : ""}
            />
            {errors.dex_number && touched.dex_number && <p className="error">{errors.dex_number}</p>}
            <label htmlFor="types">Types</label>
            <input
                id="types"
                type="text"
                value={values.types}
                readOnly
                className={errors.types && touched.types ? "input-error" : ""}
            />
            {errors.types && touched.types && <p className="error">{errors.types}</p>}
            <button disabled={isSubmitting} type="submit">Submit</button>
        </form>
    )
};

export default ExpeditionForm;