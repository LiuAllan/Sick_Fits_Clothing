import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import Nprogress from 'nprogress';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer } from 'react-apollo';
import TakeMyMoney, { CREATE_ORDER_MUTATION } from '../components/TakeMyMoney';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

Router.router = { push() {} };

const mocks = [
	{
		request: {
			query: CURRENT_USER_QUERY
		},
		result: {
			data: {
				me: {
					...fakeUser(),
					cart: [fakeCartItem()]
				},
			},
		},
	},
];

describe('<TakeMyMoney />', () => {
	it('renders and matches snapshot', async() => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<TakeMyMoney />
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		//find the button
		const checkoutButton = wrapper.find('ReactStripeCheckout');
		expect(toJSON(checkoutButton)).toMatchSnapshot();
	});

	it('creates an order ontoken', async() => {
		const creaOrderMock = jest.fn().mockResolvedValue({
			data: { createOrder: { id: 'xyz789' } }
		});

		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<TakeMyMoney />
			</MockedProvider>
		);

		const component = wrapper.find('TakeMyMoney').instance();
		//manually call onToken method
		component.onToken({ id: 'abc123' }, creaOrderMock);
		expect(creaOrderMock).toHaveBeenCalled();
		expect(creaOrderMock).toHaveBeenCalledWith({ variables: { token: 'abc123' } });
	});

	it('turns the progress bar on', async() => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<TakeMyMoney />
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		Nprogress.start = jest.fn();
		const creaOrderMock = jest.fn().mockResolvedValue({
			data: { createOrder: { id: 'xyz789' } }
		});
		const component = wrapper.find('TakeMyMoney').instance();
		//manually call onToken method
		component.onToken({ id: 'abc123' }, creaOrderMock);
		expect(Nprogress.start).toHaveBeenCalled();
	});

	it('routes to the order page when completed', async() => {
	    const wrapper = mount(
	      <MockedProvider mocks={mocks}>
	        <TakeMyMoney />
	      </MockedProvider>
	    );
	    await wait();
	    wrapper.update();
	    const createOrderMock = jest.fn().mockResolvedValue({
	      data: { createOrder: { id: 'xyz789' } },
	    });
	    const component = wrapper.find('TakeMyMoney').instance();
	    Router.router.push = jest.fn();
	    // manully call that onToken method
	    component.onToken({ id: 'abc123' }, createOrderMock);
	    await wait();
	    expect(Router.router.push).toHaveBeenCalledWith({
	    	pathname: '/order',
    		query: {
    			id: 'xyz789',
			},
	    });
	})

})