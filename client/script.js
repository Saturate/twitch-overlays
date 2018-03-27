
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
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `
            {
                donations {
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
            console.log(res.data.donations)

            this.setState({
                donatorlast: res.data.donations[0],
                top: res.data.donations[1]
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
        </div>
    }
}

class App extends React.Component{
    render() {
        return <div>
            <BottomDonatorWidget />
        </div>
    }
 }

ReactDOM.render(
    <App />,
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