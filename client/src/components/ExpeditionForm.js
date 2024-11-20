import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context and utility/AuthContext";
import { useState, useEffect, useCallback } from "react";
import useDebounce from "../context and utility/DebounceHook";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function ExpeditionForm({ onAddExpedition, handleClick }) {
    const { user } = useAuth();
    const [debounceActive, setDebounceActive] = useState(false);
    const [locales, setLocales] = useState([]);

    useEffect(() => {
        fetch('/locales')
            .then(res => res.json())
            .then(data => setLocales(data))
            .catch(error => console.error(error));
    }, []);

    const formSchema = yup.object().shape({
        date: yup.date().required("Enter the date of this expedition."),
        locale_id: yup.string().required("Please enter the locale of this expedition."),
        captures: yup.array().of(
            yup.object().shape({
              species: yup.object().shape({
                name: yup.string().required("Please enter a Pokémon name."),
                dex_number: yup.number().required("Dex number will be auto-populated."),
                types: yup.string().required("Types will be auto-populated."),
                shiny: yup.boolean().required("Please specify if the Pokémon is shiny.")
              })
            })
          )
    });

    const onSubmit = async(values, actions) => {
        try {
            const expeditionRes = await fetch(`/expeditions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: values.date,
                    locale_id: values.locale_id,
                    user_id: user.id,
                    captures: values.captures.map(capture =>({
                        species: {
                            name: capture.species.name,
                            dex_number: capture.species.dex_number,
                            shiny: capture.species.shiny,
                            types: capture.species.types.split(', ')
                        }
                    }))
                }),
            });
            if(expeditionRes.status >= 400) {
                const data = await expeditionRes.json();
                actions.setErrors(data.errors);
            };
            const expeditionData = await expeditionRes.json();
            onAddExpedition(expeditionData);
            handleClick();
            actions.resetForm();
        } catch(error) {
            console.error(error)
        }
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
        const newCaptures = [...values.captures, { 
            species: {
                name: "", 
                dex_number: "", 
                types: "", 
                shiny: false 
            }
        }]
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

                    setFieldValue(`captures[${i}].species.dex_number`, speciesData.pokedex_numbers[0].entry_number);
                } else {
                    setFieldValue(`captures[${i}].species.dex_number`, data.id);
                }
                const capitalizeTypes = data.types.map(typeInfo => capitalizeFirstLetter(typeInfo.type.name)).join(', ')
                setFieldValue(`captures[${i}].species.types`, capitalizeTypes);
            } catch(error) {
                console.error(error);
                setFieldValue(`captures[${i}].species.dex_number`, "");
                setFieldValue(`captures[${i}].species.types`, "");
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
        newCaptures[i].species = {...newCaptures[i].species, [name]: value};
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
                    <label htmlFor={`captures[${index}].species.name`}>Pokémon Name</label>
                    <input
                        id={`captures[${index}].species.name`}
                        name="name"
                        type="text"
                        placeholder="Enter species name here"
                        value={capture.species.name}
                        onChange={(e) => handleNameChange(e, index)}
                        onBlur={handleBlur}
                        className={errors.captures?.[index]?.species?.name && touched.captures?.[index]?.species?.name ? "input-error" : ""}
                    />
                    {errors.captures?.[index]?.species?.name && touched.captures?.[index]?.name && <p className="error">{errors.captures[index].species.name}</p>}
                    <label htmlFor={`captures[${index}].species.dex_number`}>Dex Number</label>
                    <input
                        id={`captures[${index}].species.dex_number`}
                        name="dex_number"
                        type="text"
                        value={capture.species.dex_number}
                        readOnly
                        className={errors.captures?.[index]?.species?.dex_number && touched.captures?.[index]?.species?.dex_number ? "input-error" : ""}
                    />
                    {errors.captures?.[index]?.species?.dex_number && touched.captures?.[index]?.species?.dex_number && <p className="error">{errors.captures[index].species.dex_number}</p>}
                    <label htmlFor={`captures[${index}].species.types`}>Types</label>
                    <input
                        id={`captures[${index}].species.types`}
                        name="types"
                        type="text"
                        value={capture.species.types}
                        readOnly
                        className={errors.captures?.[index]?.species?.types && touched.captures?.[index]?.species?.types ? "input-error" : ""}
                    />
                    {errors.captures?.[index]?.species?.types && touched.captures?.[index]?.species?.types && <p className="error">{errors.captures[index].species.types}</p>}
                    {/* <label htmlFor={`captures[${index}].species.shiny`}>Shiny?</label>
                    <input
                        id={`captures[${index}].species.shiny`}
                        type="checkbox"
                        name="shiny"
                        checked={capture.species.shiny}
                        onChange={(e) => handleChange(e, index)}
                        onBlur={handleBlur}
                        className={errors.captures?.[index]?.species?.shiny && touched.captures?.[index]?.species?.shiny ? "input-error" : ""}
                    />
                    {errors.captures?.[index]?.species?.shiny && touched.captures?.[index]?.species?.shiny && <p className="error">{errors.captures[index].species.shiny}</p>} */}
                    <div>
                        <label>Shiny?</label>
                        <label htmlFor={`captures[${index}].species.shiny-yes`}>Yes</label>
                        <input
                            id={`captures[${index}].species.shiny-yes`}
                            type="radio"
                            name={`captures[${index}].species.shiny`}
                            value="true"
                            checked={capture.species.shiny === true}
                            onChange={(e) => {
                                setFieldValue(`captures[${index}].species.shiny`, true);
                            }}
                        />
                        <label htmlFor={`captures[${index}].species.shiny-no`}>No</label>
                        <input
                            id={`captures[${index}].species.shiny-no`}
                            type="radio"
                            name={`captures[${index}].species.shiny`}
                            value="false"
                            checked={capture.species.shiny === false}
                            onChange={(e) => {
                                setFieldValue(`captures[${index}].species.shiny`, false);
                            }}
                        />
                        {errors.captures?.[index]?.species?.shiny && touched.captures?.[index]?.species?.shiny && (
                            <p className="error">{errors.captures[index].species.shiny}</p>
                        )}
                    </div>
                    <button type="button" onClick={() => removeCapture(index)}>Remove Capture</button>
                </div>
            ))}
            <button type="button" onClick={addNewCapture}>Add new capture</button>
            <button disabled={isSubmitting || debounceActive } type="submit">Submit</button>
        </form>
    )
};

export default ExpeditionForm;