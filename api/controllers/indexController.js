const networkConnection = require('../utils/networkConnection');

exports.queryCar = (req, res) => {
    networkConnection
        .evaluateTransaction('queryCar', [req.query.car])
        .then(result => {
            if (result) {
                res.json({ result: JSON.parse(result.toString()) });
            } else {
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
};

exports.queryAllCars = (req, res) => {
    networkConnection
        .evaluateTransaction('queryAllCars')
        .then(result => {
            if (result) {
                res.json({ result: JSON.parse(result.toString()) });
            } else {
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
};

exports.createCar = (req, res) => {
    const { carNumber, make, model, color, owner } = req.body;
    networkConnection
        .submitTransaction('createCar', [carNumber, make, model, color, owner])
        .then(() => {
            res.json({ result: 'Car created', Attributes: { carNumber, make, model, color, owner } });
        });

};