import debug from 'debug';

const log = debug('utilities:getTopDonators');

function compareAmount(a, b) {
	return b.amount - a.amount;
}

function getTopDonators(allDonations) {
	let topDonators = [];
	allDonations.forEach(donation => {
		let donator = topDonators.find(function(donator) {
			return donator.name === donation.name ? donator : false;
		});
	
		if(!donator) {
			topDonators.push({
				donation_id: donation.donation_id,
				name: donation.name,
				currency: donation.currency,
				amount: parseInt(donation.amount, 10)
			});
		} else {
			donator.amount = donator.amount + parseInt(donation.amount, 10);
		}
	
		log(donator);
	});

	log(`Return ${topDonators.length} donators.`);

	return topDonators.sort(compareAmount);
}

export default getTopDonators;