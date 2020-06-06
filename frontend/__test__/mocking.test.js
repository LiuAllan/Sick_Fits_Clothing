function Person(name, foods) {
	this.name = name;
	this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
	return new Promise((resolve, reject) => {
		//Simulate an API
		setTimeout(() => resolve(this.foods), 2000);
	})
}


describe('mocking learning', () => {
	it('mocks a reg function', () => {
		const fetchDogs = jest.fn();
		fetchDogs('snickers');
		expect(fetchDogs).toHaveBeenCalled();

		//test will fail here because fetchDogs does not call anything
		expect(fetchDogs).toHaveBeenCalledWith('snickers');
		fetchDogs('hugo');
		expect(fetchDogs).toHaveBeenCalledTimes(2);
	})

	it('can create a person', () => {
		const me = new Person('Allan', ['pizza', 'burger']);
		expect(me.name).toBe('Allan');
	})


	it('can fetch foods', async() => {
		const me = new Person('Allan', ['pizza', 'burger']);
		
		//swap out fetchFavFoods function with mock and just simulate it
		me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi'])
		const favFoods = await me.fetchFavFoods();
		expect(favFoods).toContain('sushi');
	})
})