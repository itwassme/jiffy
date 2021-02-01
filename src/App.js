import React, {Component} from 'react';
import loader from './images/loader.svg';
import Gif from './Gif';
import clearButton from './images/close-icon.svg';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
}

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {/* if we have results, show the clear button, otherwise show the title */}
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} />
      </button>
    ) : (
      <h1 className="title" >Jiffy</h1>
    )}
   
  </div>
)

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {loading ? <img src={loader} className="block mx-auto" /> : hintText}
  </div>
)

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      // we have an array of gifs
      gifs: []
    }
  }

  // we want a function that searches the giphy api using fetch
  searchGiphy = async searchTerm => {
    this.setState({
      loading: true
    })
    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=cn45fxA1mJLGgbDHGAbmaHqKiThGXF7T&q=${searchTerm}&limit=25&offset=0&rating=pg&lang=en`);

      // here we convert our rqw response into json data
      const {data} = await response.json();

      // here we check if the array of results is empty
      // if it is, we throw an error which will stop the
      // code here and handle it in the catch area
      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }

      // grab random result from images
      const randomGif = randomChoice(data);

      this.setState((prevState, props) => ({
        ...prevState,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }))

    } catch (error){
        this.setState((prevState, props) => ({
          ...prevState,
          hintText: error,
          loading: false,
        }))
    }
  }
  
  handleChange = event => {
    const {value} = event.target;
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Ht enter to serach ${value}` : ''
    }));
  };

  handleKeyPress = event => {
    const {value} = event.target;
    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value);
    }
  }

// here we reset our state by clearing every out and
// making it default again
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }))
    // here we grab the input and then focus the cursor back
    this.textInput.focus()
  }

  render() {
    const { searchTerm, gifs } = this.state
    // here we set a variable to see if we have any gifs
    const hasResults = gifs.length
    return (
      <div className='page'>
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {/* here we loop over array of gif images from our state and we create multiple videos from it */}
          {this.state.gifs.map(gif => (
            <Gif {...gif} />
          ))}
          <input
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input
            }}
          />
        </div>
        <UserHint {...this.state} />
      </div>
    )
  }
}

export default App;
