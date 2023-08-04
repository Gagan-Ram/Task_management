const Joi = require("joi");


const saveTask = Joi.object().keys({

    title: Joi.string().required(),

    description: Joi.string().required(),

    dueDate: Joi.date().required(),

})

module.exports = {
    saveTask
}