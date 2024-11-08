import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

interface Props {
  people: Person[];
  debounceDelay?: number;
  onSelected: (person: Person | null) => void;
}

// eslint-disable-next-line react/display-name
const Autocomplete: React.FC<Props> = React.memo(
  ({ people, debounceDelay = 300, onSelected }) => {
    const [query, setQuery] = useState('');
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [debounceQuery, setdebounceQuery] = useState(query);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setSelectedPerson(null);
    };

    useEffect(() => {
      const handler = setTimeout(() => setdebounceQuery(query), debounceDelay);

      return () => clearTimeout(handler);
    }, [query, debounceDelay]);

    const filterePeople = useMemo(() => {
      return people.filter(p =>
        p.name.toLocaleLowerCase().includes(debounceQuery.toLocaleLowerCase()),
      );
    }, [debounceQuery, people]);

    const handlePersonSelect = (person: Person) => {
      setSelectedPerson(person);
      setQuery(person.name);
      onSelected(person);
    };

    useEffect(() => {
      if (!query) {
        setSelectedPerson(null);
        onSelected(null);
      }
    }, [query, onSelected]);

    return (
      <div className="container">
        <main className="section is-flex is-flex-direction-column">
          <h1 className="title" data-cy="title">
            {selectedPerson
              ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
              : `No selected person`}
          </h1>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleChange}
              data-cy="search-input"
            />
          </div>

          <div
            className={classNames('dropdown', {
              'is-active': selectedPerson === null,
            })}
          >
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filterePeople.length > 0 ? (
                  filterePeople.map(person => (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.slug}
                      onClick={() => handlePersonSelect(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  ))
                ) : (
                  <div
                    className="
                      notification
                      is-danger
                      is-light
                      mt-3
                      is-align-self-flex-start
                    "
                    role="alert"
                    data-cy="no-suggestions-message"
                  >
                    <p className="has-text-danger">No matching suggestions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  },
);

export default Autocomplete;
