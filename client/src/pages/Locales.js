import { useState, useEffect } from "react";
import SortCard from "../components/SortCard";
import Search from "../components/Search";
import FilterCard from "../components/FilterCard";
import { useAuth } from "../context and hooks/AuthContext";

function Locales() {

    const { user } = useAuth();
    const [locales, setLocales] = useState([]);
    const [expeditions, setExpeditions] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("Alphabetical Order");
    const [filterBy, setFilterBy] = useState("");
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

    const searchedLocales = locales.filter(locale => locale.name.toLowerCase().includes(search.toLowerCase()))

    const sortedLocales = searchedLocales.sort((locale1, locale2) => {
        if(sortBy === "Alphabetical Order") {
            return locale1.name.localeCompare(locale2.name);
        } else if(sortBy === "Most Expeditions") {
            return locale2.expeditions.length - locale1.expeditions.length;
        }
    })

    const options = ["Alphabetical Order", "Most Expeditions"]

    const filteredLocales = sortedLocales.filter(locale => locale.region.name.includes(filterBy))
}