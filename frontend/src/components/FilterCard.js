import React from "react";

function FilterCard({ filterCriteria, onChangeFilter, filterAttr, specifics }) {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function handleFilterChange(e) {
        onChangeFilter(e.target.value);
    }

    const specificOptions = specifics.map((specific) => (
        <option key={specific} value={specific}>
            {specific}
        </option>
    ));

    return (
        <>
            <div className="filter-card">
                <select
                    onChange={handleFilterChange}
                    value={filterCriteria}
                >
                    <option value="">
                        {filterCriteria ? "No Filter" : `Select a ${capitalizeFirstLetter(filterAttr)}`}
                    </option>
                    {specificOptions}
                </select>
            </div>
        </>
    );
}

export default FilterCard;