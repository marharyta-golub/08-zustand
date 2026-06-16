import css from './SearchBox.module.css';

interface SearchBoxProps {
  onSearchChange: (value: string) => void;
}

const SearchBox = ({ onSearchChange }: SearchBoxProps) => {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={event => onSearchChange(event.target.value)}
    />
  );
};

export default SearchBox;
