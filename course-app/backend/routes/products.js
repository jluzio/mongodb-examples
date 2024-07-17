import { Router } from 'express';
import { DbService } from '../db.js';
import { Decimal128, ObjectId } from 'mongodb'

const router = Router();

const products = [
  {
    _id: 'fasdlk1j',
    name: 'Stylish Backpack',
    description:
      'A stylish backpack for the modern women or men. It easily fits all your stuff.',
    price: 79.99,
    image: 'http://localhost:3100/images/product-backpack.jpg'
  },
  {
    _id: 'asdgfs1',
    name: 'Lovely Earrings',
    description:
      "How could a man resist these lovely earrings? Right - he couldn't.",
    price: 129.59,
    image: 'http://localhost:3100/images/product-earrings.jpg'
  },
  {
    _id: 'askjll13',
    name: 'Working MacBook',
    description:
      'Yes, you got that right - this MacBook has the old, working keyboard. Time to get it!',
    price: 1799,
    image: 'http://localhost:3100/images/product-macbook.jpg'
  },
  {
    _id: 'sfhjk1lj21',
    name: 'Red Purse',
    description: 'A red purse. What is special about? It is red!',
    price: 159.89,
    image: 'http://localhost:3100/images/product-purse.jpg'
  },
  {
    _id: 'lkljlkk11',
    name: 'A T-Shirt',
    description:
      'Never be naked again! This T-Shirt can soon be yours. If you find that buy button.',
    price: 39.99,
    image: 'http://localhost:3100/images/product-shirt.jpg'
  },
  {
    _id: 'sajlfjal11',
    name: 'Cheap Watch',
    description: 'It actually is not cheap. But a watch!',
    price: 299.99,
    image: 'http://localhost:3100/images/product-watch.jpg'
  }
];

function mapDocument(document) {
  return {...document, price: document.price.toString()}
}

function productsCol() {
  return DbService.db().collection('products')
}

// Get list of products products
router.get('/', async (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  const queryPage = req.query.page !== undefined ? parseInt(req.query.page) : null;
  const pageSize = req.query.pageSize !== undefined ? parseInt(req.query.pageSize) : 5;

  const cursor = productsCol()
    .find()
  if (queryPage !== null) {
    cursor
      .skip(queryPage * pageSize)
      .limit(pageSize)
  }
  await cursor.toArray()
    .then(products => {
      console.log(products)
      res.status(200).json(products.map(mapDocument))
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'An error occured' });
    });
});

// Get single product
router.get('/:id', (req, res, next) => {
  productsCol()
    .findOne({_id: new ObjectId(req.params.id)})
    .then(productDoc => {
      console.log(productDoc)
      if (productDoc === null) {
        res.status(404).json({ message: 'Not found' })
      } else {
        res.status(200).json(mapDocument(productDoc))
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'An error occured' });
    })
});

// Add new product
// Requires logged in user
router.post('', async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: new Decimal128(String(req.body.price)), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  console.log(newProduct);

  productsCol()
    .insertOne(newProduct)
    .then(response => {
      console.log(response)
      res.status(201).json({ message: 'Product added', productId: response.insertedId })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'An error occured' });
    })
});

// Edit existing product
// Requires logged in user
router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: new Decimal128(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  console.log(updatedProduct);

  productsCol()
  .updateOne({_id: new ObjectId(req.params.id)}, {'$set': updatedProduct})
  .then(response => {
    console.log(response)
    res.status(200).json({ message: 'Product updated', productId: response.upsertedId });
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: 'An error occured' });
  })

});

// Delete a product
// Requires logged in user
router.delete('/:id', (req, res, next) => {
  productsCol()
    .deleteOne({_id: new ObjectId(req.params.id)})
    .then(response => {
      console.log(response)
      res.status(200).json({ message: 'Product deleted' });
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'An error occured' });
    })
});

export default router;