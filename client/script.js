
class BottomDonatorWidget extends React.Component {
	constructor(props) {
		super(props);
	
		this.state = {
			donatorlast: '...',
			top: {
				name: 'N/A'
			}
		};
	}
	fetchData () {
		console.log('fetching data...');

		fetch('/graphql', {
			credentials: 'include',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: `
			{
				topDonations(top: 1) {
					name
					amount
					currency
				}
				donations(limit: 1) {
				  donation_id
				  name
				  currency
				  amount
				  message
				  email
				}
			}
			`}),
		})
			.then(res => res.json())
			.then(res => {
				console.log(res.data.donations);

				this.setState({
					donatorlast: res.data.donations[0],
					top: res.data.topDonations[0]
				});
			});
	}
	componentDidMount() {
		this.fetchData();

		setInterval(this.fetchData, 30000); // Update data every 30000 mili sec
	}
	parseAmount (amount) {
		return parseFloat(amount);
	}
	render() {
		return <div className="tw-donates">
			<p className="tw-donates__cat tw-donates__cat--left">
				<span>Top Donator</span><br />
				<span className="tw-donates__username">
					{this.state.top.name}:&nbsp;
					{this.parseAmount(this.state.top.amount)} &nbsp;
					{this.state.top.currency}
				</span>
			</p>
			<p className="tw-donates__cat tw-donates__cat--right">
				<span>Last Donator</span><br />

				<span className="tw-donates__username">
					{this.state.donatorlast.name}:&nbsp;
					{this.parseAmount(this.state.donatorlast.amount)}&nbsp;
					{this.state.donatorlast.currency}
				</span>
			</p>
		</div>;
	}
}

class TopDonatorListWidget extends React.Component {
	constructor(props) {
		super(props);

		this.showAmount = parseInt(props.match.params.number, 10);

		this.state = {
			topDonations: [],
		};
	}
	fetchData () {
		fetch('/graphql', {
			credentials: 'include',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: `
				{
					topDonations(top: ${this.showAmount}) {
						name
						amount
						donation_id
					}
				}
			`}),
		})
			.then(res => res.json())
			.then(res => {
				this.setState({
					topDonations: res.data.topDonations
				});
			});
	}
	componentDidMount() {
		this.fetchData();
		setInterval(this.fetchData, 30000); // Update data every 30000 mili sec
	}
	parseAmount (amount) {
		return parseFloat(amount);
	}
	render() {
		let rows = [];
		this.state.topDonations.forEach((donator) => {
			rows.push(
				<li key={donator.donation_id} className={donator.donation_id}>{donator.name} <span>({donator.amount} DKK)</span></li>
			);
		});

		return <ul className="tw-topdonators">
			{rows}
		</ul>;
	}
}


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
			<p><a href="#/BottomDonator">Open Bottom Donator Widget.</a></p>
			<p><a href="#/TopDonatorList/25">Open TopDonator List Widget.</a></p>
		</div>;
	}
}

const BrowserRouter = window.ReactRouterDOM.HashRouter;
const Route = window.ReactRouterDOM.Route;
const Switch = window.ReactRouterDOM.Switch;

class App extends React.Component{
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


ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
);

//Connect to socket
const streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`);

//Perform Action on event
streamlabs.on('event', (eventData) => {
	if (!eventData.for && eventData.type === 'donation') {
		//code to handle donation events
		console.log(eventData.message);
	}
	if (eventData.for === 'twitch_account') {
		switch(eventData.type) {
		case 'follow':
			//code to handle follow events
			console.log(eventData.message);
			break;
		case 'subscription':
			//code to handle subscription events
			console.log(eventData.message);
			break;
		default:
			//default case
			console.log(eventData.message);
		}
	}
});