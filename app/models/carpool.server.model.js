'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var validateReturnTime = function(returnTime) {
	return this.departureTime < returnTime;
};

/**
 * Carpool Schema
 */
var CarpoolSchema = new Schema({
	destination: {
		type: String,
		default: '',
		required: 'Please fill Carpool destination',
		trim: true
	},

	departureTime: {
		type: Date,
		default: Date.now,
		required: 'Please fill Carpool departure time'
	},

	returnTime: {
		type: Date,
		default: Date.now,
		required: 'Please fill Carpool departure time',
		validate: [validateReturnTime, 'Return time should come after departure time.']
	},


	numSeats: {
		type: Number,
		required: 'Please fill Carpool number of seats'
	},
	note: {
		type: String,
		default: '',
		trim: true
	},

	riders: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],


	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

// virtual field for expired true/false
CarpoolSchema.virtual('expired').get(function() {
	return new Date() > this.departureTime;
});

// this returns the virtual fields
CarpoolSchema.set('toJSON', { virtuals: true });
CarpoolSchema.set('toObject', { virtuals: true });

mongoose.model('Carpool', CarpoolSchema);
