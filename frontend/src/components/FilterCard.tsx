import { ChangeEvent } from "react";

interface FilterProps {
    specifics: string[];
    filterAttr: string;
    onChangeFilter: Function;
    filterCriteria: string
}

function FilterCard({ filterCriteria, onChangeFilter, filterAttr, specifics }: FilterProps) {
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function handleFilterChange(e: ChangeEvent<HTMLSelectElement>) {
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