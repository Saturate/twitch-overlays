import React, { Component } from 'react';
import { Route, Link, HashRouter, Switch } from 'react-router-dom';
import './App.css';

import BottomDonatorWidget from './BottomDonatorWidget';
import TopDonatorListWidget from './TopDonatorListWidget';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentUser: window.userName,
		};
	}
	render() {
		return <div>
			<h1>Welcome, {this.state.currentUser}</h1>
			<p>This is a overview, this should be used to navigate to the component you want in OBS Browser Source.</p>
			<p><Link to="/BottomDonator">Open Bottom Donator Widget.</Link></p>
			<p><a href="#/TopDonatorList/25">Open TopDonator List Widget.</a></p>
		</div>;
	}
}

class Main extends React.Component{
	render() {
		return <div>
			<Switch>
				<Route exact path='/' component={Home}/>
				<Route path='/BottomDonator' component={BottomDonatorWidget}/>
				<Route path='/TopDonatorList/:number' component={TopDonatorListWidget}/>
			</Switch>
		</div>;
	}
}

class App extends Component {
	render() {
		return (
			<HashRouter>
				<Main />
			</HashRouter>
		);
	}
}

export default App;
