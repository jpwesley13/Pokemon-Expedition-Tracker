interface SortProps {
  sortBy: string;
  options: string[];
  onChangeSort: Function;
}

function SortCard({ sortBy, onChangeSort, options }: SortProps) {

  const sortOptions= options.map(option => {
    return (
        <label key={option} className="sort-option">
        <input
          type="radio"
          value={option}
          name="sort"
          checked={sortBy === option}
          onChange={(e) => onChangeSort(e.target.value)}
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