db.persons.aggregate(
  [
    {
      $project: {
        _id: 0,
        email: 1,
        gender: 1,
        birthDate: { $convert: { input: "$dob.date", to: "date" } },
        age: "$dob.age",
        location: {
          type: "Point",
          coordinates: [
            { $convert: { input: "$location.coordinates.longitude", to: "double" } },
            { $convert: { input: "$location.coordinates.latitude", to: "double" } }
          ]
        },
        fullName: {
          $concat: [
            { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
            {
              $substrCP: [
                "$name.first",
                1,
                { $subtract: [{ $strLenCP: "$name.first" }, 1] }]
            },
            " ",
            { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
            {
              $substrCP: [
                "$name.last",
                1,
                { $subtract: [{ $strLenCP: "$name.last" }, 1] }]
            },
          ]
        }
      }
    }
  ]
)