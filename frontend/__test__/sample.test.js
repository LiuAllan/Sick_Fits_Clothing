describe('sample test 101', () => {
	//Test 1
	it('works as expected', () => {
		expect(1).toEqual(1);
		const age = 100;
		expect(age).toEqual(100);

	});
	//Test 2
	it('handles ranges just fine', () => {
		const age = 200;
		expect(age).toBeGreaterThan(100);
	});

	it('makes a list of dog names', () => {
		const dogs = ['Mars', 'bars'];
		expect(dogs).toEqual(dogs);
		expect(dogs).toContain('bars');
	})
});