import { useState, useEffect } from "react";
import SortCard from "../components/SortCard";
import Search from "../components/Search";
import FilterCard from "../components/FilterCard";
import { useAuth } from "../context and hooks/AuthContext";

function Locales() {

    const { user } = useAuth();
    const [locales, setLocales] = useState([]);
    const [expeditions, setExpeditions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch(`/locales`)
        .then(res => res.json())
        .then(data => setLocales(data))
        .catch(error => console.error(error))
        fetch(`/expeditions`)
        .then(res => res.json())
        .then(data => setExpeditions(data))
        .catch(error => console.error(error))
    }, [])

    function onAddLocales(newLocale){
        return setLocales([...locales, newLocale])
    }


}