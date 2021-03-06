import React, { useState, useEffect, useContext, FunctionComponent } from "react";
import pet, { ANIMALS, Animal } from "@frontendmasters/pet"; // when you add library here, and parcel is runing, he go installing without you need write npm install
import Results from "./Results";
import useDropdown from "./useDropdown";
// import ThemeContext from "./ThemeContext"
import { RouteComponentProps } from '@reach/router';
import changeTheme from '../reducers/ChangeTheme';
import changeLocation from '../reducers/ChangeLocation';
import { connect } from "react-redux";

const SearchParams: FunctionComponent<RouteComponentProps> = (props) => {
  // const location = "Seattle, WA"; // with this, cant be changed in html, because on change he will re render again, and have this value.
  // The two data binding not is free on react. Like Angular
  const [location, setLocation] = useState("Seattle, WA"); // useState never can be inside loops or conditionals (ifs) because he expect to be called in the same order, in each render.

  const [animal, setAnimal] = useState("dog");
  const [breeds, setBreeds] = useState([] as string[]);
  const [breed, BreedDropdown, setBreed] = useDropdown("Breed", "", breeds);
  const [pets, setPets] = useState([] as Animal[]);

  // const [theme, setTheme] = useContext(ThemeContext)

  // const [animalD, AnimalDropdown] = useDropdown("Animal", "dog", ANIMALS);

  async function requestPets() {
    // setTheme('darkred');
    const { animals } = await pet.animals({
      // location,
      location: props.location,
      breed,
      type: animal,
    });

    setPets(animals || {});
  }

  // this does not run on the first render
  // first will render DOM, and all of user can see, before run this effect
  useEffect(() => {
    // called after first render
    setBreeds([]);
    setBreed("");

    pet.breeds(animal).then(({ breeds: apiBreeds }) => {
      // const breedStrings = breeds.map((breedObj) => breedObj.name);
      const breedStrings = apiBreeds.map(({ name }) => name);
      console.log(breedStrings);
      setBreeds(breedStrings);
    }, console.error);
    // }, error => console.error(error));
  }, [animal, setBreed, setBreeds]); // array of wich depends useEffect, when is empty only when execut only once

  return (
    // is className and not class, because is a reserved word in javascript (like let or const), for create a Class.
    <div className="search-params">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestPets();
        }}
      >
        {/* cant use for, because is a reserved word in javascript, for loop. */}
        <label htmlFor="location">
          Location
          <input
            id="location"
            // value={props.location}
            value={props.location}
            placeholder="Location"
            // onChange={(e) => setLocation(e.target.value)}
            onChange={(e) => props.updateLocation(e.target.value)}
          />
        </label>
        <label htmlFor="animal">
          Animal
          <select
            id="animal"
            value={animal}
            onChange={(e) => setAnimal(e.target.value)}
            onBlur={(e) => setAnimal(e.target.value)}
          >
            {/* onBlur is better way in this case than onChange, for screen readers */}
            <option>All</option>
            {ANIMALS.map((animal) => (
              <option key={animal} value={animal}>
                {animal}
              </option>
            ))}
          </select>
        </label>
        <BreedDropdown />
        <label htmlFor="theme">
          Theme
          <select
            // value={theme}
            // onChange={e => setTheme(e.target.value)}
            // onBlur={e => setTheme(e.target.value)}
            value={props.theme}
            onChange={e => props.setTheme(e.target.value)}
            onBlur={e => props.setTheme(e.target.value)}
          >
            <option value="darkblue">Dark Blue</option>
            <option value="darkred">Dark Red</option>
            <option value="mediumorchid">Medium Orchid</option>
            <option value="chartreuse">Chartreuse</option>
            <option value="peru">Peru</option>
          </select>
        </label>
        <button style={{ backgroundColor: props.theme }}>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

const mapStateToProps = ({ theme, location }) => ({
  theme,
  location
});

const mapDispatchToProps = (dispatch) => ({
  setTheme: theme => dispatch(changeTheme(theme)),
  updateLocation: location => dispatch(changeLocation(location))
});

// export default SearchParams;
export default connect(mapStateToProps, mapDispatchToProps)(SearchParams);
