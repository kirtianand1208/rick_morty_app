class RickAndMorty extends React.Component {

    state = {
        page: 1,
        totalPages: 1,
        searchTerm: '',
        searching: false,
        searched: false,
        characters: []
    }

    firstCharacterRef = React.createRef();

    handleSearchInput = debounce(searchTerm => this.setState({ page: 1, searchTerm, searching: true }, this.fetchCharacters));

    fetchCharacters = () => {
        fetch(`https://rickandmortyapi.com/api/character/?page=${this.state.page}&name=${this.state.searchTerm}`)
            .then(res => res.json())
            .then(data => this.setState({
                totalPages: data.info.pages,
                characters: data.results,
                searching: false,
                searched: true
            }))
            .then(() => this.firstCharacterRef.current.focus())
            .catch(() => this.setState({
                page: 1,
                totalPages: 1,
                characters: [],
                searching: false,
                searched: true
            }));
    }

    changePage = e => {
        Array.from(e.target.classList).includes('page-btn-next') ?
            this.setState(prevState => ({ page: prevState.page + 1 }), this.fetchCharacters) :
            this.setState(prevState => ({ page: prevState.page - 1 }), this.fetchCharacters);
    }

    render() {
        return (
            <React.Fragment>
                <header>
                    <h1 className="heading">Rick <span>And</span> Morty</h1>
                </header>
                <main>
                    <SearchInput handleSearchInput={ e => this.handleSearchInput(e.target.value.replace(" ", "+")) } />
                    { this.state.searching ? <div className="search-loader" /> : null }
                    { this.state.searched && !this.state.searching ? <SearchOutput characters={ this.state.characters } firstCharacterRef={ this.firstCharacterRef } /> : null }
                    { this.state.totalPages > 1 && !this.state.searching ? <PageNavigation page={ this.state.page } totalPages={ this.state.totalPages } changePage={ this.changePage } /> : null }
                </main>
            </React.Fragment>
        );
    }
}

function SearchInput({ handleSearchInput }) {
    return (
        <div className="search">
            <label htmlFor="search-input" className="search-input-label">Character Search:</label>
            <input type="text" id="search-input" className="search-input" placeholder="e.g. 'rick'" spellCheck="false" onChange={ handleSearchInput } />
        </div>
    );
}

function SearchOutput({ characters, firstCharacterRef }) {
    return (
        <div className="search-output">
            {
                characters.length > 0 ?
                    characters.map((character, index) => <Character character={ character } key={ character.id } index={ index } firstCharacterRef={ firstCharacterRef } />) :
                    <p className="no-results">No Results Found</p>
            }
        </div>
    );
}

function Character({ character, firstCharacterRef, index }) {
    return (
        <details className="character-details" >

            <summary className="character-summary" ref={ index === 0 ? firstCharacterRef : null }>{ character.name }</summary>

            <div className="character-container">

                <div className="character-info">

                    <details className="character-info-item" open>
                        <summary className="character-info-item-summary">Name</summary>
                        <p className="character-info-item-data">{ character.name }</p>
                    </details>

                    <details className="character-info-item" open>
                        <summary className="character-info-item-summary">Species</summary>
                        <p className="character-info-item-data">{ character.species }</p>
                    </details>

                    <details className="character-info-item" open>
                        <summary className="character-info-item-summary">Gender</summary>
                        <p className="character-info-item-data">{ character.gender }</p>
                    </details>

                    <details className="character-info-item" open>
                        <summary className="character-info-item-summary">Location</summary>
                        <p className="character-info-item-data">{ character.location.name }</p>
                    </details>

                </div>

                <div className="character-image-container">
                    <img className="character-image" src={ character.image } alt={ character.name } />
                </div>

            </div>

        </details>
    );
}