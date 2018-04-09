import React, { Component } from 'react';

class TopDonatorListWidget extends Component {
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

export default TopDonatorListWidget;