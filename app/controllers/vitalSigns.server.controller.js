const mongoose = require('mongoose');
const VitalSign = require('mongoose').model('VitalSign')
const tf = require('@tensorflow/tfjs');
// require('@tensorflow/tfjs-node');

//
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};

//********************************************************************* */
// Vital signs by patient Id
//********************************************************************* */
exports.vitalSignsBypatient = function (req, res) {
    VitalSign.find({ patient: req.params.userId })
        .populate('createdBy')
        .exec((err, vitalSigns) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(vitalSigns);
            }
        });
};


//********************************************************************* */
// 		Create vital signs
//********************************************************************* */
exports.create = function (req, res, next) {

    var vitalSigns = new VitalSign(req.body);
    vitalSigns.save(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(vitalSigns);
        }
    });
};

//********************************************************************* */
// 		Create vital signs
//********************************************************************* */
exports.ia = function (req, res, next) {

    const syntoms = req.body

    const syntomsArray = [
        Number(syntoms.syntom1),
        Number(syntoms.syntom2),
        Number(syntoms.syntom3),
        Number(syntoms.syntom4),
        Number(syntoms.syntom5),
        Number(syntoms.syntom6),
        Number(syntoms.syntom7),
        Number(syntoms.syntom8),
        Number(syntoms.syntom9),
        Number(syntoms.syntom10),
        Number(syntoms.syntom11),
        Number(syntoms.syntom12),
        Number(syntoms.syntom13),
        Number(syntoms.syntom14),
        Number(syntoms.syntom15),
        Number(syntoms.syntom16),
        Number(syntoms.syntom17)
    ];

    async function run() {
        //linear stack of layers
        const model = tf.sequential();

        //Creating input layer
        model.add(tf.layers.dense({
            units: 16,
            inputShape: [17]
        }));
        //Creating output layer
        model.add(tf.layers.dense({
            units: 6
        }));
        //Rules for the model
        model.compile({
            loss: 'meanSquaredError',
            optimizer: 'sgd'
        });

        /*
            1. Joint pain, tenderness and stiffness.
            2. Restricted movement of joints.
            3. Inflammation in and around the joints.
            -----------
            4. Heart Disease.
            5. Kidney Disease.
            6. Shortness of breath      **
            --------------------
            7. Coughing.
            8. A tight sensation in the chest.
            -----------------
            9.  finding unexpected lump
            10. unexperimented weight loss
            11. unexplained blood in the when coughing , urine,    ***
            -------------------------
            12.Sore throat
            13. headaches
            14. fatigue
            -------------------
            15. feeling sick
            16. swollen ankles, feet or hands
            17. tirdness    
            --------------------------------*/
        //xs input layer
        const xtrain = tf.tensor2d([
            //1  2  3    4  5  6     7  8   9  10 11    12 13 14     15 16 17
            [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
            [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],

            [0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
            [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
            [1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],

            [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1],
            [0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1]
        ]);

        /*
        Output Layer
        Arthritis  -   Hypertension -  Asthma -  cancer - Bronchitis - chronic kidney disease 
        */
        const ytrain = tf.tensor2d([
            [1, 0, 1, 1, 1, 1],
            [1, 0, 0, 1, 0, 0],
            [1, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 0],

            [0, 1, 0, 1, 1, 1],
            [0, 1, 0, 1, 1, 1],
            [1, 1, 0, 1, 1, 1],

            [0, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0],
            [0, 1, 1, 0, 0, 1]
        ]);

        //train the model
        model.fit(xtrain, ytrain, {
            epochs: 2000
        }).then(() => {

            const data = tf.tensor2d([syntomsArray])

            const prediction = model.predict(data);

            // model.evaluate(x_test, y_test, batch_size=128)
            prediction.print();

            prediction.array().then(array => {
                console.log(array[0])
                var resultForData1 = array[0];
                // var resultForData2 = array[1]; ...
                 var dataToSent = { 
                    row1: resultForData1 
                    // row2: resultForData2, ...
                 }
                 console.log(dataToSent)
            res.status(200).send(dataToSent);
            })

        })
    }
    run();

};