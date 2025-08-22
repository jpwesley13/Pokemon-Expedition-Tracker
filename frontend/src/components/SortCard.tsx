import { ChangeEvent } from "react";

interface SortProps {
  sortBy: string;
  options: string[];
  onChangeSort: Function;
}

function SortCard({ sortBy, onChangeSort, options }: SortProps) {
  function handleSortChange(e: ChangeEvent<HTMLInputElement>) {
    onChangeSort(e.target.value);
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