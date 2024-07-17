db.friends.aggregate(
  [
    { $group: { _id: { state: "$location.state" }, totalPersons: {$sum: 1} } },
    { $sort: { totalPersons: -1 } },
  ]
)