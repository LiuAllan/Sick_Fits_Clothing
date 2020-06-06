import ItemComponent from '../components/Item';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
	id: 'ABC123',
	title: 'A cool item',
	price: 5000,
	description: 'very cool item',
	image: 'dog.jpg',
	largeImage: 'largedog.dpg'
};

//Snapshop testing
describe('<Item />', () => {
	it('renders and matches the snapshot', () => {
		const wrapper = shallow(<ItemComponent item={fakeItem} />);
		expect(toJSON(wrapper)).toMatchSnapshot();
	})
})

// describe('<Item />', () => {
// 	it('renders the image properly', () => {
// 		const wrapper = shallow(<ItemComponent item={fakeItem}/>);
// 		const img = wrapper.find('img');
// 		// console.log(img.props());
// 		expect(img.props().src).toBe(fakeItem.image);
// 		expect(img.props().alt).toBe(fakeItem.title);
// 	});

// 	it('renders pricetag and title and displays properly', () => {
// 		const wrapper = shallow(<ItemComponent item={fakeItem}/>);
// 		const PriceTag = wrapper.find('PriceTag')
// 		// console.log(PriceTag.dive().debug());
// 		expect(PriceTag.children().text()).toBe('$50');

// 		expect(wrapper.find('Title a').text()).toBe(fakeItem.title);

// 	});

// 	it('renders out the buttons properly', () => {
// 		//Mounting wrapper/ rendering the component to the screen
// 		const wrapper = shallow(<ItemComponent item={fakeItem}/>);
// 		//Find the items we want to check in the component
// 		const ButtonList = wrapper.find('.buttonList');
// 		//Check are the thing s being rendered out as I expect them to be
// 		expect(ButtonList.children()).toHaveLength(3);
// 		expect(ButtonList.find('Link')).toHaveLength(1);
// 		expect(ButtonList.find('DeleteItem').exists()).toBe(true);
// 		// console.log(ButtonList.children());
// 	});
// })