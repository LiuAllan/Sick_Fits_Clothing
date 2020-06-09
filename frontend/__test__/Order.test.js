import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import Order, { SINGLE_ORDER_QUERY } from '../components/Order';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeOrder } from '../lib/testUtils';

const mocks = [
	{
		request: {
			query: SINGLE_ORDER_QUERY,
			variables: {
				id: 'ord123'
			},
		},
		result: {
			data: {
				order: fakeOrder()
			},
		},
	},
];

describe('<Orders />', () => {
	it('renders the order and matches snapshot', async() => {
		const wrapper = mount (
			<MockedProvider mocks={mocks}>
				<Order id="ord123"/>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		// console.log(wrapper.debug());
		const order = wrapper.find('OrderStyles');
		expect(toJSON(order)).toMatchSnapshot();
	});
})