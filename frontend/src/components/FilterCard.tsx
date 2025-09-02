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

    const specificOptions = specifics.map((specific) => (
        <option key={specific} value={specific}>
            {specific}
        </option>
    ));

    return (
        <>
            <div className="filter-card">
                <select
                    onChange={(e) => onChangeFilter(e.target.value)}
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