var geom = {
  type: "Point", coordinates: [
    38.6439446,
    -9.0562832
  ]
}

var baseQ = { location: { $near: { $geometry: geom } } }

const geom = (coords, type) => {return {type: type || "Point", coordinates: coords}}

const place1 = {name: "Salinas Samouco", location: geom([-8.981743848922106, 38.74433603083747])}
const place2 = {name: "Praia Fluvial Samouco", location: geom([-9.01016763389186, 38.729668860666614])}
const place3 = {name: "Praia Moinhos", location: geom([-8.9710942192377, 38.74873175316257])}

db.places.insertMany([place1, place2, place3])

const search1_loc = [-8.971909610754514, 38.7412006947441]

db.places.find({location: {$near: {$geometry: geom([-8.971909610754514, 38.7412006947441]), $maxDistance: 10000, $minDistance: 1000}}}) 

const areaPoints = [
  [-8.9842173297778, 38.74914012014725],
  [-8.970359733650698, 38.749927126332494],
  [-8.965358280970184, 38.7389808400496],
  [-8.98518546865835, 38.73904055158477],
  [-8.9842173297778, 38.74914012014725]
]


db.places.find(
  {
    location: {
      $geoWithin: {
         $geometry: {
            type : "Polygon" ,
            coordinates: [
              [
                [-8.9842173297778,38.74914012014725],[-8.970359733650698,38.749927126332494],[-8.965358280970184,38.7389808400496],[-8.98518546865835,38.73904055158477],[-8.9842173297778,38.74914012014725]
              ]
            ]
         }
      }
    }
  }
)

db.areas.createIndex({area: "2dsphere"})
db.areas.insertOne({name: "some area", area: {type: "Polygon", coordinates: [[[-8.9842173297778,38.74914012014725],[-8.970359733650698,38.749927126332494],[-8.965358280970184,38.7389808400496],[-8.98518546865835,38.73904055158477],[-8.9842173297778,38.74914012014725]]]}})

db.areas.find({area: {$geoIntersects: {$geometry: {type: "Point", coordinates: [-8.944610001134448, 38.74897886933705]}}}})
db.areas.find({area: {$geoIntersects: {$geometry: {type: "Point", coordinates: [-8.971909610754514, 38.7412006947441]}}}})

db.areas.find({area: {$geoIntersects: {$geometry: {type: "Point", coordinates: [ -8.9710942192377, 38.74873175316257 ]}}}}) 

