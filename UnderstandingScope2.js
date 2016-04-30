'use strict';
function number() {
	let name = "Jason";
	let money = 1000;
	let addition;
	let subtract;
	let i = 0;
	function numbers(selection) {
		selection.forEach(function(d) {
			let change = 50;
			addition = function() {
				money += change;
				console.log('Addition: ', money.toString());				
			};
			subtract = function() {
				money -= change;
				console.log('Subtract: ', money.toString());
			};
			console.log('I am here', i++);
		});
	}
	numbers.add = function(value) { 
		money = value;
		if (typeof addition === 'function') {
			// console.log(subtract);
			addition();
		}
		return numbers;
	};

	return numbers;
}

let myBalance = number();
// myBalance([1]);
myBalance.add(500);
