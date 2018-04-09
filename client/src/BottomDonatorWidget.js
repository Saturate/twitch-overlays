import React, { Component } from 'react';

class BottomDonatorWidget extends Component {
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

export default BottomDonatorWidget;