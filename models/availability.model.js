var mongoose = require('mongoose');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const AvailabilitySchema = new mongoose.Schema({
    teacherId: Number,
    lastSession: Date,
    availability: [
        {   
            sessionDate: Date,
            sessionData: {
                total: Number,
                session: [
                    {
                        id: ObjectId,
                        startTime: Date,
                        endTime: Date,
                        isBooked: {
                            type: Boolean,
                            default: false
                        }, 
                        isDeleted: {
                            type: Boolean,
                            default: false
                        }
                    }
                ]
            }
        }
    ]

},
{
    versionKey: false,
}
);

AvailabilitySchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (doc, rec) => {
      delete rec._id;
    },
  });

module.exports = mongoose.model('Availability', AvailabilitySchema, 'Availability');