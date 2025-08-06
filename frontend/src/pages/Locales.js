import { useState, useEffect } from "react";
import LocaleCard from "../components/LocaleCard";
import LocaleForm from "../components/LocaleForm";
import SortCard from "../components/SortCard";
import Search from "../components/Search";
import FilterCard from "../components/FilterCard";
import { useAuth } from "../context and utility/AuthContext";
import ModalButton from "../components/ModalButton";
import { Modal, Box, Paper } from "@mui/material";

function Locales() {
    const { user } = useAuth();
    const [locales, setLocales] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("Alphabetical Order");
    const [filterBy, setFilterBy] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch(`/locales`)
        .then(res => res.json())
        .then(data => setLocales(data))
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

    const displayedLocales = filteredLocales.map(locale => {
        const expeditionCatches = locale.expeditions?.flatMap(expedition => 
                expedition.catches
            );
        return (
            <LocaleCard
                key={locale.id}
                locale={locale}
                catches={expeditionCatches}
            />
        )
    })

    const regions = [...new Set(locales.map(locale => locale.region.name))]

    return (
        <main className="locales-page">
            <h1>Locales</h1>
            <hr />
            
            <div className="locales-controls">
                <Paper elevation={3} className="controls-section">
                    <div className="controls-content">
                        <div className="search-section">
                            <h3>Search Locales</h3>
                            <Search
                                search={search}
                                searchSetter={setSearch}
                            />
                        </div>
                        
                        <div className="filter-sort-section">
                            <div className="filter-sort-row">
                                <div className="filter-container">
                                    <h3>Filter by Region</h3>
                                    <FilterCard
                                        specifics={regions}
                                        filterAttr="region"
                                        onChangeFilter={setFilterBy}
                                        filterCriteria={filterBy}
                                    />
                                </div>
                                <div className="sort-container">
                                    <h3>Sort By</h3>
                                    <SortCard
                                        sortBy={sortBy}
                                        onChangeSort={setSortBy}
                                        options={options}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {user && (
                            <div className="add-locale-section">
                                <ModalButton 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Add new locale
                                </ModalButton>
                            </div>
                        )}
                    </div>
                </Paper>
            </div>

            <div className="locales-content">
                <Paper elevation={3} className="locales-list-section">
                    <h2>Known Locales</h2>
                    <div className="locales-grid">
                        {displayedLocales.length > 0 ? displayedLocales : (
                            <Paper elevation={2} className="no-locales">
                                <p>No locales found matching your criteria.</p>
                            </Paper>
                        )}
                    </div>
                </Paper>
            </div>

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="add-locale-modal-title"
                aria-describedby="add-locale-modal-description"
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
        </main>
    );
};

export default Locales;