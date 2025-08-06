import React from "react";

function SortCard({ sortBy, onChangeSort, options }) {
  function handleSortChange(event) {
    onChangeSort(event.target.value);
  }

  const sortOptions= options.map(option => {
    return (
        <label key={option} className="sort-option">
        <input
          type="radio"
          value={option}
          name="sort"
          checked={sortBy === option}
          onChange={handleSortChange}
        />
        {option}
      </label>
    )
  })

  return (
    <div className="sort-card">
        {sortOptions}
    </div>
  );
}

export default SortCard;