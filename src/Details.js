import React from 'react';
import pet from '@frontendmasters/pet';
import Carousel from './Carousel';
import ErrorBoundary from './ErrorBoundary';
import ThemeContext from "./ThemeContext"
import Modal from './Modal';
import { navigate } from '@reach/router';

/*
const Details = (props) => {
  return (
    <div>
      <pre><code>{JSON.stringify(props, null, 4)}</code></pre>
    </div>)
}
*/

class Details extends React.Component {
  /*
  constructor(props) {
    super(props); // call constructor of parent class, to send props

    // Object.assign(oldState, newState)

    this.state = {
      someOtherThing: 'lol',
      loading: true,
    }
  }
  */

  // is the same but with plugin-proposal-class-properties
  state = { loading: true, showModal: false } // initialize state

  componentDidMount() {
    // throw new Error('lol');
    pet.animal(this.props.id)
      .then(({ animal }) => {
        this.setState({
          url: animal.url,
          name: animal.name,
          animal: animal.type,
          location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
          description: animal.description,
          media: animal.photos,
          breed: animal.breeds.primary,
          loading: false,
        })
      }, console.error)
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal })
  adopt = () => navigate(this.state.url)

  render() {
    if (this.state.loading) {
      return <h1>loading..</h1>
    }

    const { animal, breed, location, description, name, media, showModal } = this.state;
    return (
      <div className="details">
        <Carousel media={media} />
        <div onClick={console.log}>
          <h1>{name}</h1>
          <h2>{`${animal} - ${breed} - ${location}`}</h2>
          <ThemeContext.Consumer>
            {
              // (themeHook) => (
              // <button style={{ backgroundColor: themeHook[0] }}>Adopt {name}</button>
              ([theme]) => ( // destructuring
                <button onClick={this.toggleModal} style={{ backgroundColor: theme }}>Adopt {name}</button>
              )}
          </ThemeContext.Consumer>
          <p>{description}</p>
          {
            showModal ? (
              <Modal>
                <div>
                  <h1>Would you like to adopt {name} </h1>
                  <div className="buttons">
                    <button onClick={this.adopt}>Yes</button>
                    <button onClick={this.toggleModal}>No, I am a monster</button>
                  </div>
                </div>
              </Modal>
            ) : null
          }
        </div>
      </div >
    )
  }
}

// export default Details;

//HoC
export default function DetailsWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  )

}