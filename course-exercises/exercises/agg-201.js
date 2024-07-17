db.friends.aggregate(
  [
    { $group: { _id: { age: "$age" }, allHobbies: {$push: "$hobbies" } } }
  ]
)

db.friends.aggregate(
  [
    { $unwind: "$hobbies" },
    { $group: { _id: { age: "$age" }, allHobbies: {$push: "$hobbies" } } }
  ]
)

db.friends.aggregate(
  [
    { $unwind: "$hobbies" },
    { $group: { _id: { age: "$age" }, allHobbies: {$addToSet: "$hobbies" } } }
  ]
)