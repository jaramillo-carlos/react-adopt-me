import React, { lazy } from 'react';
import pet, { Photo } from '@frontendmasters/pet';
import Carousel from './Carousel';
import ErrorBoundary from './ErrorBoundary';
// import ThemeContext from "./ThemeContext"
// import Modal from './Modal';
import { navigate, RouteComponentProps } from '@reach/router';

import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
console.log(_, moment);

const Modal = lazy(() => import('./Modal'));

/*
const Details = (props) => {
  return (
    <div>
      <pre><code>{JSON.stringify(props, null, 4)}</code></pre>
    </div>)
}
*/

class Details extends React.Component<RouteComponentProps<{ id: string }>> {
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
  public state = {
    loading: true,
    showModal: false,
    name: "",
    animal: "",
    location: "",
    description: "",
    media: [] as Photo[],
    url: "",
    breed: ""
  } // initialize state
  // initialice with empty, only work with public class, properties, inside a constructor dont works


  private thing = 'blah';

  // if you make this private, typescript will show error, because React is calling it
  public componentDidMount() {
    // throw new Error('lol');

    if (!this.props.id) {
      navigate('/');
      return
    }

    pet.animal(+this.props.id)
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
      .catch((err: Error) => this.setState({ error: err }));
  }

  public toggleModal = () => this.setState({ showModal: !this.state.showModal })
  public adopt = () => navigate(this.state.url)

  public render() {
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
          { /*<ThemeContext.Consumer>*/}
          {
            // (themeHook) => (
            // <button style={{ backgroundColor: themeHook[0] }}>Adopt {name}</button>
            // ([theme]) => ( // destructuring
            <button onClick={this.toggleModal} style={{ backgroundColor: this.props.theme }}>
              Adopt {name}
            </button>
            //  )
          }
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


const mapStateToProps = ({ theme }) => ({ theme });

const WrappedDetails = connect(mapStateToProps)(Details);
// HoC
export default function DetailsWithErrorBoundary(props: RouteComponentProps<{ id: string }>) {
  return (
    <ErrorBoundary>
      { /* <Details {...props} /> */}
      <WrappedDetails {...props} />
    </ErrorBoundary>
  )

}