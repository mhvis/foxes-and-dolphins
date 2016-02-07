/**
 * Animal.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        game: {
            model: 'game',
            required: true
        },
        cell: {
            model: 'cell',
            required: true
        },
        type: {
            type: 'string',
            enum: ['fox', 'dolphin'],
            required: true
        }
    }
};
