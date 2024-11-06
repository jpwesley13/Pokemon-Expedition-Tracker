import { useState, useEffect } from "react";
import LocaleCard from "../components/LocaleCard";
import LocaleForm from "../components/LocaleForm";
import SortCard from "../components/SortCard";
import Search from "../components/Search";
import FilterCard from "../components/FilterCard";
import { useAuth } from "../context and hooks/AuthContext";
import ModalButton from "../components/ModalButton";
import { Modal, Box } from "@mui/material";

function Locales() {

    const { user } = useAuth();
    const [locales, setLocales] = useState([]);
    // const [expeditions, setExpeditions] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("Alphabetical Order");
    const [filterBy, setFilterBy] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch(`/locales`)
        .then(res => res.json())
        .then(data => setLocales(data))
        .catch(error => console.error(error))
        // fetch(`/expeditions`)
        // .then(res => res.json())
        // .then(data => setExpeditions(data))
        // .catch(error => console.error(error))
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

    const displayedLocales = filteredLocales.map(locale => (
        <LocaleCard
        key={locale.id}
        locale={locale}
        />
    ))

    const regions = [...new Set(locales.map(locale => locale.region.name))]

    return (
        <>
            <hr/>
            <h2 className="header">Locales:</h2>
            <br />
            <div className="search-container">
                <Search
                    search={search}
                    searchSetter={setSearch}
                />
            </div>
            <div className="filter-sort-container">
                <div className="filter-sort-row">
                    <FilterCard
                        specifics={regions}
                        label="locales"
                        filterAttr="region"
                        onChangeFilter={setFilterBy}
                        filterCriteria={filterBy}
                    />
                    <SortCard
                    sortBy={sortBy}
                    onChangeSort={setSortBy}
                    options={options}
                    />
                </div>
                {user && ( <div className="filter-sort-button">
                    <ModalButton variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                        Add new locale
                    </ModalButton>
                    </div>
                )}
                </div>
                <div className="cards-container">
                    {displayedLocales}
                </div>
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    aria-labelledby="edit-profile-modal-title"
                    aria-describedby="edit-profile-modal-description"
                >
                    <Box className="modal-box">
                        <h2>Add new locale</h2>
                        <ModalButton className="close-button" onClick={() => setIsModalOpen(false)} sx={{ mb: 2 }}>Close</ModalButton>
                        <LocaleForm
                        handleClick={() => setIsModalOpen(false)}
                        onAddLocales={onAddLocales}
                        />
                    </Box>
                </Modal>
        </>
    );
};

export default Locales;