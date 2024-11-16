import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context and hooks/AuthContext";
import { useState, useEffect, useCallback } from "react";
import useDebounce from "../context and hooks/DebounceHook";

function ExpeditionForm({ onAddExpedition, handleClick }) {
    const { user } = useAuth();
    const [debounceActive, setDebounceActive] = useState(false);
    const [locales, setLocales] = useState([]);
    const [captures, setCaptures] = useState([ 
        { name: "", dex_number: "", types: "" } ]);

    useEffect(() => {
        fetch('/locales')
            .then(res => res.json())
            .then(data => setLocales(data))
            .catch(error => console.error(error));
    }, []);

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
            captures: []
        },
        validationSchema: formSchema,
        onSubmit,
    });

    const addNewCapture = () => {
        const newCaptures = [...values.captures, { name: "", dex_number: "", types: "" }]
        setFieldValue("captures", newCaptures);
    };

    const removeCapture = (index) => {
        const newCaptures = values.captures.filter((_, i) => i !== index);
        setFieldValue("captures", newCaptures);
    }

    const speciesFetch = async (speciesName, i) => {

        if(speciesName) {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}`);
                if (!res.ok) throw new Error('Species not found');

                const data = await res.json();

                if(data.id > 1025){
                    const speciesRes = await fetch(data.species.url);
                    const speciesData = await speciesRes.json();

                    setFieldValue(`captures[${i}].dex_number`, speciesData.pokedex_numbers[0].entry_number);
                } else {
                    setFieldValue(`captures[${i}].dex_number`, data.id);
                }
                setFieldValue(`captures[${i}].types`, data.types.map(typeInfo => typeInfo.type.name).join(', '));
            } catch(error) {
                console.error(error);
                setFieldValue(`captures[${i}].dex_number`, "");
                setFieldValue(`captures[${i}].types`, "");
            } finally {
                setDebounceActive(false);
            }
        }
    };

    // const debouncedSpeciesFetch = useDebounce(speciesFetch, 700);
    const debouncedSpeciesFetch = useDebounce((speciesName, i) => {
        setDebounceActive(true);
        speciesFetch(speciesName, i);
    }, 700);

    const handleCaptureChange = (e, i) => {
        const { name, value } = e.target;
        const newCaptures = [...values.captures];
        newCaptures[i] = {...newCaptures[i], [name]: value};
        setFieldValue("captures", newCaptures);
    };

    const handleNameChange = (e, i) => {
        handleChange(e);
        const speciesName = e.target.value.toLowerCase().replace(/\s+/g, '-');
        handleCaptureChange(e, i);

        if (speciesName) {
            setDebounceActive(true);
            debouncedSpeciesFetch(speciesName, i);
        }
    }    

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
            <label htmlFor="locale">Locale</label>
            <select
                value={values.locale_id}
                onChange={handleChange}
                onBlur={handleBlur}
                id="locale_id" 
                type="text" 
                placeholder="Select the habitat's locale" 
                className={errors.locale_id && touched.locale_id ? "input-error" : ""}>
                    <option value="" hidden disabled>Select a locale</option>
                    {locales.map((locale) => (
                    <option key={locale.id} value={locale.id}>{locale.name} ({locale.region.name})</option>
                ))}
            </select>
            {errors.locale_id && touched.locale_id && <p className="error">{errors.locale_id}</p>}
            {values.captures.map((capture, index) => (
                <div key={index}>
                    <label htmlFor={`captures[${index}].name`}>Pokémon Name</label>
                    <input
                        id={`captures[${index}].name`}
                        name="name"
                        type="text"
                        placeholder="Enter species name here"
                        value={capture.name}
                        onChange={(e) => handleNameChange(e, index)}
                        onBlur={handleBlur}
                        className={errors.captures?.[index]?.name && touched.captures?.[index]?.name ? "input-error" : ""}
                    />
                    {errors.captures?.[index]?.name && touched.captures?.[index]?.name && <p className="error">{errors.captures[index].name}</p>}
                    <label htmlFor={`captures[${index}].dex_number`}>Dex Number</label>
                    <input
                        id={`captures[${index}].dex_number`}
                        name="dex_number"
                        type="text"
                        value={capture.dex_number}
                        readOnly
                        className={errors.captures?.[index]?.dex_number && touched.captures?.[index]?.dex_number ? "input-error" : ""}
                    />
                    {errors.captures?.[index]?.dex_number && touched.captures?.[index]?.dex_number && <p className="error">{errors.captures[index].dex_number}</p>}
                    <label htmlFor={`captures[${index}].types`}>Types</label>
                    <input
                        id={`captures[${index}].types`}
                        name="types"
                        type="text"
                        value={capture.types}
                        readOnly
                        className={errors.captures?.[index]?.types && touched.captures?.[index]?.types ? "input-error" : ""}
                    />
                    {errors.captures?.[index]?.types && touched.captures?.[index]?.types && <p className="error">{errors.captures[index].types}</p>}
                    <button type="button" onClick={() => removeCapture(index)}>Remove Capture</button>
                </div>
            ))}
            <button type="button" onClick={addNewCapture}>Add new capture</button>
            <button disabled={isSubmitting || debounceActive } type="submit">Submit</button>
        </form>
    )
};

export default ExpeditionForm;